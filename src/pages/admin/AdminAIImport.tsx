import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIImportDropzone } from '@/components/admin/projects/AIImportDropzone';
import { AIImportDocument, AIImportSession } from '@/lib/ai-import/types';
import { generatePrefilledUrl } from '@/lib/ai-import/mapper';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function AdminAIImport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<AIImportSession>({
    id: crypto.randomUUID(),
    documents: [],
    status: 'uploading'
  });

  const handleDocumentsChange = (documents: AIImportDocument[]) => {
    setSession(prev => ({
      ...prev,
      documents
    }));
  };

  const handleAnalyze = async () => {
    try {
      setSession(prev => ({ ...prev, status: 'analyzing' }));

      // Créer la session d'import en base
      const { error: sessionError } = await supabase
        .from('project_ai_imports')
        .insert({
          session_id: session.id,
          documents: session.documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            size: doc.size,
            url: doc.uploadUrl
          })),
          status: 'analyzing',
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (sessionError) throw sessionError;

      // Simuler l'analyse IA (remplacé par vraie API plus tard)
      await simulateAIAnalysis();

      setSession(prev => ({ ...prev, status: 'ready' }));

      toast({
        title: "Analyse terminée",
        description: "Les documents ont été analysés avec succès. Vous pouvez maintenant créer le projet.",
      });

    } catch (error) {
      console.error('Error during AI analysis:', error);
      setSession(prev => ({ 
        ...prev, 
        status: 'error',
        errorMessage: 'Erreur lors de l\'analyse des documents'
      }));
      
      toast({
        title: "Erreur",
        description: "Impossible d'analyser les documents.",
        variant: "destructive"
      });
    }
  };

  const simulateAIAnalysis = async (): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Données simulées d'extraction IA
        const mockExtraction = {
          title: { value: "Résidence Marina Bay", confidence: 0.95 },
          description: { value: "Luxueux appartements en bord de mer", confidence: 0.88 },
          price: { value: 350000, confidence: 0.92 },
          city: { value: "Limassol", confidence: 0.98 }
        };

        setSession(prev => ({
          ...prev,
          rawExtraction: mockExtraction,
          mappedData: mockExtraction
        }));

        resolve();
      }, 3000);
    });
  };

  const handleCreateProject = () => {
    if (session.mappedData) {
      const prefilledUrl = generatePrefilledUrl(session.mappedData);
      navigate(prefilledUrl);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Import IA de Projets</h1>
            <p className="text-gray-600">
              Uploadez vos documents PDF pour extraire automatiquement les informations du projet
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/projects')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIImportDropzone
            onDocumentsChange={handleDocumentsChange}
            onAnalyze={handleAnalyze}
            isAnalyzing={session.status === 'analyzing'}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>État de l'analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Documents</span>
                  <span className="font-medium">{session.documents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Statut</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    session.status === 'ready' ? 'bg-green-100 text-green-800' :
                    session.status === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                    session.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status === 'uploading' && 'Upload en cours'}
                    {session.status === 'analyzing' && 'Analyse en cours'}
                    {session.status === 'ready' && 'Prêt'}
                    {session.status === 'error' && 'Erreur'}
                  </span>
                </div>
              </div>

              {session.status === 'ready' && session.mappedData && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-3">Données extraites</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(session.mappedData).map(([key, data]: [string, any]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium">{data.confidence}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleCreateProject}
                    className="w-full mt-4"
                  >
                    Créer le projet
                  </Button>
                </div>
              )}

              {session.status === 'error' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 text-sm">
                    {session.errorMessage || 'Une erreur est survenue'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>1. Uploadez vos documents PDF (descriptifs, mandats, etc.)</p>
              <p>2. Cliquez sur "Analyser avec l'IA"</p>
              <p>3. Vérifiez les données extraites</p>
              <p>4. Créez le projet avec les données pré-remplies</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}