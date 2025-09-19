import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';

interface CSVImporterProps {
  projectId: string;
  buildingId?: string;
  onPropertiesImported: (count: number) => void;
}

interface CSVRow {
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
  parking_spaces?: number;
}

export const CSVImporter: React.FC<CSVImporterProps> = ({
  projectId,
  buildingId,
  onPropertiesImported
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  const downloadTemplate = () => {
    const template = [
      ['unit_number', 'floor', 'type', 'bedrooms', 'bathrooms', 'size_m2', 'price', 'status', 'view_type', 'orientation', 'parking_spaces'],
      ['A-101', '1', 'apartment', '2', '2', '85.5', '350000', 'available', 'sea', 'south', '1'],
      ['A-102', '1', 'apartment', '3', '2', '120.0', '450000', 'available', 'mountain', 'north', '2']
    ];
    
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Veuillez sélectionner un fichier CSV valide.');
    }
  };

  const validateAndImportData = async (data: CSVRow[]) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Validate required fields
      const validData = data.filter(row => 
        row.unit_number && 
        row.type && 
        row.bedrooms !== undefined && 
        row.bathrooms !== undefined && 
        row.size_m2 && 
        row.price
      );

      if (validData.length === 0) {
        throw new Error('Aucune donnée valide trouvée dans le fichier CSV');
      }

      setUploadProgress(30);

      // Transform data to match database schema
      const propertiesToInsert = validData.map(row => ({
        project_id: projectId,
        building_id: buildingId || null,
        unit_number: row.unit_number,
        property_type: row.type as 'apartment' | 'villa' | 'penthouse' | 'studio' | 'townhouse' | 'duplex' | 'triplex' | 'maisonette',
        property_status: row.status as 'available' | 'reserved' | 'sold' | 'rented' | 'unavailable',
        bedrooms_count: row.bedrooms,
        bathrooms_count: row.bathrooms,
        internal_area: row.size_m2,
        price_excluding_vat: row.price,
        view_type: row.view_type ? [row.view_type] : [],
        orientation: row.orientation as 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west' | undefined,
        parking_spaces: row.parking_spaces || 0,
        floor_number: row.floor || null,
        vat_rate: 5, // Default VAT rate
        commission_rate: 5, // Default commission rate
        deposit_percentage: 30, // Default deposit
        reservation_fee: 5000 // Default reservation fee
      }));

      setUploadProgress(60);

      // Insert in batches
      const batchSize = 10;
      for (let i = 0; i < propertiesToInsert.length; i += batchSize) {
        const batch = propertiesToInsert.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('properties_final')
          .insert(batch);
        
        if (error) throw error;
        
        setUploadProgress(60 + ((i + batchSize) / propertiesToInsert.length) * 40);
      }

      setUploadProgress(100);
      setResult({
        success: true,
        message: `${validData.length} propriétés importées avec succès`,
        count: validData.length
      });
      
      onPropertiesImported(validData.length);
      
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de l\'importation'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transform: (value: string, field?: string) => {
        // Convert string numbers to actual numbers for numeric fields
        if (['floor', 'bedrooms', 'bathrooms', 'size_m2', 'price', 'parking_spaces'].includes(field || '')) {
          const num = parseFloat(value);
          return isNaN(num) ? 0 : num;
        }
        return value.trim();
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          setResult({
            success: false,
            message: `Erreurs dans le fichier CSV: ${results.errors.map(e => e.message).join(', ')}`
          });
          return;
        }
        
        validateAndImportData(results.data as CSVRow[]);
      },
      error: (error) => {
        setResult({
          success: false,
          message: `Erreur de lecture du fichier: ${error.message}`
        });
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import CSV
        </CardTitle>
        <CardDescription>
          Importez des propriétés en masse depuis un fichier CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger le modèle
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-file">Fichier CSV</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {file && (
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm">
              <strong>Fichier sélectionné:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-gray-600">
              Import en cours... {uploadProgress}%
            </p>
          </div>
        )}

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.message}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? 'Import en cours...' : 'Importer les propriétés'}
        </Button>
      </CardContent>
    </Card>
  );
};