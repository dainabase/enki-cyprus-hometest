// Test simple pour vérifier le fonctionnement du système
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestPage = () => {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Page de Test Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Si vous voyez cette page, le système de routing fonctionne.</p>
          <div className="mt-4 space-y-2">
            <p>✅ Routes configurées</p>
            <p>✅ Composants chargés</p>
            <p>✅ Imports résolus</p>
          </div>
          <div className="mt-6">
            <a href="/admin" className="text-blue-600 hover:underline">
              → Retour au Dashboard Admin
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;
