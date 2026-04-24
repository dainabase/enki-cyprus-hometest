import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface PropertyPDFFields {
  id?: string;
  title?: string | null;
  property_type?: string | null;
  unit_number?: string | null;
  url_slug?: string | null;
  golden_visa_eligible?: boolean | null;
  price?: number | null;
  built_area_m2?: number | null;
  total_area?: number | null;
  bedrooms?: number | null;
  bedrooms_range?: string | null;
  bathrooms?: number | null;
  bathrooms_range?: string | null;
  city?: string | null;
  cyprus_zone?: string | null;
  title_deed_number?: string | null;
  title_deed_status?: string | null;
  energy_certificate_rating?: string | null;
  construction_phase?: string | null;
  planning_permit_number?: string | null;
  building_permit_number?: string | null;
  vat_rate?: number | null;
  transfer_fee_percentage?: number | null;
}

export interface DeveloperPDFFields {
  name?: string | null;
  email_primary?: string | null;
  phone_numbers?: string[] | null;
}

export interface ProjectPDFFields {
  title?: string | null;
}

export interface BuildingPDFFields {
  building_name?: string | null;
}

export interface PropertyPDFData {
  property: PropertyPDFFields;
  developer?: DeveloperPDFFields;
  project?: ProjectPDFFields;
  building?: BuildingPDFFields;
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

    await this.addHeader(property);
    this.addMainInfo(property, project, building);
    this.addCyprusDetails(property);
    this.addFinancialInfo(property);
    await this.addQRCode(property);
    this.addFooter(developer);

    return this.doc;
  }

  private async addHeader(property: PropertyPDFFields) {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    const title = property.title || `${property.property_type || 'Property'} - ${property.unit_number || 'N/A'}`;
    this.doc.text(title, 20, 20);

    const price = property.price ?? 0;
    if (property.golden_visa_eligible || price >= 300000) {
      this.doc.setFillColor(255, 215, 0);
      this.doc.rect(150, 15, 40, 10, 'F');
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('GOLDEN VISA', 155, 22);
      this.doc.setTextColor(0, 0, 0);
    }

    if (price > 0) {
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`EUR ${price.toLocaleString()}`, 20, 35);
    }
  }

  private addMainInfo(property: PropertyPDFFields, project: ProjectPDFFields | undefined, _building: BuildingPDFFields | undefined) {
    let y = 50;
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Property Information', 20, y);

    y += 10;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    this.doc.text(`Type: ${property.property_type || 'N/A'}`, 20, y);
    this.doc.text(`Area: ${property.built_area_m2 || property.total_area || 'N/A'} m2`, 100, y);

    y += 7;
    this.doc.text(`Bedrooms: ${property.bedrooms_range || property.bedrooms || 'N/A'}`, 20, y);
    this.doc.text(`Bathrooms: ${property.bathrooms_range || property.bathrooms || 'N/A'}`, 100, y);

    y += 7;
    if (project?.title) {
      this.doc.text(`Project: ${project.title}`, 20, y);
      y += 7;
    }

    if (property.city || property.cyprus_zone) {
      this.doc.text(`Location: ${property.city || property.cyprus_zone || 'Cyprus'}`, 20, y);
      y += 7;
    }
  }

  private addCyprusDetails(property: PropertyPDFFields) {
    let y = 100;
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Cyprus Legal Information', 20, y);

    y += 10;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    this.doc.text(`Title Deed: ${property.title_deed_number || 'Pending'}`, 20, y);
    this.doc.text(`Status: ${property.title_deed_status || 'In Process'}`, 100, y);

    y += 7;
    this.doc.text(`Energy Rating: ${property.energy_certificate_rating || 'B'}`, 20, y);
    this.doc.text(`Construction Phase: ${property.construction_phase || 'Planned'}`, 100, y);

    y += 7;
    if (property.planning_permit_number) {
      this.doc.text(`Planning Permit: ${property.planning_permit_number}`, 20, y);
      y += 7;
    }

    if (property.building_permit_number) {
      this.doc.text(`Building Permit: ${property.building_permit_number}`, 20, y);
      y += 7;
    }
  }

  private addFinancialInfo(property: PropertyPDFFields) {
    let y = 150;
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Financial Details', 20, y);

    y += 10;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    const price = property.price || 0;
    this.doc.text(`Base Price: EUR ${price.toLocaleString()}`, 20, y);

    y += 7;
    const vatRate = this.calculateVATRate(property);
    const vatAmount = price * (vatRate / 100);
    this.doc.text(`VAT (${vatRate}%): EUR ${vatAmount.toLocaleString()}`, 20, y);

    y += 7;
    const transferRate = property.transfer_fee_percentage || 5;
    const transferFee = price * (transferRate / 100);
    this.doc.text(`Transfer Fee (${transferRate}%): EUR ${transferFee.toLocaleString()}`, 20, y);

    y += 10;
    const total = price + vatAmount + transferFee;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Total Investment: EUR ${total.toLocaleString()}`, 20, y);

    const area = property.built_area_m2 ?? property.total_area;
    if (area && area > 0) {
      const pricePerSqm = Math.round(price / area);
      y += 7;
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Price per m2: EUR ${pricePerSqm.toLocaleString()}`, 20, y);
    }
  }

  private calculateVATRate(property: PropertyPDFFields): number {
    if (property.vat_rate) return property.vat_rate;
    if (property.property_type === 'commercial') return 19;

    const area = property.built_area_m2 ?? property.total_area;
    if (area && area > 200) return 19;

    return 5;
  }

  private async addQRCode(property: PropertyPDFFields) {
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

      this.doc.addImage(qrDataUrl, 'PNG', 150, 240, 40, 40);
      this.doc.setFontSize(8);
      this.doc.text('Property Details', 158, 285);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  private addFooter(developer: DeveloperPDFFields | undefined) {
    const y = 270;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Contact Information', 20, y);

    this.doc.setFont('helvetica', 'normal');
    if (developer?.name) {
      this.doc.text(`Developer: ${developer.name}`, 20, y + 7);
    }

    if (developer?.email_primary) {
      this.doc.text(`Email: ${developer.email_primary}`, 20, y + 14);
    }

    const firstPhone = developer?.phone_numbers?.[0];
    if (firstPhone) {
      this.doc.text(`Phone: ${firstPhone}`, 20, y + 21);
    }

    this.doc.setFontSize(8);
    this.doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, y + 21);
  }
}
