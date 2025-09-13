import * as XLSX from 'xlsx';

export interface PropertyTemplateRow {
  unit_number: string;
  floor: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size_m2: number;
  price: number;
  status: string;
  view_type?: string;
  orientation?: string;
  balcony_m2?: number;
  terrace_m2?: number;
  parking_spaces?: number;
  storage_units?: number;
  has_sea_view?: string;
  has_pool_access?: string;
  has_gym_access?: string;
  has_mountain_view?: string;
  is_furnished?: string;
}

export const TEMPLATE_COLUMNS = [
  { key: 'unit_number', label: 'Numéro Unité', required: true, example: 'A101' },
  { key: 'floor', label: 'Étage', required: true, example: '1' },
  { key: 'type', label: 'Type', required: true, example: 'studio, 1bed, 2bed, 3bed, 4bed, penthouse, villa, townhouse' },
  { key: 'bedrooms', label: 'Chambres', required: true, example: '2' },
  { key: 'bathrooms', label: 'Salles de bain', required: true, example: '1.5' },
  { key: 'size_m2', label: 'Surface (m²)', required: true, example: '85.5' },
  { key: 'price', label: 'Prix (€)', required: true, example: '250000' },
  { key: 'status', label: 'Statut', required: true, example: 'available, reserved, sold' },
  { key: 'view_type', label: 'Type de vue', required: false, example: 'Sea, Mountain, Garden, City' },
  { key: 'orientation', label: 'Orientation', required: false, example: 'N, NE, E, SE, S, SW, W, NW' },
  { key: 'balcony_m2', label: 'Balcon (m²)', required: false, example: '12.5' },
  { key: 'terrace_m2', label: 'Terrasse (m²)', required: false, example: '0' },
  { key: 'parking_spaces', label: 'Places parking', required: false, example: '1' },
  { key: 'storage_units', label: 'Stockage', required: false, example: '1' },
  { key: 'has_sea_view', label: 'Vue mer (oui/non)', required: false, example: 'oui' },
  { key: 'has_pool_access', label: 'Accès piscine (oui/non)', required: false, example: 'non' },
  { key: 'has_gym_access', label: 'Accès gym (oui/non)', required: false, example: 'non' },
  { key: 'has_mountain_view', label: 'Vue montagne (oui/non)', required: false, example: 'non' },
  { key: 'is_furnished', label: 'Meublé (oui/non)', required: false, example: 'non' },
];

export function generateExcelTemplate(): Blob {
  // Créer le workbook
  const wb = XLSX.utils.book_new();
  
  // Créer les données avec headers et exemples
  const headers = TEMPLATE_COLUMNS.map(col => col.label);
  const examples = [
    TEMPLATE_COLUMNS.map(col => col.example),
    // Quelques lignes d'exemple
    ['A101', '1', '2bed', '2', '1', '85.5', '250000', 'available', 'Garden', 'SE', '12.5', '0', '1', '0', 'non', 'oui', 'oui', 'non', 'non'],
    ['A102', '1', '3bed', '3', '2', '110', '385000', 'available', 'Sea', 'SW', '18', '0', '2', '1', 'oui', 'oui', 'oui', 'non', 'non'],
    ['A201', '2', '1bed', '1', '1', '55', '195000', 'available', 'Garden', 'E', '8', '0', '1', '0', 'non', 'non', 'non', 'non', 'non'],
    ['A301', '3', 'penthouse', '4', '3', '180', '750000', 'available', 'Sea', 'S', '45', '25', '3', '2', 'oui', 'oui', 'oui', 'oui', 'oui'],
  ];
  
  const ws_data = [headers, ...examples];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  
  // Styling des colonnes (largeur)
  const colWidths = TEMPLATE_COLUMNS.map(col => ({ wch: Math.max(col.label.length, 15) }));
  ws['!cols'] = colWidths;
  
  // Ajouter le worksheet au workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Properties Template');
  
  // Créer un second sheet avec instructions
  const instructions = [
    ['INSTRUCTIONS D\'UTILISATION'],
    [''],
    ['1. Remplissez les colonnes selon les exemples fournis'],
    ['2. Les colonnes marquées (required) sont obligatoires'],
    ['3. Pour les colonnes oui/non, utilisez uniquement "oui" ou "non"'],
    ['4. Les types valides sont : studio, 1bed, 2bed, 3bed, 4bed, penthouse, villa, townhouse'],
    ['5. Les statuts valides sont : available, reserved, sold'],
    ['6. Les orientations valides sont : N, NE, E, SE, S, SW, W, NW'],
    ['7. Supprimez les lignes d\'exemple avant l\'import'],
    [''],
    ['GOLDEN VISA : Les propriétés ≥ 300,000€ seront automatiquement marquées Golden Visa'],
  ];
  
  const ws_instructions = XLSX.utils.aoa_to_sheet(instructions);
  XLSX.utils.book_append_sheet(wb, ws_instructions, 'Instructions');
  
  // Générer le fichier
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
}

export function downloadTemplate() {
  const blob = generateExcelTemplate();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `template_properties_enki_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}