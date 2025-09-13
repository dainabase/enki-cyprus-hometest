import React, { useState } from 'react';
import { extractPropertiesFromPDF, ExtractedProperty } from '@/lib/ai-import/propertyAIExtractor';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PropertyOCRImporterProps {
  developerId: string;
  projectId: string;
  buildingId: string;
  onPropertiesExtracted: (count: number) => void;
}

export function PropertyOCRImporter({ 
  developerId, 
  projectId, 
  buildingId,
  onPropertiesExtracted 
}: PropertyOCRImporterProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedProperties, setExtractedProperties] = useState<ExtractedProperty[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleExtraction = async () => {
    if (!uploadedFile) {
      setError('Veuillez sélectionner un fichier PDF');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setProgress(10);

    try {
      setProgress(30);
      
      // Extract properties using AI
      const properties = await extractPropertiesFromPDF(uploadedFile, {
        developerId,
        projectId,
        buildingId
      });
      
      setProgress(80);
      
      if (properties.length === 0) {
        throw new Error('Aucune propriété détectée dans le document');
      }
      
      setExtractedProperties(properties);
      setProgress(100);
      
      toast.success(`${properties.length} propriétés extraites avec succès`);
      
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'extraction');
      toast.error('Erreur lors de l\'extraction');
    } finally {
      setIsExtracting(false);
    }
  };

  const confirmImport = async () => {
    try {
      // Prepare properties for database insertion
      const propertiesToInsert = extractedProperties.map(prop => ({
        unit_number: prop.unit_number,
        floor: prop.floor,
        type: prop.type,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        size_m2: prop.size_m2,
        price: prop.price,
        view_type: prop.view_type,
        orientation: prop.orientation,
        has_sea_view: prop.has_sea_view,
        status: prop.status,
        parking_spaces: prop.parking_spaces,
        developer_id: developerId,
        project_id: projectId,
        building_id: buildingId
      }));

      // Insert properties in batches
      const batchSize = 10;
      for (let i = 0; i < propertiesToInsert.length; i += batchSize) {
        const batch = propertiesToInsert.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('properties')
          .insert(batch);
        
        if (error) throw error;
      }

      onPropertiesExtracted(extractedProperties.length);
      
      // Reset state
      setExtractedProperties([]);
      setUploadedFile(null);
      setProgress(0);
      
    } catch (err: any) {
      toast.error(`Erreur lors de l'import: ${err.message}`);
    }
  };

  const goldenVisaCount = extractedProperties.filter(p => p.is_golden_visa).length;
  const totalValue = extractedProperties.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import OCR/IA de Propriétés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Uploadez un PDF contenant la liste des propriétés</p>
            <p>• L'IA va extraire automatiquement les détails de chaque propriété</p>
            <p>• Vérifiez les données avant l'import final</p>
            <p>• Les propriétés ≥ 300k€ seront automatiquement marquées Golden Visa</p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Zone */}
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {uploadedFile ? (
              <div>
                <p className="text-lg font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : isDragActive ? (
              <p className="text-lg">Déposez le fichier PDF ici...</p>
            ) : (
              <>
                <p className="text-lg mb-2">Glissez-déposez votre PDF ici</p>
                <p className="text-sm text-gray-500">ou cliquez pour sélectionner (max 10MB)</p>
              </>
            )}
          </div>

          {uploadedFile && !isExtracting && extractedProperties.length === 0 && (
            <div className="mt-4">
              <Button 
                onClick={handleExtraction}
                className="w-full"
                size="lg"
              >
                <FileText className="mr-2 h-4 w-4" />
                Extraire les propriétés avec l'IA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress */}
      {isExtracting && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Extraction en cours...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
              <div className="text-xs text-gray-500 text-center">
                {progress < 30 && 'Upload du document...'}
                {progress >= 30 && progress < 80 && 'Analyse IA en cours...'}
                {progress >= 80 && 'Finalisation...'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Preview */}
      {extractedProperties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                {extractedProperties.length} propriétés détectées
              </span>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  {goldenVisaCount} Golden Visa
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Total: €{totalValue.toLocaleString()}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Properties Table Preview */}
            <div className="border rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium">Unité</th>
                    <th className="px-4 py-2 text-left text-xs font-medium">Étage</th>
                    <th className="px-4 py-2 text-left text-xs font-medium">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium">Surface</th>
                    <th className="px-4 py-2 text-left text-xs font-medium">Prix</th>
                    <th className="px-4 py-2 text-left text-xs font-medium">Vue</th>
                    <th className="px-4 py-2 text-left text-xs font-medium">Golden Visa</th>
                  </tr>
                </thead>
                <tbody>
                  {extractedProperties.slice(0, 8).map((prop, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2 text-sm">{prop.unit_number}</td>
                      <td className="px-4 py-2 text-sm">{prop.floor}</td>
                      <td className="px-4 py-2 text-sm">
                        <Badge variant="outline">{prop.type}</Badge>
                      </td>
                      <td className="px-4 py-2 text-sm">{prop.size_m2} m²</td>
                      <td className="px-4 py-2 text-sm font-medium">€{prop.price.toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm">{prop.view_type}</td>
                      <td className="px-4 py-2 text-sm">
                        {prop.is_golden_visa && <Badge className="bg-yellow-500 text-white text-xs">✨ Eligible</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {extractedProperties.length > 8 && (
                <div className="px-4 py-3 bg-gray-50 text-center text-sm text-gray-600">
                  Et {extractedProperties.length - 8} autres propriétés...
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{extractedProperties.length}</div>
                  <p className="text-xs text-gray-600">Propriétés totales</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-yellow-600">{goldenVisaCount}</div>
                  <p className="text-xs text-gray-600">Golden Visa</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-green-600">
                    €{Math.round(totalValue / extractedProperties.length / 1000)}k
                  </div>
                  <p className="text-xs text-gray-600">Prix moyen</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(extractedProperties.reduce((sum, p) => sum + p.size_m2, 0) / extractedProperties.length)}
                  </div>
                  <p className="text-xs text-gray-600">Surface moy. (m²)</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setExtractedProperties([]);
                  setUploadedFile(null);
                }}
              >
                Annuler
              </Button>
              <Button 
                onClick={confirmImport}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importer {extractedProperties.length} propriétés
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}