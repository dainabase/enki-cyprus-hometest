import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, CheckCircle, XCircle, Building, Home, MapPin } from 'lucide-react';
import { runFullCronaTest } from '@/utils/runCronaTest';

export const CronaTestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleRunTest = async () => {
    setIsRunning(true);
    setLastResult(null);

    try {
      const result = await runFullCronaTest();
      setLastResult(result);
    } catch (error) {
      setLastResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        error
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetTest = () => {
    setLastResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Test Complet Crona Groupe
        </CardTitle>
        <CardDescription>
          Test de création complète: Développeur → Projet → Bâtiments (20 appartements + 4 maisons)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!lastResult && (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Ce test va créer des données complètes pour Crona Groupe avec le projet Square Garden.
            </p>
            <Button 
              onClick={handleRunTest} 
              disabled={isRunning}
              size="lg"
              className="min-w-[200px]"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Lancer le test
                </>
              )}
            </Button>
          </div>
        )}

        {isRunning && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Test en cours... Création de Crona Groupe, Square Garden et des bâtiments.
            </AlertDescription>
          </Alert>
        )}

        {lastResult && (
          <div className="space-y-4">
            <Alert className={lastResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {lastResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={lastResult.success ? "text-green-800" : "text-red-800"}>
                {lastResult.message}
              </AlertDescription>
            </Alert>

            {lastResult.success && lastResult.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Développeur */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      🏢 Développeur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{lastResult.data.developer?.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {lastResult.data.developer?.contact_info?.address}
                      </div>
                      <Badge variant="outline">
                        Commission: {lastResult.data.developer?.commission_rate}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Projet */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      Projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{lastResult.data.project?.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {lastResult.data.project?.location?.city}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={lastResult.data.project?.golden_visa_eligible ? "default" : "secondary"}>
                          {lastResult.data.project?.golden_visa_eligible ? "✅ Golden Visa" : "❌ Golden Visa"}
                        </Badge>
                        <Badge variant="outline">
                          €{lastResult.data.project?.price?.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bâtiments */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      🏠 Bâtiments & Unités
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lastResult.data.buildings?.map((building: any, index: number) => (
                        <div key={building.id} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            {building.name.includes('Apartments') ? (
                              <Building className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Home className="h-4 w-4 text-green-500" />
                            )}
                            <span className="font-medium text-sm">
                              {building.name.includes('Apartments') ? 'Appartements' : 'Maisons'}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Unités: {building.total_units}</p>
                            <p>Étages: {building.total_floors}</p>
                            <Badge variant="outline">
                              {building.construction_status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Total unités:</span>
                        <Badge variant="default">
                          {lastResult.data.details?.totalUnits} unités
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span>Répartition:</span>
                        <span className="text-muted-foreground">
                          {lastResult.data.details?.apartments} appartements + {lastResult.data.details?.houses} maisons
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {lastResult.tests && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">🧪 Résultats des tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <Badge variant={lastResult.tests.creation ? "default" : "destructive"}>
                      {lastResult.tests.creation ? "✅" : "❌"} Création
                    </Badge>
                    <Badge variant={lastResult.tests.validation ? "default" : "destructive"}>
                      {lastResult.tests.validation ? "✅" : "❌"} Validation
                    </Badge>
                    <Badge variant={lastResult.tests.goldenVisa ? "default" : "destructive"}>
                      {lastResult.tests.goldenVisa ? "✅" : "❌"} Golden Visa
                    </Badge>
                    <Badge variant={lastResult.tests.hierarchy ? "default" : "destructive"}>
                      {lastResult.tests.hierarchy ? "✅" : "❌"} Hiérarchie
                    </Badge>
                    <Badge variant={lastResult.tests.units ? "default" : "destructive"}>
                      {lastResult.tests.units ? "✅" : "❌"} Unités
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center">
              <Button onClick={resetTest} variant="outline">
                Nouveau test
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};