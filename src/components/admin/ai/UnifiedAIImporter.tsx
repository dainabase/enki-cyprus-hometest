import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Image, CheckCircle, AlertCircle, Building, Home, Users } from 'lucide-react';
import { extractFullHierarchy } from '@/lib/ai-import/UnifiedAIExtractor';
import { ValidationWizard } from './ValidationWizard';
import { supabase } from '@/integrations/supabase/client';

interface ExtractedData {
  developer: {
    name: string;
    email: string;
    phone: string;
    website?: string;
    description?: string;
  };
  project: {
    name: string;
    description: string;
    location: string;
    total_units: number;
    status: string;
    amenities: string[];
    completion_date?: string;
  };
  buildings: Array<{
    name: string;
    floors: number;
    units_per_floor: number;
    total_units: number;
    has_elevator: boolean;
    has_parking: boolean;
  }>;
  properties: Array<{
    building_name: string;
    unit_number: string;
    floor: number;
    type: string;
    bedrooms: number;
    bathrooms: number;
    size_m2: number;
    price: number;
    view_type: string;
    orientation: string;
    has_sea_view: boolean;
    is_golden_visa: boolean;
    status: string;
    features: string[];
  }>;
  media: Array<{
    type: 'image' | 'floorplan' | 'brochure';
    url: string;
    caption?: string;
    tags: string[];
  }>;
  stats: {
    total_properties: number;
    golden_visa_count: number;
    total_value: number;
    avg_price: number;
    price_range: { min: number; max: number };
    types_distribution: Record<string, number>;
  };
}

export function UnifiedAIImporter() {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationMode, setValidationMode] = useState(false);

  const handleFilesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleExtraction = async () => {
    if (files.length === 0) return;
    
    console.log('🔍 Starting extraction...');
    console.log('📄 Files to process:', files);
    console.log('📊 Number of files:', files.length);
    
    setIsExtracting(true);
    setError(null);
    setProgress(0);

    try {
      // Phase 1: Upload des fichiers
      setProgressMessage('Upload des documents...');
      setProgress(10);
      
      console.log('🚀 Phase 1: Uploading files...');
      const uploadedUrls = await uploadFiles(files);
      console.log('📤 Uploaded URLs:', uploadedUrls);
      
      // Phase 2: Extraction OCR
      setProgressMessage('Extraction OCR en cours...');
      setProgress(30);
      
      // Phase 3: Analyse IA
      setProgressMessage('Analyse IA des données...');
      setProgress(50);
      
      console.log('🤖 Phase 3: Calling AI extraction...');
      console.log('🔗 URLs for extraction:', uploadedUrls);
      
      const data = await extractFullHierarchy(uploadedUrls);
      
      console.log('📊 Raw extraction result:', data);
      console.log('🏠 Properties count:', data?.properties?.length || 0);
      console.log('🏢 Buildings count:', data?.buildings?.length || 0);
      
      if (!data || !data.properties || data.properties.length === 0) {
        console.error('❌ No properties extracted!');
        console.error('Full result object:', JSON.stringify(data, null, 2));
        throw new Error('Aucune propriété extraite du document. Vérifiez le format du PDF.');
      }
      
      // Phase 4: Enrichissement
      setProgressMessage('Enrichissement des données...');
      setProgress(70);
      
      console.log('💎 Phase 4: Enriching data...');
      const enrichedData = enrichData(data);
      console.log('✨ Enriched data stats:', enrichedData.stats);
      
      // Phase 5: Validation
      setProgressMessage('Préparation de la validation...');
      setProgress(90);
      
      setExtractedData(enrichedData);
      setProgress(100);
      setProgressMessage('Extraction terminée !');
      
      console.log('✅ Extraction completed successfully!');
      
    } catch (err: any) {
      console.error('💥 Extraction error:', err);
      console.error('Error stack:', err.stack);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
      setError(err.message || 'Erreur lors de l\'extraction');
    } finally {
      setIsExtracting(false);
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const fileName = `ai-imports/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('project-documents')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('project-documents')
        .getPublicUrl(fileName);
        
      urls.push(publicUrl);
    }
    return urls;
  };

  const enrichData = (data: any): ExtractedData => {
    // Enrichissement avec Golden Visa, statistiques, etc.
    const enriched = { ...data };
    
    enriched.properties = enriched.properties.map((prop: any) => ({
      ...prop,
      is_golden_visa: prop.price >= 300000
    }));
    
    enriched.stats = {
      total_properties: enriched.properties.length,
      golden_visa_count: enriched.properties.filter((p: any) => p.is_golden_visa).length,
      total_value: enriched.properties.reduce((sum: number, p: any) => sum + p.price, 0),
      avg_price: enriched.properties.reduce((sum: number, p: any) => sum + p.price, 0) / enriched.properties.length,
      price_range: {
        min: Math.min(...enriched.properties.map((p: any) => p.price)),
        max: Math.max(...enriched.properties.map((p: any) => p.price))
      },
      types_distribution: enriched.properties.reduce((acc: any, p: any) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {})
    };
    
    return enriched;
  };

  if (validationMode && extractedData) {
    return (
      <ValidationWizard
        data={extractedData}
        onValidate={async (validatedData) => {
          // Import final dans la base
          console.log('Import validé:', validatedData);
          // Logique d'import ici
        }}
        onCancel={() => {
          setValidationMode(false);
          setExtractedData(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building className="h-6 w-6" />
            Import IA Unifié - Projet Immobilier Complet
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Zone de dépôt */}
      {!extractedData && (
        <Card>
          <CardContent className="p-8">
            <div
              onDrop={handleFilesDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">
                Déposez tous vos documents ici
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PDF de brochures, images, plans, listes de prix...
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  Ou cliquez pour sélectionner
                </Button>
              </label>
            </div>

            {/* Fichiers sélectionnés */}
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="font-medium">Fichiers sélectionnés ({files.length})</h3>
                <div className="grid grid-cols-2 gap-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      {file.type.includes('pdf') ? <FileText className="h-4 w-4" /> : <Image className="h-4 w-4" />}
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleExtraction} 
                  disabled={isExtracting}
                  className="w-full mt-4"
                >
                  {isExtracting ? 'Extraction en cours...' : 'Lancer l\'extraction IA'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      {isExtracting && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>{progressMessage}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats extraits */}
      {extractedData && !validationMode && (
        <Card>
          <CardHeader>
            <CardTitle>Données Extraites - Aperçu</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="developer">Développeur</TabsTrigger>
                <TabsTrigger value="project">Projet</TabsTrigger>
                <TabsTrigger value="buildings">Bâtiments</TabsTrigger>
                <TabsTrigger value="properties">Propriétés</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Stats Cards */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{extractedData.stats.total_properties}</div>
                      <div className="text-sm text-gray-500">Propriétés totales</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-yellow-600">
                        {extractedData.stats.golden_visa_count}
                      </div>
                      <div className="text-sm text-gray-500">Golden Visa éligibles</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">
                        €{(extractedData.stats.total_value / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-500">Valeur totale</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Distribution des types */}
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Distribution par type</h3>
                  <div className="flex gap-2">
                    {Object.entries(extractedData.stats.types_distribution).map(([type, count]) => (
                      <Badge key={type} variant="outline">
                        {type}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="developer">
                <div className="space-y-3">
                  <div><strong>Nom:</strong> {extractedData.developer.name}</div>
                  <div><strong>Email:</strong> {extractedData.developer.email}</div>
                  <div><strong>Téléphone:</strong> {extractedData.developer.phone}</div>
                  <div><strong>Site web:</strong> {extractedData.developer.website}</div>
                </div>
              </TabsContent>

              <TabsContent value="project">
                <div className="space-y-3">
                  <div><strong>Nom:</strong> {extractedData.project.name}</div>
                  <div><strong>Localisation:</strong> {extractedData.project.location}</div>
                  <div><strong>Unités totales:</strong> {extractedData.project.total_units}</div>
                  <div><strong>Status:</strong> {extractedData.project.status}</div>
                  <div>
                    <strong>Commodités:</strong>
                    <div className="flex gap-2 mt-2">
                      {extractedData.project.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="buildings">
                <div className="space-y-4">
                  {extractedData.buildings.map((building, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><strong>{building.name}</strong></div>
                          <div>Étages: {building.floors}</div>
                          <div>Unités/étage: {building.units_per_floor}</div>
                          <div>Total: {building.total_units} unités</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="properties">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">Unité</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Surface</th>
                        <th className="px-4 py-2 text-left">Prix</th>
                        <th className="px-4 py-2 text-left">Golden Visa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.properties.slice(0, 20).map((prop, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">{prop.unit_number}</td>
                          <td className="px-4 py-2">{prop.type}</td>
                          <td className="px-4 py-2">{prop.size_m2} m²</td>
                          <td className="px-4 py-2">€{prop.price.toLocaleString()}</td>
                          <td className="px-4 py-2">
                            {prop.is_golden_visa && <Badge className="bg-yellow-500">✓</Badge>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setExtractedData(null)}>
                Annuler
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setValidationMode(true)}
              >
                Vérifier et Valider →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}