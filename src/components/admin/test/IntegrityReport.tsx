import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkHierarchyIntegrity } from '@/lib/supabase/integrity';
import { cleanOrphanData } from '@/lib/supabase/test-helpers';

interface OrphanData {
  orphanedProjects: any[];
  orphanedBuildings: any[];
  orphanedProperties: any[];
}

const IntegrityReport = () => {
  const [orphanData, setOrphanData] = useState<OrphanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanResult, setCleanResult] = useState<any>(null);

  const loadIntegrityReport = async () => {
    setIsLoading(true);
    try {
      const data = await checkHierarchyIntegrity();
      setOrphanData(data);
    } catch (error) {
      console.error('Error loading integrity report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanOrphans = async () => {
    const totalOrphans = (orphanData?.orphanProjects.length || 0) + 
                        (orphanData?.orphanBuildings.length || 0) + 
                        (orphanData?.orphanProperties.length || 0);

    if (totalOrphans === 0) {
      alert("Aucun élément orphelin à nettoyer");
      return;
    }

    const confirmed = confirm(
      `Êtes-vous sûr de vouloir supprimer ${totalOrphans} élément(s) orphelin(s) ?\n\n` +
      `Cette action est irréversible.`
    );

    if (!confirmed) return;

    setIsCleaning(true);
    try {
      const result = await cleanOrphanData();
      setCleanResult(result);
      // Reload the report after cleaning
      if (result.success) {
        await loadIntegrityReport();
      }
    } catch (error) {
      console.error('Error cleaning orphans:', error);
      setCleanResult({
        success: false,
        cleanedCount: 0,
        message: `Erreur: ${error}`
      });
    } finally {
      setIsCleaning(false);
    }
  };

  useEffect(() => {
    loadIntegrityReport();
  }, []);

  const totalOrphans = orphanData ? 
    orphanData.orphanProjects.length + 
    orphanData.orphanBuildings.length + 
    orphanData.orphanProperties.length : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <CardTitle>Rapport d'Intégrité</CardTitle>
            {orphanData && (
              <Badge variant={totalOrphans === 0 ? "outline" : "destructive"}>
                {totalOrphans} orphelin(s)
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={loadIntegrityReport}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            {totalOrphans > 0 && (
              <Button 
                variant="destructive"
                size="sm"
                onClick={handleCleanOrphans}
                disabled={isCleaning}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isCleaning ? 'Nettoyage...' : 'Nettoyer orphelins'}
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Détection et nettoyage des éléments orphelins dans la hiérarchie
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyse de l'intégrité en cours...</p>
          </div>
        )}

        {cleanResult && (
          <Alert className={cleanResult.success ? 'border-green-200 bg-green-50 mb-4' : 'border-red-200 bg-red-50 mb-4'}>
            <AlertDescription className={cleanResult.success ? 'text-green-800' : 'text-red-800'}>
              {cleanResult.message}
            </AlertDescription>
          </Alert>
        )}

        {orphanData && !isLoading && (
          <div className="space-y-6">
            {totalOrphans === 0 ? (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  ✅ Aucun élément orphelin détecté. La hiérarchie est intègre.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                  ⚠️ {totalOrphans} élément(s) orphelin(s) détecté(s) nécessitant une attention.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Orphan Projects */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Projets orphelins</h4>
                  <Badge variant={orphanData.orphanProjects.length === 0 ? "outline" : "destructive"}>
                    {orphanData.orphanProjects.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Projets sans développeur assigné
                </p>
                {orphanData.orphanProjects.length === 0 ? (
                  <p className="text-sm text-green-600">✅ Aucun orphelin</p>
                ) : (
                  <div className="space-y-1">
                    {orphanData.orphanProjects.slice(0, 3).map((project, index) => (
                      <div key={index} className="text-sm p-2 bg-red-50 rounded border">
                        {project.title}
                        <span className="text-xs text-muted-foreground block">
                          ID: {project.id}
                        </span>
                      </div>
                    ))}
                    {orphanData.orphanProjects.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        ... et {orphanData.orphanProjects.length - 3} autre(s)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Orphan Buildings */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Bâtiments orphelins</h4>
                  <Badge variant={orphanData.orphanBuildings.length === 0 ? "outline" : "destructive"}>
                    {orphanData.orphanBuildings.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Bâtiments sans projet assigné
                </p>
                {orphanData.orphanBuildings.length === 0 ? (
                  <p className="text-sm text-green-600">✅ Aucun orphelin</p>
                ) : (
                  <div className="space-y-1">
                    {orphanData.orphanBuildings.slice(0, 3).map((building, index) => (
                      <div key={index} className="text-sm p-2 bg-red-50 rounded border">
                        {building.name}
                        <span className="text-xs text-muted-foreground block">
                          ID: {building.id}
                        </span>
                      </div>
                    ))}
                    {orphanData.orphanBuildings.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        ... et {orphanData.orphanBuildings.length - 3} autre(s)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Orphan Properties */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Unités orphelines</h4>
                  <Badge variant={orphanData.orphanProperties.length === 0 ? "outline" : "destructive"}>
                    {orphanData.orphanProperties.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Unités sans bâtiment assigné
                </p>
                <p className="text-sm text-green-600">✅ Aucun orphelin</p>
                <p className="text-xs text-muted-foreground mt-2">
                  (Table properties non implémentée)
                </p>
              </div>
            </div>

            {totalOrphans > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Actions recommandées :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Assignez un développeur aux projets orphelins</li>
                  <li>• Assignez un projet aux bâtiments orphelins</li>
                  <li>• Ou utilisez le bouton "Nettoyer orphelins" pour les supprimer</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrityReport;