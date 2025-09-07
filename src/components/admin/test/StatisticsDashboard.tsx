import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Building, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getGlobalStatistics } from '@/lib/supabase/test-helpers';

interface Statistics {
  entities: {
    developers: number;
    projects: number;
    buildings: number;
    totalUnits: number;
  };
  financial: {
    totalValue: number;
    averageProjectValue: number;
    goldenVisaProjects: number;
    goldenVisaPercentage: number;
  };
  construction: {
    planning: number;
    construction: number;
    completed: number;
  };
  geography: {
    limassol: number;
    paphos: number;
    larnaca: number;
    nicosia: number;
  };
}

const StatisticsDashboard = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const data = await getGlobalStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <CardTitle>Dashboard Statistiques</CardTitle>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={loadStatistics}
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : 'Actualiser'}
          </Button>
        </div>
        <CardDescription>
          Métriques globales et indicateurs de performance du portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Calcul des statistiques...</p>
          </div>
        )}

        {stats && !isLoading && (
          <div className="space-y-6">
            {/* Entités */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Entités du Portfolio
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(stats.entities.developers)}
                  </div>
                  <div className="text-sm text-muted-foreground">Développeurs</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(stats.entities.projects)}
                  </div>
                  <div className="text-sm text-muted-foreground">Projets</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(stats.entities.buildings)}
                  </div>
                  <div className="text-sm text-muted-foreground">Bâtiments</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatNumber(stats.entities.totalUnits)}
                  </div>
                  <div className="text-sm text-muted-foreground">Unités totales</div>
                </div>
              </div>
            </div>

            {/* Financier */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Indicateurs Financiers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Valeur totale portfolio</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(stats.financial.totalValue)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Valeur moyenne projet</div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(stats.financial.averageProjectValue)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Projets Golden Visa</div>
                  <div className="text-xl font-bold text-yellow-600">
                    {formatNumber(stats.financial.goldenVisaProjects)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ({stats.financial.goldenVisaPercentage}% du total)
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Taux Golden Visa</div>
                  <div className="text-xl font-bold text-purple-600">
                    {stats.financial.goldenVisaPercentage}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    (≥ €300,000)
                  </div>
                </div>
              </div>
            </div>

            {/* Construction */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Statuts de Construction</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {formatNumber(stats.construction.planning)}
                  </div>
                  <div className="text-sm text-muted-foreground">Planification</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold text-orange-600">
                    {formatNumber(stats.construction.construction)}
                  </div>
                  <div className="text-sm text-muted-foreground">En construction</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold text-green-600">
                    {formatNumber(stats.construction.completed)}
                  </div>
                  <div className="text-sm text-muted-foreground">Terminés</div>
                </div>
              </div>
            </div>

            {/* Géographie */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Répartition Géographique</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {formatNumber(stats.geography.limassol)}
                  </div>
                  <div className="text-sm text-muted-foreground">Limassol</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold text-green-600">
                    {formatNumber(stats.geography.paphos)}
                  </div>
                  <div className="text-sm text-muted-foreground">Paphos</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold text-orange-600">
                    {formatNumber(stats.geography.larnaca)}
                  </div>
                  <div className="text-sm text-muted-foreground">Larnaca</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {formatNumber(stats.geography.nicosia)}
                  </div>
                  <div className="text-sm text-muted-foreground">Nicosia</div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Résumé Exécutif</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">
                    <strong>Portfolio:</strong> {stats.entities.projects} projets répartis sur {stats.entities.developers} développeurs
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Inventaire:</strong> {stats.entities.totalUnits} unités dans {stats.entities.buildings} bâtiments
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    <strong>Golden Visa:</strong> {stats.financial.goldenVisaPercentage}% des projets éligibles
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Valeur moyenne:</strong> {formatCurrency(stats.financial.averageProjectValue)} par projet
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsDashboard;