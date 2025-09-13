import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface PropertyPDFData {
  property: any;
  developer?: any;
  project?: any;
  building?: any;
}

export class PropertyPDFGenerator {
  private doc: jsPDF;
  
  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  }
  
  async generatePropertySheet(data: PropertyPDFData): Promise<jsPDF> {
    const { property, developer, project, building } = data;
    
    // Header avec titre et badge Golden Visa
    await this.addHeader(property);
    
    // Informations principales
    this.addMainInfo(property, project, building);
    
    // Détails Cyprus spécifiques
    this.addCyprusDetails(property);
    
    // Informations financières
    this.addFinancialInfo(property);
    
    // QR Code pour visite virtuelle
    await this.addQRCode(property);
    
    // Footer avec contact
    this.addFooter(developer);
    
    return this.doc;
  }
  
  private async addHeader(property: any) {
    // Titre
    this.doc.setFontSize(20);
    this.doc.setFont(undefined, 'bold');
    const title = property.title || `${property.property_type || 'Property'} - ${property.unit_number || 'N/A'}`;
    this.doc.text(title, 20, 20);
    
    // Badge Golden Visa si éligible
    if (property.golden_visa_eligible || (property.price && property.price >= 300000)) {
      this.doc.setFillColor(255, 215, 0); // Gold
      this.doc.rect(150, 15, 40, 10, 'F');
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(10);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('GOLDEN VISA', 155, 22);
      this.doc.setTextColor(0, 0, 0);
    }
    
    // Prix en évidence
    if (property.price) {
      this.doc.setFontSize(16);
      this.doc.setFont(undefined, 'bold');
      this.doc.text(`€${property.price.toLocaleString()}`, 20, 35);
    }
  }
  
  private addMainInfo(property: any, project: any, building: any) {
    let y = 50;
    this.doc.setFontSize(14);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Property Information', 20, y);
    
    y += 10;
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    
    // Type et superficie
    this.doc.text(`Type: ${property.property_type || 'N/A'}`, 20, y);
    this.doc.text(`Area: ${property.built_area_m2 || property.total_area || 'N/A'} m²`, 100, y);
    
    y += 7;
    // Chambres et salles de bain
    this.doc.text(`Bedrooms: ${property.bedrooms_range || property.bedrooms || 'N/A'}`, 20, y);
    this.doc.text(`Bathrooms: ${property.bathrooms_range || property.bathrooms || 'N/A'}`, 100, y);
    
    y += 7;
    // Projet et promoteur
    if (project?.title) {
      this.doc.text(`Project: ${project.title}`, 20, y);
      y += 7;
    }
    
    // Localisation
    if (property.city || property.cyprus_zone) {
      this.doc.text(`Location: ${property.city || property.cyprus_zone || 'Cyprus'}`, 20, y);
      y += 7;
    }
  }
  
  private addCyprusDetails(property: any) {
    let y = 100;
    this.doc.setFontSize(14);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Cyprus Legal Information', 20, y);
    
    y += 10;
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    
    // Title Deed
    this.doc.text(`Title Deed: ${property.title_deed_number || 'Pending'}`, 20, y);
    this.doc.text(`Status: ${property.title_deed_status || 'In Process'}`, 100, y);
    
    y += 7;
    // Energy Certificate
    this.doc.text(`Energy Rating: ${property.energy_certificate_rating || 'B'}`, 20, y);
    this.doc.text(`Construction Phase: ${property.construction_phase || 'Planned'}`, 100, y);
    
    y += 7;
    // Permits
    if (property.planning_permit_number) {
      this.doc.text(`Planning Permit: ${property.planning_permit_number}`, 20, y);
      y += 7;
    }
    
    if (property.building_permit_number) {
      this.doc.text(`Building Permit: ${property.building_permit_number}`, 20, y);
      y += 7;
    }
  }
  
  private addFinancialInfo(property: any) {
    let y = 150;
    this.doc.setFontSize(14);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Financial Details', 20, y);
    
    y += 10;
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    
    // Prix
    const price = property.price || 0;
    this.doc.text(`Base Price: €${price.toLocaleString()}`, 20, y);
    
    y += 7;
    // TVA - Auto-calculate based on Cyprus rules
    const vatRate = this.calculateVATRate(property);
    const vatAmount = price * (vatRate / 100);
    this.doc.text(`VAT (${vatRate}%): €${vatAmount.toLocaleString()}`, 20, y);
    
    y += 7;
    // Transfer fees
    const transferRate = property.transfer_fee_percentage || 5;
    const transferFee = price * (transferRate / 100);
    this.doc.text(`Transfer Fee (${transferRate}%): €${transferFee.toLocaleString()}`, 20, y);
    
    y += 10;
    // Total
    const total = price + vatAmount + transferFee;
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(`Total Investment: €${total.toLocaleString()}`, 20, y);
    
    // Prix par m²
    if (property.built_area_m2 || property.total_area) {
      const area = property.built_area_m2 || property.total_area;
      const pricePerSqm = Math.round(price / area);
      y += 7;
      this.doc.setFontSize(10);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(`Price per m²: €${pricePerSqm.toLocaleString()}`, 20, y);
    }
  }
  
  private calculateVATRate(property: any): number {
    // Cyprus VAT rules: 5% for residential ≤200m², 19% otherwise
    if (property.vat_rate) return property.vat_rate;
    if (property.property_type === 'commercial') return 19;
    
    const area = property.built_area_m2 || property.total_area;
    if (area && area > 200) return 19;
    
    return 5;
  }
  
  private async addQRCode(property: any) {
    try {
      const url = `${window.location.origin}/projects/${property.url_slug || property.id}`;
      const qrDataUrl = await QRCode.toDataURL(url, { 
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Ajouter QR code en bas à droite
      this.doc.addImage(qrDataUrl, 'PNG', 150, 240, 40, 40);
      this.doc.setFontSize(8);
      this.doc.text('Property Details', 158, 285);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }
  
  private addFooter(developer: any) {
    const y = 270;
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Contact Information', 20, y);
    
    this.doc.setFont(undefined, 'normal');
    if (developer?.name) {
      this.doc.text(`Developer: ${developer.name}`, 20, y + 7);
    }
    
    if (developer?.email_primary) {
      this.doc.text(`Email: ${developer.email_primary}`, 20, y + 14);
    }
    
    if (developer?.phone_numbers?.[0]) {
      this.doc.text(`Phone: ${developer.phone_numbers[0]}`, 20, y + 21);
    }
    
    // Date de génération
    this.doc.setFontSize(8);
    this.doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, y + 21);
  }
}