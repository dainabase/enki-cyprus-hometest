import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { runAllHealthChecks, TestResult } from '@/lib/supabase/test-helpers';

const HealthCheckPanel = () => {
  const [checks, setChecks] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runChecks = async () => {
    setIsRunning(true);
    try {
      const results = await runAllHealthChecks();
      setChecks(results);
    } catch (error) {
      console.error('Error running health checks:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">✅ PASS</Badge>;
      case 'fail':
        return <Badge variant="destructive">❌ FAIL</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⚠️ WARNING</Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const overallStatus = checks.length > 0 ? (
    checks.every(c => c.status === 'pass') ? 'pass' :
    checks.some(c => c.status === 'fail') ? 'fail' : 'warning'
  ) : ('pass' as const);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <CardTitle>Health Check</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {checks.length > 0 && getStatusBadge(overallStatus)}
            <Button 
              onClick={runChecks} 
              disabled={isRunning}
              size="sm"
            >
              {isRunning ? 'Vérification...' : 'Exécuter les vérifications'}
            </Button>
          </div>
        </div>
        <CardDescription>
          Vérification de l'intégrité des relations et des calculs automatiques
        </CardDescription>
      </CardHeader>
      <CardContent>
        {checks.length === 0 && !isRunning && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Cliquez sur "Exécuter les vérifications" pour commencer</p>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Vérification en cours...</p>
          </div>
        )}

        {checks.length > 0 && (
          <div className="space-y-4">
            {checks.map((check, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                {getStatusIcon(check.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{check.name}</h4>
                    {getStatusBadge(check.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{check.message}</p>
                  
                  {check.details && Array.isArray(check.details) && check.details.length > 0 && (
                    <div className="mt-3 p-3 bg-muted rounded text-sm">
                      <p className="font-medium mb-2">Détails ({check.details.length} élément(s)):</p>
                      <ul className="space-y-1">
                        {check.details.slice(0, 3).map((item: any, idx: number) => (
                          <li key={idx} className="text-xs">
                            • {item.title || item.name || `ID: ${item.id}`}
                          </li>
                        ))}
                        {check.details.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            ... et {check.details.length - 3} autre(s)
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthCheckPanel;