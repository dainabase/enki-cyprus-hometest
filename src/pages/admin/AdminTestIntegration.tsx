import React from 'react';
import { TestTube, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import HealthCheckPanel from '@/components/admin/test/HealthCheckPanel';
import DataSeeder from '@/components/admin/test/DataSeeder';
import IntegrityReport from '@/components/admin/test/IntegrityReport';
import StatisticsDashboard from '@/components/admin/test/StatisticsDashboard';

const AdminTestIntegration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
                <TestTube className="w-8 h-8" />
                Tests d'Intégration
              </h1>
              <p className="text-muted-foreground mt-2">
                Validation complète de la hiérarchie et des relations
              </p>
            </div>
          </div>
        </div>

        {/* Warning Card */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">⚠️ Mode Test</CardTitle>
            <CardDescription className="text-yellow-700">
              Cette page est destinée aux tests manuels de la hiérarchie. Les opérations peuvent modifier ou supprimer des données.
              Utilisez uniquement dans un environnement de développement.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Health Check Section */}
        <HealthCheckPanel />

        {/* Data Seeder Section */}
        <DataSeeder />

        {/* Integrity Report Section */}
        <IntegrityReport />

        {/* Statistics Dashboard Section */}
        <StatisticsDashboard />

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions de Test</CardTitle>
            <CardDescription>
              Guide pour valider l'intégration complète du système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Génération de données de test</h4>
                <p className="text-sm text-muted-foreground">
                  Utilisez "Seed Demo Data" pour créer un jeu de données cohérent avec développeurs, projets et bâtiments.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">2. Vérification de l'intégrité</h4>
                <p className="text-sm text-muted-foreground">
                  Exécutez "Health Check" pour valider toutes les relations et calculs automatiques (Golden Visa, prix, etc.).
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">3. Détection des orphelins</h4>
                <p className="text-sm text-muted-foreground">
                  Le "Rapport d'Intégrité" identifie les éléments orphelins et permet leur nettoyage sécurisé.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">4. Analyse des métriques</h4>
                <p className="text-sm text-muted-foreground">
                  Le "Dashboard Statistiques" affiche les métriques globales et indicateurs de performance.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Tests recommandés :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Testez la suppression cascade (projet avec bâtiments)</li>
                  <li>• Vérifiez les calculs Golden Visa (projets ≥ €300,000)</li>
                  <li>• Validez les breadcrumbs sur les pages de détail</li>
                  <li>• Contrôlez les compteurs d'éléments enfants</li>
                  <li>• Testez les filtres et recherches</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTestIntegration;