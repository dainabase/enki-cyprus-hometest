import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { ExtractionStep, DocumentUpload, ExtractedDeveloper } from '@/lib/ai-import/types-v2';
import { supabase } from '@/integrations/supabase/client';

export function UnifiedAIImporter() {
  const [document, setDocument] = useState<DocumentUpload | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [extractedDeveloper, setExtractedDeveloper] = useState<ExtractedDeveloper | null>(null);
  
  const steps: ExtractionStep[] = [
    { id: 'cleanup', name: '✅ Nettoyer ancien code', status: 'completed' },
    { id: 'structure', name: '📍 Structure de base', status: 'processing' },
    { id: 'developer', name: 'Extraction développeur', status: 'pending' },
    { id: 'test-dev', name: 'Test développeur', status: 'pending' },
    { id: 'project', name: 'Extraction projet', status: 'pending' },
    { id: 'test-proj', name: 'Test projet', status: 'pending' },
    { id: 'buildings', name: 'Extraction bâtiments', status: 'pending' },
    { id: 'properties', name: 'Extraction propriétés', status: 'pending' },
    { id: 'validation', name: 'Interface validation', status: 'pending' },
    { id: 'import', name: 'Import final', status: 'pending' }
  ];

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setDocument({
        file,
        url: URL.createObjectURL(file),
        status: 'uploaded'
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const extractDeveloper = async () => {
    if (!document) return;
    
    try {
      setDocument(prev => prev ? {...prev, status: 'processing'} : null);
      
      console.log('🏢 ÉTAPE 3: Extraction développeur...');
      
      // Upload du fichier vers Supabase storage
      const fileName = `${Date.now()}-${document.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(`ai-imports/${fileName}`, document.file);
      
      if (uploadError) throw uploadError;
      
      // URL publique du fichier
      const { data: { publicUrl } } = supabase.storage
        .from('project-documents')
        .getPublicUrl(`ai-imports/${fileName}`);
      
      // Appel à l'edge function spécialisée développeur
      const { data, error } = await supabase.functions.invoke('simple-pdf-extractor', {
        body: {
          fileUrl: publicUrl,
          extractionType: 'developer'
        }
      });
      
      if (error) throw error;
      
      if (data.success && data.developer) {
        setExtractedDeveloper(data.developer);
        setDocument(prev => prev ? {...prev, status: 'completed'} : null);
        setCurrentStep(4);
        console.log('✅ Développeur extrait:', data.developer);
      } else {
        throw new Error('Échec extraction développeur');
      }
      
    } catch (error) {
      console.error('Erreur extraction développeur:', error);
      setDocument(prev => prev ? {...prev, status: 'error'} : null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouveau Système d'Import IA - Version 2.0</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Progress des étapes */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Progression :</h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={step.id} className={`flex items-center space-x-3 p-2 rounded ${
                    step.status === 'completed' ? 'bg-green-50 text-green-700' :
                    step.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    <span className="text-sm font-medium">Étape {index + 1}:</span>
                    <span>{step.name}</span>
                    {step.status === 'completed' && <span>✅</span>}
                    {step.status === 'processing' && <span>🔄</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Zone principale */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-4">
                  ÉTAPE 2 : Test de la structure de base
                </h3>
                
                {!document ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed p-8 text-center cursor-pointer rounded-lg transition-colors ${
                      isDragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">
                      Déposer un PDF pour tester la nouvelle structure
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Glissez-déposez un fichier PDF ou cliquez pour sélectionner
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">{document.file.name}</span>
                      <Button onClick={() => setCurrentStep(3)} className="bg-green-600 hover:bg-green-700">
                        ✅ Passer à l'ÉTAPE 3
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-4">
                  ÉTAPE 3 : Extraction développeur
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Extraction des 4 informations : nom entreprise, téléphone, email, site web
                </p>
                
                {document && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">{document.file.name}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        document.status === 'uploaded' ? 'bg-blue-100 text-blue-700' :
                        document.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        document.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {document.status === 'uploaded' && 'Prêt'}
                        {document.status === 'processing' && 'Extraction en cours...'}
                        {document.status === 'completed' && 'Développeur extrait ✅'}
                        {document.status === 'error' && 'Erreur'}
                      </span>
                    </div>
                    
                    {document.status === 'uploaded' && (
                      <Button onClick={extractDeveloper} className="w-full bg-green-600 hover:bg-green-700">
                        🏢 Extraire les infos développeur
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && extractedDeveloper && (
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-4">
                  ✅ ÉTAPE 3 TERMINÉE - Développeur extrait !
                </h3>
                
                <div className="bg-green-50 p-6 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-medium text-gray-700">Nom entreprise :</label>
                      <p className="text-lg">{extractedDeveloper.name}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Téléphone :</label>
                      <p className="text-lg">{extractedDeveloper.phone}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Email :</label>
                      <p className="text-lg">{extractedDeveloper.email}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">Site web :</label>
                      <p className="text-lg">{extractedDeveloper.website}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-green-800 font-medium">
                      Prêt pour l'ÉTAPE 4 : Test et validation développeur
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}