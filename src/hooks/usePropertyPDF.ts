import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyPDFGenerator } from '@/lib/pdf/propertyPdfGenerator';
import { toast } from 'sonner';

export const usePropertyPDF = () => {
  const generatePDF = useCallback(async (propertyId: string) => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-generation' });
      
      // Fetch property data with relationships
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          building:buildings(*),
          developer:developers(*)
        `)
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Property not found');

      // Generate PDF
      const generator = new PropertyPDFGenerator();
      const pdf = await generator.generatePropertySheet({
        property: data,
        building: data.building,
        project: data,
        developer: data.developer
      });

      // Download
      const fileName = `property-${data.project_code || data.url_slug || propertyId}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF generated successfully!', { id: 'pdf-generation' });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-generation' });
    }
  }, []);

  const generateBatchPDF = useCallback(async (propertyIds: string[]) => {
    try {
      toast.loading(`Generating ${propertyIds.length} PDFs...`, { id: 'batch-pdf' });
      
      // Generate PDFs for each property
      for (let i = 0; i < propertyIds.length; i++) {
        const propertyId = propertyIds[i];
        
        // Fetch property data
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            building:buildings(*),
            developer:developers(*)
          `)
          .eq('id', propertyId)
          .single();

        if (error) {
          console.error(`Error fetching property ${propertyId}:`, error);
          continue;
        }

        // Generate PDF
        const generator = new PropertyPDFGenerator();
        const pdf = await generator.generatePropertySheet({
          property: data,
          building: data.building,
          project: data,
          developer: data.developer
        });

        // Download with delay to avoid browser blocking
        const fileName = `property-${data.project_code || data.url_slug || propertyId}.pdf`;
        pdf.save(fileName);
        
        // Small delay between downloads
        if (i < propertyIds.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      toast.success(`Generated ${propertyIds.length} PDFs successfully!`, { id: 'batch-pdf' });
      
    } catch (error) {
      console.error('Error generating batch PDFs:', error);
      toast.error('Failed to generate PDFs', { id: 'batch-pdf' });
    }
  }, []);

  return {
    generatePDF,
    generateBatchPDF
  };
};