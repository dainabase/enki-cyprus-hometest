import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatusFieldsDebugProps {
  form: UseFormReturn<any>;
}

export const StatusFieldsDebug: React.FC<StatusFieldsDebugProps> = ({ form }) => {
  const watchedValues = form.watch(['status', 'statut_commercial', 'statut_travaux', 'avancement_travaux']);
  
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">🐛 Debug - Valeurs des champs de statut</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <strong>Status:</strong> 
            <Badge variant="outline" className="ml-2">
              {watchedValues[0] || 'undefined'}
            </Badge>
          </div>
          <div>
            <strong>Statut commercial:</strong> 
            <Badge variant="outline" className="ml-2">
              {watchedValues[1] || 'undefined'}
            </Badge>
          </div>
          <div>
            <strong>Statut travaux:</strong> 
            <Badge variant="outline" className="ml-2">
              {watchedValues[2] || 'undefined'}
            </Badge>
          </div>
          <div>
            <strong>Avancement:</strong> 
            <Badge variant="outline" className="ml-2">
              {watchedValues[3] || 0}%
            </Badge>
          </div>
        </div>
        
        <div className="mt-4 p-2 bg-white rounded border text-xs">
          <strong>Raw form values:</strong>
          <pre className="mt-1 text-[10px] overflow-auto">
            {JSON.stringify({
              status: form.getValues('status'),
              statut_commercial: form.getValues('statut_commercial'),
              statut_travaux: form.getValues('statut_travaux'),
              avancement_travaux: form.getValues('avancement_travaux')
            }, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};