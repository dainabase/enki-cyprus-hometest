import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, Check, X, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { downloadTemplate } from '@/lib/excel/propertyTemplate';
import { parseExcelFile, parseCSVFile, ParsedProperty } from '@/lib/excel/propertyParser';
import { supabase } from '@/integrations/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CSVImporterProps {
  developerId: string;
  projectId: string;
  buildingId: string;
  onSuccess: (count: number) => void;
}

export default function CSVImporter({ developerId, projectId, buildingId, onSuccess }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedProperty[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setIsProcessing(true);
    setParsedData([]);
    setParseErrors([]);
    
    try {
      let result;
      if (uploadedFile.name.endsWith('.xlsx') || uploadedFile.name.endsWith('.xls')) {
        result = await parseExcelFile(uploadedFile);
      } else if (uploadedFile.name.endsWith('.csv')) {
        result = await parseCSVFile(uploadedFile);
      } else {
        throw new Error('Format de fichier non supporté. Utilisez .xlsx, .xls ou .csv');
      }
      
      setParsedData(result.data);
      setParseErrors(result.errors);
      
      if (result.success) {
        toast.success(`${result.data.length} propriétés prêtes à importer`);
      } else {
        toast.warning('Des erreurs ont été détectées, vérifiez avant d\'importer');
      }
    } catch (error) {
      toast.error(`Erreur: ${error}`);
      setParseErrors([String(error)]);
    } finally {
      setIsProcessing(false);
    }
  };

  const importMutation = useMutation({
    mutationFn: async () => {
      const validProperties = parsedData.filter(p => !p.validation_errors?.length);
      const totalBatch = validProperties.length;
      const batchSize = 10;
      
      for (let i = 0; i < totalBatch; i += batchSize) {
        const batch = validProperties.slice(i, i + batchSize).map(prop => ({
          unit_number: prop.unit_number,
          floor: prop.floor,
          type: prop.type,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          size_m2: prop.size_m2,
          price: prop.price,
          status: prop.status,
          view_type: prop.view_type || null,
          orientation: prop.orientation || null,
          balcony_m2: prop.balcony_m2 || 0,
          terrace_m2: prop.terrace_m2 || 0,
          parking_spaces: prop.parking_spaces || 0,
          storage_units: prop.storage_units || 0,
          has_sea_view: prop.has_sea_view || false,
          has_pool_access: prop.has_pool_access || false,
          has_gym_access: prop.has_gym_access || false,
          has_mountain_view: prop.has_mountain_view || false,
          is_furnished: prop.is_furnished || false,
          developer_id: developerId,
          project_id: projectId,
          building_id: buildingId,
        }));
        
        const { error } = await supabase
          .from('properties')
          .insert(batch);
        
        if (error) throw error;
        
        setImportProgress(Math.round(((i + batchSize) / totalBatch) * 100));
      }
      
      return validProperties.length;
    },
    onSuccess: (count) => {
      toast.success(`${count} propriétés importées avec succès !`);
      onSuccess(count);
      // Reset
      setFile(null);
      setParsedData([]);
      setParseErrors([]);
      setImportProgress(0);
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'import: ${error}`);
    }
  });

  const validCount = parsedData.filter(p => !p.validation_errors?.length).length;
  const errorCount = parsedData.filter(p => p.validation_errors?.length).length;
  const goldenVisaCount = parsedData.filter(p => p.is_golden_visa && !p.validation_errors?.length).length;

  return (
    <div className="space-y-6">
      {/* Étape 1: Télécharger le template */}
      <Card>
        <CardHeader>
          <CardTitle>Étape 1 : Télécharger le template</CardTitle>
          <CardDescription>
            Utilisez notre template Excel pour préparer vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Télécharger le template Excel
          </Button>
        </CardContent>
      </Card>

      {/* Étape 2: Upload du fichier */}
      <Card>
        <CardHeader>
          <CardTitle>Étape 2 : Importer votre fichier</CardTitle>
          <CardDescription>
            Formats acceptés : Excel (.xlsx, .xls) ou CSV (.csv)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600">
                {file ? file.name : 'Cliquez pour sélectionner un fichier'}
              </p>
              <Button variant="secondary" className="mt-4" disabled={isProcessing}>
                <Upload className="mr-2 h-4 w-4" />
                {isProcessing ? 'Traitement...' : 'Choisir un fichier'}
              </Button>
            </label>
          </div>

          {/* Résumé après parsing */}
          {parsedData.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{parsedData.length}</div>
                  <p className="text-xs text-muted-foreground">Total lignes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{validCount}</div>
                  <p className="text-xs text-muted-foreground">Valides</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <p className="text-xs text-muted-foreground">Erreurs</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-600">{goldenVisaCount}</div>
                  <p className="text-xs text-muted-foreground">Golden Visa</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Étape 3: Validation et preview */}
      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Étape 3 : Validation et import</CardTitle>
            <CardDescription>
              Vérifiez les données avant l'import final
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Erreurs */}
            {parseErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Erreurs détectées :</div>
                  <ul className="list-disc list-inside text-sm">
                    {parseErrors.slice(0, 5).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                    {parseErrors.length > 5 && (
                      <li>... et {parseErrors.length - 5} autres erreurs</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Preview des données */}
            <div className="max-h-96 overflow-y-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Statut</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Surface</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Golden Visa</TableHead>
                    <TableHead>Erreurs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 10).map((prop, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {prop.validation_errors?.length ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </TableCell>
                      <TableCell>{prop.unit_number}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{prop.type}</Badge>
                      </TableCell>
                      <TableCell>{prop.size_m2} m²</TableCell>
                      <TableCell>€{prop.price?.toLocaleString()}</TableCell>
                      <TableCell>
                        {prop.is_golden_visa && (
                          <Badge className="bg-yellow-500">✨ Golden Visa</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {prop.validation_errors?.length && (
                          <div className="text-xs text-red-600">
                            {prop.validation_errors.join(', ')}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {parsedData.length > 10 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                        ... et {parsedData.length - 10} autres propriétés
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Progress bar pendant l'import */}
            {importMutation.isPending && (
              <div className="space-y-2">
                <Progress value={importProgress} />
                <p className="text-sm text-center text-gray-600">
                  Import en cours... {importProgress}%
                </p>
              </div>
            )}

            {/* Bouton d'import */}
            <Button
              onClick={() => importMutation.mutate()}
              disabled={validCount === 0 || importMutation.isPending}
              className="w-full"
              size="lg"
            >
              <Upload className="mr-2 h-4 w-4" />
              Importer {validCount} propriétés valides
              {goldenVisaCount > 0 && ` (dont ${goldenVisaCount} Golden Visa)`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}