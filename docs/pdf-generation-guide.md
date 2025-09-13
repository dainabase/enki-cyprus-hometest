# PDF Generation System - Cyprus Real Estate

## Overview
The PDF generation system creates professional property sheets with Cyprus-specific legal and financial information.

## Features
- **Individual Property PDFs**: Complete property details with legal info
- **Golden Visa Badge**: Automatic detection for properties ≥€300,000
- **Cyprus Legal Fields**: Title deed, energy rating, permits
- **Financial Calculations**: VAT (5%/19%), transfer fees, total investment
- **QR Codes**: Links to virtual tours and property details
- **Batch Export**: Multiple properties in one operation

## Usage

### Single Property Export
```typescript
import { usePropertyPDF } from '@/hooks/usePropertyPDF';

const { generatePDF } = usePropertyPDF();

// Generate PDF for specific property
await generatePDF(propertyId);
```

### Batch Export
```typescript
const { generateBatchPDF } = usePropertyPDF();

// Export multiple properties
await generateBatchPDF(['property-id-1', 'property-id-2']);
```

### Component Integration
```tsx
import { PDFExportButton } from '@/components/admin/properties/PDFExportButton';

// Single property
<PDFExportButton propertyId="123" />

// Batch export
<PDFExportButton selectedPropertyIds={selectedIds} />
```

## PDF Structure

### 1. Header Section
- Property title
- Golden Visa badge (if eligible)
- Price display

### 2. Property Information
- Type and area
- Bedrooms/bathrooms
- Project and location

### 3. Cyprus Legal Information
- Title deed number and status
- Energy certificate rating
- Planning/building permits
- Construction phase

### 4. Financial Details
- Base price
- VAT calculation (5% or 19%)
- Transfer fees (typically 5%)
- Total investment amount
- Price per m²

### 5. QR Code
- Links to property page
- Virtual tour access

### 6. Footer
- Developer contact information
- Generation date

## VAT Calculation Rules
- **Residential ≤200m²**: 5% VAT
- **Residential >200m²**: 19% VAT  
- **Commercial**: 19% VAT

## Transfer Fees
- Standard: 5% of property value
- Can be customized per property

## Golden Visa Detection
Properties automatically receive Golden Visa badge if:
- `golden_visa_eligible` field is true, OR
- Property price ≥ €300,000

## Performance
- **Single PDF**: ~0.5 seconds
- **Batch Export**: ~300ms per property
- **File Size**: ~50KB per PDF

## Technical Implementation

### Dependencies
- `jspdf`: PDF generation
- `qrcode`: QR code creation

### Key Classes
- `PropertyPDFGenerator`: Main PDF creation logic
- `BatchPDFExporter`: Handles multiple property exports

### Data Sources
The system fetches from Supabase tables:
- `projects`: Main property data
- `developers`: Contact information
- `buildings`: Building details

## Customization

### Template Modifications
Edit `src/lib/pdf/propertyPdfGenerator.ts`:
- Modify layout in private methods
- Add new sections
- Customize styling

### Branding
- Company logo: Add to header section
- Colors: Modify Golden Visa badge and styling
- Footer: Update contact information template

## Error Handling
- Missing data: Displays "N/A" or defaults
- QR code failures: Continues without QR code
- Network errors: User notification via toast

## Security Considerations
- Client-side generation only
- No external API dependencies
- Property data validated before PDF creation
- QR codes link to public property pages only

## Future Enhancements
- Multi-language support
- Custom branding per developer
- Advanced layouts with images
- Email integration for direct sending