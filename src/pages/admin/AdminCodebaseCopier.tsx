import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Copy, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { codebaseCopier } from '@/lib/codebase-copier';
import { toast } from 'sonner';

const AdminCodebaseCopier = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    totalFiles: number;
    copiedFiles: number;
    errors: string[];
  } | null>(null);
  const [summary, setSummary] = useState<any>(null);

  const handleCopyCodebase = async () => {
    setIsLoading(true);
    setProgress(0);
    setResult(null);
    
    try {
      toast.info('🚀 Début de la copie du codebase...');
      
      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 90));
      }, 100);
      
      const copyResult = await codebaseCopier.copyAllFiles();
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(copyResult);
      
      // Obtenir le résumé
      const summaryData = await codebaseCopier.getCodebaseSummary();
      setSummary(summaryData);
      
      toast.success('✅ Copie terminée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast.error('❌ Erreur lors de la copie du codebase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSummary = async () => {
    try {
      const summaryData = await codebaseCopier.getCodebaseSummary();
      setSummary(summaryData);
      toast.success('Résumé mis à jour');
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé:', error);
      toast.error('Erreur lors de la récupération du résumé');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Copy className="w-8 h-8" />
                Copie du Codebase Admin
              </h1>
              <p className="text-muted-foreground mt-2">
                Copier tout le code source de l'admin dans Supabase pour analyse
              </p>
            </div>
          </div>
        </div>

        {/* Warning Card */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cette opération va copier tous les fichiers de l'admin dans la base de données Supabase. 
            Cela peut prendre quelques minutes selon la taille du codebase.
          </AlertDescription>
        </Alert>

        {/* Main Action Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Copie du Codebase
            </CardTitle>
            <CardDescription>
              Lancer la copie complète de tous les fichiers admin vers Supabase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleCopyCodebase} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Copie en cours...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Démarrer la copie
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGetSummary}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Obtenir le résumé
              </Button>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Résultats de la copie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{result.totalFiles}</div>
                  <div className="text-sm text-muted-foreground">Fichiers total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{result.copiedFiles}</div>
                  <div className="text-sm text-muted-foreground">Fichiers copiés</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{result.errors.length}</div>
                  <div className="text-sm text-muted-foreground">Erreurs</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-destructive">Erreurs rencontrées :</h4>
                  <div className="bg-destructive/10 p-3 rounded max-h-32 overflow-y-auto">
                    {result.errors.map((error, index) => (
                      <div key={index} className="text-sm text-destructive">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {summary && (
          <Card>
            <CardHeader>
              <CardTitle>Résumé du Codebase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Métadonnées */}
              {summary.metadata && (
                <div className="space-y-4">
                  <h4 className="font-medium">Métadonnées globales</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-lg font-bold">{summary.metadata.total_files}</div>
                      <div className="text-sm text-muted-foreground">Fichiers</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-lg font-bold">{summary.metadata.total_components}</div>
                      <div className="text-sm text-muted-foreground">Composants</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-lg font-bold">{summary.metadata.total_pages}</div>
                      <div className="text-sm text-muted-foreground">Pages</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded">
                      <div className="text-lg font-bold">{summary.metadata.total_size_kb} KB</div>
                      <div className="text-sm text-muted-foreground">Taille</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technologies détectées */}
              {summary.metadata && (
                <div className="space-y-3">
                  <h4 className="font-medium">Technologies détectées</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{summary.metadata.ui_library}</Badge>
                    <Badge variant="secondary">{summary.metadata.state_management}</Badge>
                    <Badge variant="secondary">{summary.metadata.routing_library}</Badge>
                    <Badge variant="secondary">{summary.metadata.styling_approach}</Badge>
                    {summary.metadata.typescript_enabled && (
                      <Badge variant="secondary">TypeScript</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Pages trouvées */}
              {summary.pageFiles && summary.pageFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Pages trouvées ({summary.pageFiles.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {summary.pageFiles.map((page: string, index: number) => (
                      <div key={index} className="text-sm bg-muted/50 p-2 rounded">
                        {page.replace('src/pages/', '')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Structure des dossiers */}
              {summary.folderStructure && (
                <div className="space-y-3">
                  <h4 className="font-medium">Structure des dossiers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {Object.entries(summary.folderStructure).map(([folder, count]) => (
                      <div key={folder} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                        <span>{folder}</span>
                        <Badge variant="outline">{count} fichiers</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions d'utilisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Copie du codebase</h4>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur "Démarrer la copie" pour scanner et copier tous les fichiers admin dans Supabase.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">2. Analyse des résultats</h4>
                <p className="text-sm text-muted-foreground">
                  Une fois la copie terminée, vous pouvez consulter les statistiques et la structure du code.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">3. Consultation des données</h4>
                <p className="text-sm text-muted-foreground">
                  Les données sont stockées dans les tables `admin_codebase` et `admin_metadata` de Supabase.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCodebaseCopier;