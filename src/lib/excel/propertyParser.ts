import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedProperty {
  unit_number: string;
  floor: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size_m2: number;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  view_type?: string;
  orientation?: string;
  balcony_m2?: number;
  terrace_m2?: number;
  parking_spaces?: number;
  storage_units?: number;
  has_sea_view?: boolean;
  has_pool_access?: boolean;
  has_gym_access?: boolean;
  has_mountain_view?: boolean;
  is_furnished?: boolean;
  is_golden_visa?: boolean;
  validation_errors?: string[];
}

const VALID_TYPES = ['studio', '1bed', '2bed', '3bed', '4bed', 'penthouse', 'villa', 'townhouse'];
const VALID_STATUS = ['available', 'reserved', 'sold'];
const VALID_ORIENTATIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export async function parseExcelFile(file: File): Promise<{
  success: boolean;
  data: ParsedProperty[];
  errors: string[];
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Prendre la première feuille
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Convertir en CSV pour parser avec PapaParse
        const csv = XLSX.utils.sheet_to_csv(firstSheet);
        
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const { data: parsedData, errors: parseErrors } = validateAndTransformData(results.data);
            resolve({
              success: parseErrors.length === 0,
              data: parsedData,
              errors: parseErrors
            });
          }
        });
      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [`Erreur lors de la lecture du fichier: ${error}`]
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  });
}

export async function parseCSVFile(file: File): Promise<{
  success: boolean;
  data: ParsedProperty[];
  errors: string[];
}> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data: parsedData, errors } = validateAndTransformData(results.data);
        resolve({
          success: errors.length === 0,
          data: parsedData,
          errors
        });
      }
    });
  });
}

function validateAndTransformData(rawData: any[]): {
  data: ParsedProperty[];
  errors: string[];
} {
  const properties: ParsedProperty[] = [];
  const errors: string[] = [];
  
  rawData.forEach((row, index) => {
    const rowNum = index + 2; // +2 car ligne 1 = headers
    const property: ParsedProperty = {} as ParsedProperty;
    const rowErrors: string[] = [];
    
    // Mapping et validation des champs
    // Champs obligatoires
    if (!row['Numéro Unité'] && !row['unit_number']) {
      rowErrors.push('Numéro d\'unité manquant');
    } else {
      property.unit_number = String(row['Numéro Unité'] || row['unit_number']);
    }
    
    const floor = parseInt(row['Étage'] || row['floor']);
    if (isNaN(floor)) {
      rowErrors.push('Étage invalide');
    } else {
      property.floor = floor;
    }
    
    const type = String(row['Type'] || row['type']).toLowerCase();
    if (!VALID_TYPES.includes(type)) {
      rowErrors.push(`Type invalide: ${type}`);
    } else {
      property.type = type;
    }
    
    property.bedrooms = parseInt(row['Chambres'] || row['bedrooms']) || 0;
    property.bathrooms = parseFloat(row['Salles de bain'] || row['bathrooms']) || 1;
    property.size_m2 = parseFloat(row['Surface (m²)'] || row['size_m2']) || 0;
    
    const price = parseFloat(row['Prix (€)'] || row['price']);
    if (isNaN(price) || price <= 0) {
      rowErrors.push('Prix invalide');
    } else {
      property.price = price;
      property.is_golden_visa = price >= 300000;
    }
    
    const status = String(row['Statut'] || row['status']).toLowerCase();
    if (!VALID_STATUS.includes(status)) {
      rowErrors.push(`Statut invalide: ${status}`);
    } else {
      property.status = status as 'available' | 'reserved' | 'sold';
    }
    
    // Champs optionnels
    property.view_type = row['Type de vue'] || row['view_type'] || undefined;
    
    const orientation = row['Orientation'] || row['orientation'];
    if (orientation && !VALID_ORIENTATIONS.includes(orientation)) {
      rowErrors.push(`Orientation invalide: ${orientation}`);
    } else {
      property.orientation = orientation;
    }
    
    property.balcony_m2 = parseFloat(row['Balcon (m²)'] || row['balcony_m2']) || 0;
    property.terrace_m2 = parseFloat(row['Terrasse (m²)'] || row['terrace_m2']) || 0;
    property.parking_spaces = parseInt(row['Places parking'] || row['parking_spaces']) || 0;
    property.storage_units = parseInt(row['Stockage'] || row['storage_units']) || 0;
    
    // Booleans (oui/non ou yes/no ou true/false)
    const parseBoolean = (value: any) => {
      if (!value) return false;
      const str = String(value).toLowerCase();
      return str === 'oui' || str === 'yes' || str === 'true' || str === '1';
    };
    
    property.has_sea_view = parseBoolean(row['Vue mer (oui/non)'] || row['has_sea_view']);
    property.has_pool_access = parseBoolean(row['Accès piscine (oui/non)'] || row['has_pool_access']);
    property.has_gym_access = parseBoolean(row['Accès gym (oui/non)'] || row['has_gym_access']);
    property.has_mountain_view = parseBoolean(row['Vue montagne (oui/non)'] || row['has_mountain_view']);
    property.is_furnished = parseBoolean(row['Meublé (oui/non)'] || row['is_furnished']);
    
    if (rowErrors.length > 0) {
      errors.push(`Ligne ${rowNum}: ${rowErrors.join(', ')}`);
      property.validation_errors = rowErrors;
    }
    
    properties.push(property);
  });
  
  return { data: properties, errors };
}