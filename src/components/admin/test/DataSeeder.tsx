import React, { useState } from 'react';
import { Database, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { seedDemoData, DemoDataResult } from '@/lib/supabase/test-helpers';

const DataSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [lastResult, setLastResult] = useState<DemoDataResult | null>(null);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDemoData();
      setLastResult(result);
    } catch (error) {
      console.error('Error seeding data:', error);
      setLastResult({
        developers: [],
        projects: [],
        buildings: [],
        success: false,
        message: `Erreur inattendue: ${error}`
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <CardTitle>Seed Demo Data</CardTitle>
          </div>
          <Button 
            onClick={handleSeedData} 
            disabled={isSeeding}
            size="sm"
            className="gap-2"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Création...
              </>
            ) : (
              'Générer données de test'
            )}
          </Button>
        </div>
        <CardDescription>
          Crée un jeu de données de démonstration cohérent pour tester la hiérarchie
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!lastResult && !isSeeding && (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Générez des données de test pour valider le système</p>
            <div className="mt-4 text-sm">
              <p><strong>Sera créé :</strong></p>
              <ul className="mt-2 space-y-1">
                <li>• 2 développeurs</li>
                <li>• 2 projets (1 par développeur)</li>
                <li>• 2 bâtiments (1 par projet)</li>
                <li>• Relations hiérarchiques complètes</li>
              </ul>
            </div>
          </div>
        )}

        {isSeeding && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Création des données en cours...</p>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Création des développeurs, projets et bâtiments...</p>
            </div>
          </div>
        )}

        {lastResult && (
          <div className="space-y-4">
            <Alert className={lastResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {lastResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <AlertDescription className={lastResult.success ? 'text-green-800' : 'text-red-800'}>
                  {lastResult.message}
                </AlertDescription>
              </div>
            </Alert>

            {lastResult.success && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Développeurs</h4>
                    <Badge variant="outline">{lastResult.developers.length}</Badge>
                  </div>
                  {lastResult.developers.map((dev, index) => (
                    <div key={index} className="text-sm text-muted-foreground mb-1">
                      • {dev.name}
                    </div>
                  ))}
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Projets</h4>
                    <Badge variant="outline">{lastResult.projects.length}</Badge>
                  </div>
                  {lastResult.projects.map((project, index) => (
                    <div key={index} className="text-sm text-muted-foreground mb-1">
                      • {project.title}
                      {project.golden_visa_eligible && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                          ✨ Golden Visa
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Bâtiments</h4>
                    <Badge variant="outline">{lastResult.buildings.length}</Badge>
                  </div>
                  {lastResult.buildings.map((building, index) => (
                    <div key={index} className="text-sm text-muted-foreground mb-1">
                      • {building.name}
                      <span className="text-xs ml-2">
                        ({building.total_units} unités)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLastResult(null)}
              >
                Nouveau seeding
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataSeeder;