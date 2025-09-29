import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BuildingForm from '@/components/admin/buildings/BuildingForm';
import { fetchBuildingById, updateBuilding } from '@/lib/api/buildings';
import { BuildingFormData } from '@/types/building';
import { useToast } from '@/hooks/use-toast';

const EditBuilding = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: building, isLoading } = useQuery({
    queryKey: ['building', id],
    queryFn: () => fetchBuildingById(id!),
    enabled: !!id
  });

  const handleSave = async (data: BuildingFormData) => {
    if (!id) return;
    
    try {
      await updateBuilding(id, data);
      toast({
        title: "Succès",
        description: "Bâtiment modifié avec succès",
      });
      navigate('/admin/buildings');
    } catch (error) {
      console.error('Error updating building:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du bâtiment",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Chargement du bâtiment...</p>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Bâtiment introuvable
        </h3>
        <p className="text-gray-500 mb-4">
          Le bâtiment demandé n'existe pas ou a été supprimé.
        </p>
        <Button onClick={() => navigate('/admin/buildings')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">
            Modifier le bâtiment
          </h1>
          <p className="text-gray-500 mt-1">
            {building.building_name} - {building.project?.title}
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
            building={building}
            onSave={handleSave}
            onCancel={() => navigate('/admin/buildings')}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBuilding;