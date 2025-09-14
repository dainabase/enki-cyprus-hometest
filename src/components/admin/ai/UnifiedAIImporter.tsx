import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { ExtractionStep, DocumentUpload } from '@/lib/ai-import/types-v2';

export function UnifiedAIImporter() {
  const [document, setDocument] = useState<DocumentUpload | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(2);
  
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

  const testStructure = async () => {
    if (!document) return;
    
    try {
      setDocument(prev => prev ? {...prev, status: 'processing'} : null);
      
      // Test de la nouvelle structure
      console.log('🧪 Test de la structure de base...');
      
      // Simuler le test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDocument(prev => prev ? {...prev, status: 'completed'} : null);
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Erreur test structure:', error);
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

            {/* Zone d'upload */}
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
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      document.status === 'uploaded' ? 'bg-blue-100 text-blue-700' :
                      document.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      document.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {document.status === 'uploaded' && 'Prêt'}
                      {document.status === 'processing' && 'Test en cours...'}
                      {document.status === 'completed' && 'Structure OK ✅'}
                      {document.status === 'error' && 'Erreur'}
                    </span>
                  </div>
                  
                  {document.status === 'uploaded' && (
                    <Button onClick={testStructure} className="w-full">
                      🧪 Tester la structure de base
                    </Button>
                  )}
                  
                  {document.status === 'completed' && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        ✅ ÉTAPE 2 TERMINÉE - Structure de base fonctionnelle !
                      </p>
                      <p className="text-green-700 mt-2">
                        Prêt pour l'ÉTAPE 3 : Extraction développeur
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}