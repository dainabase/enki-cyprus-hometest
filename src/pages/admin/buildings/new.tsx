import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BuildingForm from '@/components/admin/buildings/BuildingForm';
import { createBuildingGlobal } from '@/lib/api/buildings';
import { BuildingFormData } from '@/types/building';
import { useToast } from '@/hooks/use-toast';

const NewBuilding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async (data: BuildingFormData) => {
    try {
      await createBuildingGlobal(data);
      toast({
        title: "Succès",
        description: "Bâtiment créé avec succès",
      });
      navigate('/admin/buildings');
    } catch (error) {
      console.error('Error creating building:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du bâtiment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/admin/buildings')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouveau bâtiment</h1>
          <p className="text-gray-500 mt-1">
            Créez un nouveau bâtiment avec tous ses détails et équipements
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations du bâtiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BuildingForm
            onSave={handleSave}
            onCancel={() => navigate('/admin/buildings')}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewBuilding;