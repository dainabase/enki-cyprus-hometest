import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BuildingFormData } from '@/types/building';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Save, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BuildingFormProps {
  building?: any;
  onSave?: (data: BuildingFormData) => Promise<void>;
  onCancel?: () => void;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ building, onSave, onCancel }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  
  // État complet avec TOUS les 77 champs de la base de données
  const [formData, setFormData] = useState<BuildingFormData>({
    // Section 1 : Informations de base (9 champs)
    project_id: building?.project_id || '',
    building_name: building?.building_name || '',
    building_code: building?.building_code || '',
    display_order: building?.display_order || 0,
    building_type: building?.building_type || 'residential',
    building_class: building?.building_class || 'A',
    
    // Section 2 : Structure (11 champs)
    total_floors: building?.total_floors || 1,
    total_units: building?.total_units || 1,
    units_available: building?.units_available || 0,
    construction_status: building?.construction_status || 'planning',
    expected_completion: building?.expected_completion || '',
    actual_completion: building?.actual_completion || '',
    energy_rating: building?.energy_rating || '',
    energy_certificate: building?.energy_certificate || 'B',
    elevator_count: building?.elevator_count || 0,
    has_elevator: building?.has_elevator || false,
    created_by: building?.created_by || '',
    
    // Section 3 : Infrastructure technique (12 champs)
    has_generator: building?.has_generator || false,
    has_solar_panels: building?.has_solar_panels || false,
    central_vacuum_system: building?.central_vacuum_system || false,
    water_softener_system: building?.water_softener_system || false,
    water_purification_system: building?.water_purification_system || false,
    smart_building_system: building?.smart_building_system || false,
    intercom_system: building?.intercom_system || false,
    has_intercom: building?.has_intercom || false,
    package_room: building?.package_room || false,
    bike_storage: building?.bike_storage || false,
    pet_washing_station: building?.pet_washing_station || false,
    car_wash_area: building?.car_wash_area || false,
    
    // Section 4 : Sécurité (6 champs)
    has_security_system: building?.has_security_system || false,
    has_security_24_7: building?.has_security_24_7 || false,
    has_cctv: building?.has_cctv || false,
    has_concierge: building?.has_concierge || false,
    has_security_door: building?.has_security_door || false,
    concierge_service: building?.concierge_service || false,
    
    // Section 5 : Équipements communs (9 champs)
    has_pool: building?.has_pool || false,
    has_gym: building?.has_gym || false,
    has_spa: building?.has_spa || false,
    has_playground: building?.has_playground || false,
    has_garden: building?.has_garden || false,
    has_parking: building?.has_parking || false,
    parking_type: building?.parking_type || 'outdoor',
    disabled_parking_spaces: building?.disabled_parking_spaces || 0,
    shuttle_service: building?.shuttle_service || false,
    
    // Section 6 : Services & Commerce (7 champs)
    restaurant: building?.restaurant || false,
    cafe: building?.cafe || false,
    mini_market: building?.mini_market || false,
    business_center: building?.business_center || false,
    kids_club: building?.kids_club || false,
    coworking_space: building?.coworking_space || false,
    club_house: building?.club_house || false,
    
    // Section 7 : Accessibilité (8 champs)
    wheelchair_accessible: building?.wheelchair_accessible || false,
    braille_signage: building?.braille_signage || false,
    audio_assistance: building?.audio_assistance || false,
    accessible_bathrooms: building?.accessible_bathrooms || 0,
    ramp_access: building?.ramp_access || false,
    wide_doorways: building?.wide_doorways || false,
    accessible_elevator: building?.accessible_elevator || false,
    
    // Section 8 : Loisirs & Sports (7 champs)
    has_tennis_court: building?.has_tennis_court || false,
    beach_access: building?.beach_access || false,
    marina_access: building?.marina_access || false,
    golf_course: building?.golf_course || false,
    sports_facilities: building?.sports_facilities || false,
    wellness_center: building?.wellness_center || false,
    
    // Section 9 : Documents (3 champs)
    typical_floor_plan_url: building?.typical_floor_plan_url || '',
    model_3d_url: building?.model_3d_url || '',
    building_brochure_url: building?.building_brochure_url || '',
    
    // Section 10 : Données avancées JSONB (7 champs)
    building_amenities: building?.building_amenities || {},
    common_areas: building?.common_areas || {},
    security_features: building?.security_features || {},
    wellness_facilities: building?.wellness_facilities || {},
    infrastructure: building?.infrastructure || {},
    outdoor_facilities: building?.outdoor_facilities || {},
    floor_plans: building?.floor_plans || {}
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, cyprus_zone')
      .order('title');
    
    if (data) {
      setProjects(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_id) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un projet",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (onSave) {
        await onSave(formData);
      } else {
        // Sauvegarde directe si pas de fonction onSave fournie
        if (building?.id) {
          const { error } = await supabase
            .from('buildings')
            .update(formData)
            .eq('id', building.id);
          
          if (error) throw error;
          toast({
            title: "Succès",
            description: "Bâtiment mis à jour avec succès"
          });
        } else {
          const { error } = await supabase
            .from('buildings')
            .insert([formData]);
          
          if (error) throw error;
          toast({
            title: "Succès",
            description: "Bâtiment créé avec succès"
          });
        }
        navigate('/admin/buildings');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/admin/buildings');
    }
  };

  // Fonction pour gérer les changements des champs JSONB
  const handleJsonChange = (field: string, value: string) => {
    try {
      const parsed = value ? JSON.parse(value) : {};
      setFormData(prev => ({ ...prev, [field]: parsed }));
    } catch (error) {
      // Si erreur de parsing, on garde la valeur string temporairement
      console.error('JSON parsing error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header avec boutons d'action */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {building ? 'Modifier le bâtiment' : 'Nouveau bâtiment'}
        </h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {/* Tabs avec tous les champs organisés */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-1 h-auto p-1 mb-6">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Général
          </TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="amenities">Équipements</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
          <TabsTrigger value="leisure">Loisirs</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        {/* Tab 1 - Général (9 champs) */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Informations de base du bâtiment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Projet (OBLIGATOIRE) */}
                <div className="space-y-2">
                  <Label htmlFor="project_id">Projet *</Label>
                  <Select 
                    value={formData.project_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, project_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title} - {project.cyprus_zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nom du bâtiment */}
                <div className="space-y-2">
                  <Label htmlFor="building_name">Nom du bâtiment *</Label>
                  <Input
                    id="building_name"
                    value={formData.building_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, building_name: e.target.value }))}
                    required
                  />
                </div>

                {/* Code du bâtiment */}
                <div className="space-y-2">
                  <Label htmlFor="building_code">Code du bâtiment</Label>
                  <Input
                    id="building_code"
                    value={formData.building_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, building_code: e.target.value }))}
                    placeholder="Ex: B-01"
                  />
                </div>

                {/* Ordre d'affichage */}
                <div className="space-y-2">
                  <Label htmlFor="display_order">Ordre d'affichage</Label>
                  <Input
                    type="number"
                    id="display_order"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                {/* Type de bâtiment */}
                <div className="space-y-2">
                  <Label htmlFor="building_type">Type de bâtiment</Label>
                  <Select
                    value={formData.building_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, building_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Résidentiel</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed">Mixte</SelectItem>
                      <SelectItem value="office">Bureau</SelectItem>
                      <SelectItem value="hotel">Hôtel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Classe du bâtiment */}
                <div className="space-y-2">
                  <Label htmlFor="building_class">Classe du bâtiment</Label>
                  <Select
                    value={formData.building_class}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, building_class: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2 - Structure (11 champs) */}
        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Structure du bâtiment</CardTitle>
              <CardDescription>Informations structurelles et construction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre d'étages */}
                <div className="space-y-2">
                  <Label htmlFor="total_floors">Nombre d'étages</Label>
                  <Input
                    type="number"
                    id="total_floors"
                    value={formData.total_floors}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_floors: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>

                {/* Total d'unités */}
                <div className="space-y-2">
                  <Label htmlFor="total_units">Total d'unités</Label>
                  <Input
                    type="number"
                    id="total_units"
                    value={formData.total_units}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_units: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                {/* Unités disponibles */}
                <div className="space-y-2">
                  <Label htmlFor="units_available">Unités disponibles</Label>
                  <Input
                    type="number"
                    id="units_available"
                    value={formData.units_available}
                    onChange={(e) => setFormData(prev => ({ ...prev, units_available: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                {/* Statut de construction */}
                <div className="space-y-2">
                  <Label htmlFor="construction_status">Statut de construction</Label>
                  <Select
                    value={formData.construction_status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, construction_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planification</SelectItem>
                      <SelectItem value="approved">Approuvé</SelectItem>
                      <SelectItem value="construction">En construction</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="delivered">Livré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date de livraison prévue */}
                <div className="space-y-2">
                  <Label htmlFor="expected_completion">Date de livraison prévue</Label>
                  <Input
                    type="date"
                    id="expected_completion"
                    value={formData.expected_completion}
                    onChange={(e) => setFormData(prev => ({ ...prev, expected_completion: e.target.value }))}
                  />
                </div>

                {/* Date de livraison réelle */}
                <div className="space-y-2">
                  <Label htmlFor="actual_completion">Date de livraison réelle</Label>
                  <Input
                    type="date"
                    id="actual_completion"
                    value={formData.actual_completion}
                    onChange={(e) => setFormData(prev => ({ ...prev, actual_completion: e.target.value }))}
                  />
                </div>

                {/* Certificat énergétique */}
                <div className="space-y-2">
                  <Label htmlFor="energy_certificate">Certificat énergétique</Label>
                  <Select
                    value={formData.energy_certificate}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, energy_certificate: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                      <SelectItem value="G">G</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Nombre d'ascenseurs */}
                <div className="space-y-2">
                  <Label htmlFor="elevator_count">Nombre d'ascenseurs</Label>
                  <Input
                    type="number"
                    id="elevator_count"
                    value={formData.elevator_count}
                    onChange={(e) => setFormData(prev => ({ ...prev, elevator_count: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                {/* Ascenseur */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_elevator"
                    checked={formData.has_elevator}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_elevator: checked }))}
                  />
                  <Label htmlFor="has_elevator">Ascenseur</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3 - Infrastructure (12 champs) */}
        <TabsContent value="infrastructure">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure technique</CardTitle>
              <CardDescription>Systèmes et équipements techniques du bâtiment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Générateur */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_generator"
                    checked={formData.has_generator}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_generator: checked }))}
                  />
                  <Label htmlFor="has_generator">Générateur</Label>
                </div>

                {/* Panneaux solaires */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_solar_panels"
                    checked={formData.has_solar_panels}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_solar_panels: checked }))}
                  />
                  <Label htmlFor="has_solar_panels">Panneaux solaires</Label>
                </div>

                {/* Système d'aspiration centralisé */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="central_vacuum_system"
                    checked={formData.central_vacuum_system}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, central_vacuum_system: checked }))}
                  />
                  <Label htmlFor="central_vacuum_system">Aspiration centralisée</Label>
                </div>

                {/* Adoucisseur d'eau */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="water_softener_system"
                    checked={formData.water_softener_system}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, water_softener_system: checked }))}
                  />
                  <Label htmlFor="water_softener_system">Adoucisseur d'eau</Label>
                </div>

                {/* Système de purification d'eau */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="water_purification_system"
                    checked={formData.water_purification_system}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, water_purification_system: checked }))}
                  />
                  <Label htmlFor="water_purification_system">Purification d'eau</Label>
                </div>

                {/* Système de bâtiment intelligent */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smart_building_system"
                    checked={formData.smart_building_system}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, smart_building_system: checked }))}
                  />
                  <Label htmlFor="smart_building_system">Bâtiment intelligent</Label>
                </div>

                {/* Système interphone */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="intercom_system"
                    checked={formData.intercom_system}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, intercom_system: checked }))}
                  />
                  <Label htmlFor="intercom_system">Système interphone</Label>
                </div>

                {/* Interphone */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_intercom"
                    checked={formData.has_intercom}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_intercom: checked }))}
                  />
                  <Label htmlFor="has_intercom">Interphone</Label>
                </div>

                {/* Salle de colis */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="package_room"
                    checked={formData.package_room}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, package_room: checked }))}
                  />
                  <Label htmlFor="package_room">Salle de colis</Label>
                </div>

                {/* Stockage vélos */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bike_storage"
                    checked={formData.bike_storage}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, bike_storage: checked }))}
                  />
                  <Label htmlFor="bike_storage">Stockage vélos</Label>
                </div>

                {/* Station de lavage animaux */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pet_washing_station"
                    checked={formData.pet_washing_station}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pet_washing_station: checked }))}
                  />
                  <Label htmlFor="pet_washing_station">Station lavage animaux</Label>
                </div>

                {/* Zone de lavage voiture */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="car_wash_area"
                    checked={formData.car_wash_area}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, car_wash_area: checked }))}
                  />
                  <Label htmlFor="car_wash_area">Zone lavage voiture</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4 - Sécurité (6 champs) */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Systèmes et services de sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Système de sécurité */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_security_system"
                    checked={formData.has_security_system}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_security_system: checked }))}
                  />
                  <Label htmlFor="has_security_system">Système de sécurité</Label>
                </div>

                {/* Sécurité 24/7 */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_security_24_7"
                    checked={formData.has_security_24_7}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_security_24_7: checked }))}
                  />
                  <Label htmlFor="has_security_24_7">Sécurité 24/7</Label>
                </div>

                {/* Vidéosurveillance */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_cctv"
                    checked={formData.has_cctv}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_cctv: checked }))}
                  />
                  <Label htmlFor="has_cctv">Vidéosurveillance (CCTV)</Label>
                </div>

                {/* Concierge */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_concierge"
                    checked={formData.has_concierge}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_concierge: checked }))}
                  />
                  <Label htmlFor="has_concierge">Concierge</Label>
                </div>

                {/* Porte sécurisée */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_security_door"
                    checked={formData.has_security_door}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_security_door: checked }))}
                  />
                  <Label htmlFor="has_security_door">Porte sécurisée</Label>
                </div>

                {/* Service de conciergerie */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="concierge_service"
                    checked={formData.concierge_service}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, concierge_service: checked }))}
                  />
                  <Label htmlFor="concierge_service">Service de conciergerie</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5 - Équipements (9 champs) */}
        <TabsContent value="amenities">
          <Card>
            <CardHeader>
              <CardTitle>Équipements communs</CardTitle>
              <CardDescription>Équipements et installations partagés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Piscine */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_pool"
                    checked={formData.has_pool}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_pool: checked }))}
                  />
                  <Label htmlFor="has_pool">Piscine</Label>
                </div>

                {/* Salle de sport */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_gym"
                    checked={formData.has_gym}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_gym: checked }))}
                  />
                  <Label htmlFor="has_gym">Salle de sport</Label>
                </div>

                {/* Spa */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_spa"
                    checked={formData.has_spa}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_spa: checked }))}
                  />
                  <Label htmlFor="has_spa">Spa</Label>
                </div>

                {/* Aire de jeux */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_playground"
                    checked={formData.has_playground}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_playground: checked }))}
                  />
                  <Label htmlFor="has_playground">Aire de jeux</Label>
                </div>

                {/* Jardin */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_garden"
                    checked={formData.has_garden}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_garden: checked }))}
                  />
                  <Label htmlFor="has_garden">Jardin</Label>
                </div>

                {/* Parking */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_parking"
                    checked={formData.has_parking}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_parking: checked }))}
                  />
                  <Label htmlFor="has_parking">Parking</Label>
                </div>

                {/* Type de parking */}
                <div className="space-y-2">
                  <Label htmlFor="parking_type">Type de parking</Label>
                  <Select
                    value={formData.parking_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, parking_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="underground">Souterrain</SelectItem>
                      <SelectItem value="covered">Couvert</SelectItem>
                      <SelectItem value="outdoor">Extérieur</SelectItem>
                      <SelectItem value="mixed">Mixte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Places PMR */}
                <div className="space-y-2">
                  <Label htmlFor="disabled_parking_spaces">Places parking PMR</Label>
                  <Input
                    type="number"
                    id="disabled_parking_spaces"
                    value={formData.disabled_parking_spaces}
                    onChange={(e) => setFormData(prev => ({ ...prev, disabled_parking_spaces: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                {/* Service navette */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="shuttle_service"
                    checked={formData.shuttle_service}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shuttle_service: checked }))}
                  />
                  <Label htmlFor="shuttle_service">Service navette</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6 - Services (7 champs) */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services & Commerce</CardTitle>
              <CardDescription>Services et commerces disponibles dans le bâtiment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Restaurant */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="restaurant"
                    checked={formData.restaurant}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, restaurant: checked }))}
                  />
                  <Label htmlFor="restaurant">Restaurant</Label>
                </div>

                {/* Café */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cafe"
                    checked={formData.cafe}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, cafe: checked }))}
                  />
                  <Label htmlFor="cafe">Café</Label>
                </div>

                {/* Supérette */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="mini_market"
                    checked={formData.mini_market}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, mini_market: checked }))}
                  />
                  <Label htmlFor="mini_market">Supérette</Label>
                </div>

                {/* Business center */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="business_center"
                    checked={formData.business_center}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, business_center: checked }))}
                  />
                  <Label htmlFor="business_center">Business center</Label>
                </div>

                {/* Club enfants */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="kids_club"
                    checked={formData.kids_club}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, kids_club: checked }))}
                  />
                  <Label htmlFor="kids_club">Club enfants</Label>
                </div>

                {/* Espace coworking */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="coworking_space"
                    checked={formData.coworking_space}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, coworking_space: checked }))}
                  />
                  <Label htmlFor="coworking_space">Espace coworking</Label>
                </div>

                {/* Club house */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="club_house"
                    checked={formData.club_house}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, club_house: checked }))}
                  />
                  <Label htmlFor="club_house">Club house</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7 - Accessibilité (8 champs) */}
        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle>Accessibilité</CardTitle>
              <CardDescription>Équipements d'accessibilité pour personnes à mobilité réduite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Accessible en fauteuil roulant */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="wheelchair_accessible"
                    checked={formData.wheelchair_accessible}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wheelchair_accessible: checked }))}
                  />
                  <Label htmlFor="wheelchair_accessible">Accessible en fauteuil roulant</Label>
                </div>

                {/* Signalétique braille */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="braille_signage"
                    checked={formData.braille_signage}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, braille_signage: checked }))}
                  />
                  <Label htmlFor="braille_signage">Signalétique braille</Label>
                </div>

                {/* Assistance audio */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="audio_assistance"
                    checked={formData.audio_assistance}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, audio_assistance: checked }))}
                  />
                  <Label htmlFor="audio_assistance">Assistance audio</Label>
                </div>

                {/* Salles de bain accessibles */}
                <div className="space-y-2">
                  <Label htmlFor="accessible_bathrooms">Salles de bain accessibles</Label>
                  <Input
                    type="number"
                    id="accessible_bathrooms"
                    value={formData.accessible_bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessible_bathrooms: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                {/* Accès rampe */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ramp_access"
                    checked={formData.ramp_access}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ramp_access: checked }))}
                  />
                  <Label htmlFor="ramp_access">Accès rampe</Label>
                </div>

                {/* Portes larges */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="wide_doorways"
                    checked={formData.wide_doorways}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wide_doorways: checked }))}
                  />
                  <Label htmlFor="wide_doorways">Portes larges</Label>
                </div>

                {/* Ascenseur accessible */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="accessible_elevator"
                    checked={formData.accessible_elevator}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, accessible_elevator: checked }))}
                  />
                  <Label htmlFor="accessible_elevator">Ascenseur accessible</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 8 - Loisirs (7 champs) */}
        <TabsContent value="leisure">
          <Card>
            <CardHeader>
              <CardTitle>Loisirs & Sports</CardTitle>
              <CardDescription>Installations de loisirs et sportives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Court de tennis */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_tennis_court"
                    checked={formData.has_tennis_court}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_tennis_court: checked }))}
                  />
                  <Label htmlFor="has_tennis_court">Court de tennis</Label>
                </div>

                {/* Accès plage */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="beach_access"
                    checked={formData.beach_access}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, beach_access: checked }))}
                  />
                  <Label htmlFor="beach_access">Accès plage</Label>
                </div>

                {/* Accès marina */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="marina_access"
                    checked={formData.marina_access}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marina_access: checked }))}
                  />
                  <Label htmlFor="marina_access">Accès marina</Label>
                </div>

                {/* Golf */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="golf_course"
                    checked={formData.golf_course}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, golf_course: checked }))}
                  />
                  <Label htmlFor="golf_course">Golf</Label>
                </div>

                {/* Installations sportives */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sports_facilities"
                    checked={formData.sports_facilities}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sports_facilities: checked }))}
                  />
                  <Label htmlFor="sports_facilities">Installations sportives</Label>
                </div>

                {/* Centre de bien-être */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="wellness_center"
                    checked={formData.wellness_center}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wellness_center: checked }))}
                  />
                  <Label htmlFor="wellness_center">Centre de bien-être</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 9 - Documents (3 champs) */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>URLs des documents et modèles liés au bâtiment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Plan d'étage type */}
                <div className="space-y-2">
                  <Label htmlFor="typical_floor_plan_url">URL Plan d'étage type</Label>
                  <Input
                    type="url"
                    id="typical_floor_plan_url"
                    value={formData.typical_floor_plan_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, typical_floor_plan_url: e.target.value }))}
                    placeholder="https://example.com/floor-plan.pdf"
                  />
                </div>

                {/* Modèle 3D */}
                <div className="space-y-2">
                  <Label htmlFor="model_3d_url">URL Modèle 3D</Label>
                  <Input
                    type="url"
                    id="model_3d_url"
                    value={formData.model_3d_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, model_3d_url: e.target.value }))}
                    placeholder="https://example.com/model-3d.obj"
                  />
                </div>

                {/* Brochure du bâtiment */}
                <div className="space-y-2">
                  <Label htmlFor="building_brochure_url">URL Brochure du bâtiment</Label>
                  <Input
                    type="url"
                    id="building_brochure_url"
                    value={formData.building_brochure_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, building_brochure_url: e.target.value }))}
                    placeholder="https://example.com/brochure.pdf"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 10 - Avancé (7 champs JSONB) */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Données avancées</CardTitle>
              <CardDescription>Données JSONB pour des informations structurées complexes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Équipements du bâtiment */}
                <div className="space-y-2">
                  <Label htmlFor="building_amenities">Équipements du bâtiment (JSON)</Label>
                  <Textarea
                    id="building_amenities"
                    value={JSON.stringify(formData.building_amenities, null, 2)}
                    onChange={(e) => handleJsonChange('building_amenities', e.target.value)}
                    placeholder='{"wifi": true, "air_conditioning": "central", "heating": "gas"}'
                    rows={4}
                  />
                </div>

                {/* Espaces communs */}
                <div className="space-y-2">
                  <Label htmlFor="common_areas">Espaces communs (JSON)</Label>
                  <Textarea
                    id="common_areas"
                    value={JSON.stringify(formData.common_areas, null, 2)}
                    onChange={(e) => handleJsonChange('common_areas', e.target.value)}
                    placeholder='{"lobby": "luxurious", "corridors": "wide", "rooftop": "terrace"}'
                    rows={4}
                  />
                </div>

                {/* Caractéristiques de sécurité */}
                <div className="space-y-2">
                  <Label htmlFor="security_features">Caractéristiques de sécurité (JSON)</Label>
                  <Textarea
                    id="security_features"
                    value={JSON.stringify(formData.security_features, null, 2)}
                    onChange={(e) => handleJsonChange('security_features', e.target.value)}
                    placeholder='{"cameras": 24, "guards": 3, "access_control": "card"}'
                    rows={4}
                  />
                </div>

                {/* Installations de bien-être */}
                <div className="space-y-2">
                  <Label htmlFor="wellness_facilities">Installations de bien-être (JSON)</Label>
                  <Textarea
                    id="wellness_facilities"
                    value={JSON.stringify(formData.wellness_facilities, null, 2)}
                    onChange={(e) => handleJsonChange('wellness_facilities', e.target.value)}
                    placeholder='{"sauna": true, "hammam": false, "massage_rooms": 2}'
                    rows={4}
                  />
                </div>

                {/* Infrastructure */}
                <div className="space-y-2">
                  <Label htmlFor="infrastructure">Infrastructure (JSON)</Label>
                  <Textarea
                    id="infrastructure"
                    value={JSON.stringify(formData.infrastructure, null, 2)}
                    onChange={(e) => handleJsonChange('infrastructure', e.target.value)}
                    placeholder='{"fiber_optic": true, "backup_power": "generator", "water_tanks": 3}'
                    rows={4}
                  />
                </div>

                {/* Installations extérieures */}
                <div className="space-y-2">
                  <Label htmlFor="outdoor_facilities">Installations extérieures (JSON)</Label>
                  <Textarea
                    id="outdoor_facilities"
                    value={JSON.stringify(formData.outdoor_facilities, null, 2)}
                    onChange={(e) => handleJsonChange('outdoor_facilities', e.target.value)}
                    placeholder='{"bbq_area": true, "picnic_area": false, "jogging_track": "500m"}'
                    rows={4}
                  />
                </div>

                {/* Plans d'étage */}
                <div className="space-y-2">
                  <Label htmlFor="floor_plans">Plans d'étage (JSON)</Label>
                  <Textarea
                    id="floor_plans"
                    value={JSON.stringify(formData.floor_plans, null, 2)}
                    onChange={(e) => handleJsonChange('floor_plans', e.target.value)}
                    placeholder='{"ground": "commercial", "1-5": "residential", "rooftop": "terrace"}'
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default BuildingForm;