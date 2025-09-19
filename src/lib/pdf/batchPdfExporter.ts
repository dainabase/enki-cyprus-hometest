import { PropertyPDFGenerator } from './propertyPdfGenerator';
import { supabase } from '@/integrations/supabase/client';

export interface BatchExportOptions {
  propertyIds: string[];
  includeImages?: boolean;
  mergeIntoSingle?: boolean;
  namePrefix?: string;
}

export class BatchPDFExporter {
  private async fetchPropertiesData(propertyIds: string[]) {
    const { data, error } = await supabase
      .from('projects_clean')
      .select(`
        *,
        building:buildings(*),
        developer:developers(*)
      `)
      .in('id', propertyIds);

    if (error) throw error;
    return data || [];
  }

  async exportBatch(options: BatchExportOptions) {
    const { propertyIds, namePrefix = 'property-export' } = options;
    
    try {
      // Fetch all properties data
      const properties = await this.fetchPropertiesData(propertyIds);
      
      const results = [];
      
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        
        // Generate PDF for each property
        const generator = new PropertyPDFGenerator();
        const pdf = await generator.generatePropertySheet({
          property,
          building: property.building,
          project: property,
          developer: property.developer
        });

        // Create filename
        const fileName = `${namePrefix}-${property.slug || property.id}.pdf`;
        
        results.push({
          property,
          pdf,
          fileName
        });

        // Download with staggered timing to avoid browser blocking
        setTimeout(() => {
          pdf.save(fileName);
        }, i * 300); // 300ms delay between downloads
      }
      
      return {
        success: true,
        count: results.length,
        results
      };
      
    } catch (error) {
      console.error('Batch PDF export error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        count: 0
      };
    }
  }

  async exportSummaryReport(propertyIds: string[]) {
    try {
      const properties = await this.fetchPropertiesData(propertyIds);
      
      const generator = new PropertyPDFGenerator();
      const doc = generator['doc']; // Access private doc
      
      // Title page
      doc.setFontSize(24);
      doc.text('Properties Export Summary', 20, 30);
      
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      doc.text(`Total Properties: ${properties.length}`, 20, 55);
      
      let y = 75;
      
      // Summary statistics
      const totalValue = properties.reduce((sum, p) => sum + ((p as any).price_from || (p as any).price || 0), 0);
      const goldenVisaCount = properties.filter(p => p.golden_visa_eligible || ((p as any).price_from && (p as any).price_from >= 300000)).length;
      
      doc.setFontSize(14);
      doc.text('Summary Statistics', 20, y);
      y += 15;
      
      doc.setFontSize(10);
      doc.text(`Total Portfolio Value: €${totalValue.toLocaleString()}`, 20, y);
      y += 7;
      doc.text(`Golden Visa Eligible: ${goldenVisaCount} (${Math.round(goldenVisaCount/properties.length*100)}%)`, 20, y);
      y += 7;
      doc.text(`Average Price: €${Math.round(totalValue/properties.length).toLocaleString()}`, 20, y);
      
      y += 20;
      
      // Properties list
      doc.setFontSize(14);
      doc.text('Properties List', 20, y);
      y += 15;
      
      doc.setFontSize(8);
      properties.forEach((property, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        const line = `${index + 1}. ${property.title || 'Untitled'} - €${((property as any).price_from || (property as any).price || 0).toLocaleString()}`;
        doc.text(line, 20, y);
        y += 5;
      });
      
      // Download summary
      doc.save('properties-summary-report.pdf');
      
      return { success: true };
      
    } catch (error) {
      console.error('Summary report error:', error);
      return { success: false, error };
    }
  }
}

export const useBatchPDFExporter = () => {
  const exporter = new BatchPDFExporter();
  
  return {
    exportBatch: exporter.exportBatch.bind(exporter),
    exportSummaryReport: exporter.exportSummaryReport.bind(exporter)
  };
};