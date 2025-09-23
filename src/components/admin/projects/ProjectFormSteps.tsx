import React, { useEffect, useState, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { MediaUploader } from './MediaUploader';
import { CategorizedMediaUploader } from './CategorizedMediaUploader';

import { BuildingCards } from './BuildingCards';
import { AmenitiesSelector } from './AmenitiesSelector';
import { CommoditiesCheckboxes } from './CommoditiesCheckboxes';
import PropertySubTypeSelector from './PropertySubTypeSelector';
import { googleMapsAgent } from '@/services/googleMapsAgent';
import { BuildingSection } from './BuildingSection';

// IMPORT DES NOUVEAUX COMPOSANTS
import { LocationSection } from './LocationSection';
import { SpecificationsSection } from './SpecificationsSection';
import { MarketingSection } from './MarketingSection';

import { ProjectFormData } from '@/schemas/projectSchema';
import { ProjectBuilding } from '@/types/building.project';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building, MapPin, Home, Zap, Landmark, Building2, Waves, Shield, 
  Sprout, Accessibility, Map as MapIcon, Palmtree, Users, Heart,
  HardHat, Palette, Sparkles, FileText, CreditCard, Gift, 
  PiggyBank, BarChart3, Youtube, Video, Headphones, Smartphone,
  Globe, Search, Star, Target, Link, Plus, Brain,
  Stethoscope, Smile, PawPrint, ShoppingCart, Store, ShoppingBag, 
  School, GraduationCap, Library, Globe2, Baby, BookOpen, Bus, Car, 
  Plane, Anchor, Fuel, Mail, Trees, Flag, Dumbbell, Circle, Dice1, 
  Film, Drama, UtensilsCrossed, Coffee, Wine, Pizza, Utensils, Music, Church,
  Navigation, Route, Loader2, ParkingSquare as ParkingCircle, Train, 
  Croissant, Flame, Camera, Hotel, Shirt, Scissors, ChevronRight, ChevronDown, Eye, EyeOff, Clock
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { generateSEOContent } from '@/services/seoGenerator';
import { LocationMap } from './LocationMap';
import { safeBase64Encode, generateShortHash } from '@/utils/stringHelpers';

interface ProjectFormStepsProps {
  form: UseFormReturn<ProjectFormData>;
  currentStep: string;
  projectId?: string;
}

export const ProjectFormSteps: React.FC<ProjectFormStepsProps> = ({ form, currentStep, projectId }) => {
  const { t } = useTranslation();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionRadius, setDetectionRadius] = useState(2); // Rayon par défaut 2km
  const [autoRedetect, setAutoRedetect] = useState(false);
  const [detectedCount, setDetectedCount] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());

  // COMMODITÉS ESSENTIELLES (12 critères d'achat prioritaires)
  const ESSENTIAL_AMENITIES = [
    'school',           // 1. École
    'supermarket',      // 2. Supermarché  
    'transport_public', // 3. Transport public
    'hospital',         // 4. Hôpital
    'pharmacy',         // 5. Pharmacie
    'shopping_center',  // 6. Centre commercial
    'university',       // 7. Université
    'beach',           // 8. Plage
    'bank',            // 9. Banque
    'restaurant',      // 10. Restaurant
    'gym',             // 11. Salle de sport
    'cafe'             // 12. Café
  ];

  const amenityOptions = [
    { value: 'transport_public', label: 'Transport public', icon: <Bus className="h-4 w-4" /> },
    { value: 'beach', label: 'Plage', icon: <Waves className="h-4 w-4" /> },
    { value: 'hospital', label: 'Hôpital', icon: <Building2 className="h-4 w-4" /> },
    { value: 'pharmacy', label: 'Pharmacie', icon: <Heart className="h-4 w-4" /> },
    { value: 'school', label: 'École', icon: <GraduationCap className="h-4 w-4" /> },
    { value: 'university', label: 'Université', icon: <School className="h-4 w-4" /> },
    { value: 'supermarket', label: 'Supermarché', icon: <ShoppingCart className="h-4 w-4" /> },
    { value: 'shopping_center', label: 'Centre commercial', icon: <Store className="h-4 w-4" /> },
    { value: 'restaurant', label: 'Restaurant', icon: <UtensilsCrossed className="h-4 w-4" /> },
    { value: 'cafe', label: 'Café', icon: <Coffee className="h-4 w-4" /> },
    { value: 'bank', label: 'Banque', icon: <Landmark className="h-4 w-4" /> },
    { value: 'atm', label: 'ATM', icon: <CreditCard className="h-4 w-4" /> },
    { value: 'post_office', label: 'Bureau de poste', icon: <Mail className="h-4 w-4" /> },
    { value: 'park', label: 'Parc', icon: <Trees className="h-4 w-4" /> },
    { value: 'gym', label: 'Salle de sport', icon: <Dumbbell className="h-4 w-4" /> },
    { value: 'spa', label: 'Spa', icon: <Sparkles className="h-4 w-4" /> },
    { value: 'cinema', label: 'Cinéma', icon: <Film className="h-4 w-4" /> },
    { value: 'parking', label: 'Parking', icon: <ParkingCircle className="h-4 w-4" /> },
    { value: 'gas_station', label: 'Station essence', icon: <Fuel className="h-4 w-4" /> },
    { value: 'church', label: 'Église', icon: <Church className="h-4 w-4" /> },
    { value: 'airport', label: 'Aéroport', icon: <Plane className="h-4 w-4" /> },
    { value: 'train_station', label: 'Gare', icon: <Train className="h-4 w-4" /> },
    { value: 'bus_station', label: 'Arrêt de bus', icon: <Bus className="h-4 w-4" /> },
    { value: 'dentist', label: 'Dentiste', icon: <Heart className="h-4 w-4" /> },
    { value: 'veterinary_care', label: 'Vétérinaire', icon: <Heart className="h-4 w-4" /> },
    { value: 'physiotherapist', label: 'Kinésithérapeute', icon: <Heart className="h-4 w-4" /> },
    { value: 'bakery', label: 'Boulangerie', icon: <Croissant className="h-4 w-4" /> },
    { value: 'bar', label: 'Bar', icon: <Wine className="h-4 w-4" /> },
    { value: 'night_club', label: 'Discothèque', icon: <Music className="h-4 w-4" /> },
    { value: 'police', label: 'Police', icon: <Shield className="h-4 w-4" /> },
    { value: 'fire_station', label: 'Pompiers', icon: <Flame className="h-4 w-4" /> },
    { value: 'city_hall', label: 'Mairie', icon: <Building className="h-4 w-4" /> },
    { value: 'museum', label: 'Musée', icon: <Building2 className="h-4 w-4" /> },
    { value: 'art_gallery', label: 'Galerie d\'art', icon: <Palette className="h-4 w-4" /> },
    { value: 'library', label: 'Bibliothèque', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'tourist_attraction', label: 'Attraction touristique', icon: <Camera className="h-4 w-4" /> },
    { value: 'hotel', label: 'Hôtel', icon: <Hotel className="h-4 w-4" /> },
    { value: 'laundry', label: 'Laverie', icon: <Shirt className="h-4 w-4" /> },
    { value: 'hair_salon', label: 'Salon de coiffure', icon: <Scissors className="h-4 w-4" /> }
  ];

  // Préparer les données pour la carte avec coordonnées réelles
  const mapCommodities = form.watch('surrounding_amenities')?.map((amenity: any, index: number) => ({
    id: amenity.nearby_amenity_id || `amenity-${index}`,
    name: amenity.details || amenity.nearby_amenity_id || 'Commodité',
    type: amenity.nearby_amenity_id || 'default',
    lat: amenity.lat || (form.watch('gps_latitude') + (Math.random() - 0.5) * 0.005), // Utiliser les vraies coordonnées si disponibles
    lng: amenity.lng || (form.watch('gps_longitude') + (Math.random() - 0.5) * 0.005),
    distance: amenity.distance_km || 1
  })) || [];
  
  const { data: developers } = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const renderBasicsStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="text-xl font-semibold text-foreground">Informations de base</CardTitle>
            <CardDescription className="text-muted-foreground">Les détails de base de votre projet</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">Nom du projet *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Marina Towers" {...field} className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">Code du projet</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: MT-2025-001" {...field} className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="property_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'residential'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="residential">Résidentiel</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="mixed">Mixte</SelectItem>
                        <SelectItem value="industrial">Industriel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="developer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Développeur *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un développeur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {developers?.map((developer) => (
                          <SelectItem key={developer.id} value={developer.id}>
                            {developer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_phase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase projet *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="off-plan">Off-plan</SelectItem>
                        <SelectItem value="under-construction">En construction</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="ready-to-move">Prêt à emménager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="property_sub_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Types de propriété *</FormLabel>
                  <FormControl>
                    <PropertySubTypeSelector
                      form={form}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statut_commercial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase commerciale *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pre_commercialisation">Pré-commercialisation</SelectItem>
                      <SelectItem value="commercialisation">En commercialisation</SelectItem>
                      <SelectItem value="reduction_prix">Réduction de prix</SelectItem>
                      <SelectItem value="dernieres_opportunites">Dernières opportunités</SelectItem>
                      <SelectItem value="vendu">Vendu</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="launch_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mois de lancement</FormLabel>
                    <FormControl>
                      <Input 
                        type="month" 
                        placeholder="2026-01"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Format: Janvier 2026 = 2026-01
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completion_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mois de livraison prévue</FormLabel>
                    <FormControl>
                      <Input 
                        type="month"
                        placeholder="2027-03"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Format: Mars 2027 = 2027-03
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description courte *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description courte du projet pour les listes..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detailed_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description complète du projet, de ses avantages, de son emplacement..."
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBuildingsStep = () => {
    const buildingsValue = form.watch('buildings') || [];
    
    // ✅ CORRECTION: Initialisation directe sans useEffect ni état local
    // Si aucun bâtiment et nouveau projet, initialiser avec un bâtiment par défaut
    if (buildingsValue.length === 0 && !projectId) {
      const defaultBuilding: ProjectBuilding = {
        building_name: `Bâtiment 1`,
        building_type: 'apartment_building',
        construction_status: 'planned',
        total_floors: 0,
        total_units: 0,
        units_available: 0
        // ⚠️ PAS de construction_year ici - CORRECTION CRITIQUE !
      };
      form.setValue('buildings', [defaultBuilding]);
    }
    
    const addBuilding = () => {
      const newBuilding: ProjectBuilding = {
        building_name: `Bâtiment ${buildingsValue.length + 1}`,
        building_type: 'apartment_building',
        construction_status: 'planned',
        total_floors: 0,
        total_units: 0,
        units_available: 0
        // ⚠️ PAS de construction_year ici - CORRECTION CRITIQUE !
      };
      form.setValue('buildings', [...buildingsValue, newBuilding]);
    };

    const updateBuilding = (index: number, building: ProjectBuilding) => {
      const newBuildings = [...buildingsValue];
      newBuildings[index] = building;
      form.setValue('buildings', newBuildings);
    };

    const removeBuilding = (index: number) => {
      const newBuildings = [...buildingsValue];
      newBuildings.splice(index, 1);
      form.setValue('buildings', newBuildings);
    };

    const duplicateBuilding = (index: number) => {
      const buildingToDuplicate = buildingsValue[index];
      const newBuilding = { ...buildingToDuplicate, building_name: `${buildingToDuplicate.building_name} - Copie` };
      form.setValue('buildings', [...buildingsValue, newBuilding]);
    };

    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Gestion des Bâtiments
            </CardTitle>
            <CardDescription>
              Configurez les bâtiments qui composent votre projet. Chaque bâtiment peut avoir ses propres caractéristiques et équipements.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <BuildingCards
              buildings={buildingsValue}
              onEdit={(index) => {
                // Functionality to be implemented: open building detail editor
                console.log('Edit building at index:', index);
              }}
              onDelete={removeBuilding}
              onAdd={addBuilding}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAmenitiesStep = () => {
    return (
      <div className="space-y-8">
        {/* CARTE UNIQUE: Prestations internes du projet */}
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Prestations du Projet</CardTitle>
            <CardDescription>
              Commodités et services disponibles à l'intérieur du projet (piscines, espaces verts, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <AmenitiesSelector
                    selectedAmenities={field.value || []}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  // Google Places Autocomplete initialization - AMÉLIORATION DE LA DÉTECTION
  useEffect(() => {
    if (currentStep === 'location' && window.google) {
      const input = document.getElementById('address-autocomplete');
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input as HTMLInputElement, {
          types: ['address'],
          componentRestrictions: { country: 'cy' },
          fields: ['address_components', 'geometry', 'formatted_address']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const addressComponents = place.address_components;
            
            let city = '';
            let postalCode = '';
            let detectedZone = '';
            
            // Extraire la ville et le code postal depuis les composants d'adresse
            addressComponents.forEach(component => {
              // Chercher la ville
              if (component.types.includes('locality')) {
                city = component.long_name;
              }
              // Alternative pour la ville
              if (!city && component.types.includes('administrative_area_level_1')) {
                city = component.long_name;
              }
              // Code postal
              if (component.types.includes('postal_code')) {
                postalCode = component.long_name;
              }
            });

            // AMÉLIORATION: Mapping complet des villes/zones vers les districts
            const zoneMapping: { [key: string]: string } = {
              // Limassol et ses variations
              'Limassol': 'limassol',
              'Lemesos': 'limassol',
              'Λεμεσός': 'limassol',
              'Germasogeia': 'limassol',
              'Yermasoyia': 'limassol',
              'Agios Tychon': 'limassol',
              'Agios Athanasios': 'limassol',
              'Mouttagiaka': 'limassol',
              'Parekklisia': 'limassol',
              'Pyrgos': 'limassol',
              'Erimi': 'limassol',
              
              // Paphos et ses variations
              'Paphos': 'paphos',
              'Pafos': 'paphos',
              'Πάφος': 'paphos',
              'Kato Paphos': 'paphos',
              'Peyia': 'paphos',
              'Coral Bay': 'paphos',
              'Chloraka': 'paphos',
              'Kissonerga': 'paphos',
              'Tala': 'paphos',
              'Kouklia': 'paphos',
              
              // Larnaca et ses variations
              'Larnaca': 'larnaca',
              'Larnaka': 'larnaca',
              'Λάρνακα': 'larnaca',
              'Oroklini': 'larnaca',
              'Pyla': 'larnaca',
              'Livadia': 'larnaca',
              'Dromolaxia': 'larnaca',
              'Tersefanou': 'larnaca',
              
              // Nicosia et ses variations
              'Nicosia': 'nicosia',
              'Lefkosia': 'nicosia',
              'Λευκωσία': 'nicosia',
              'Strovolos': 'nicosia',
              'Lakatamia': 'nicosia',
              'Latsia': 'nicosia',
              'Engomi': 'nicosia',
              'Agios Dometios': 'nicosia',
              'Aglantzia': 'nicosia',
              
              // Famagusta et ses variations
              'Famagusta': 'famagusta',
              'Ammochostos': 'famagusta',
              'Αμμόχωστος': 'famagusta',
              'Paralimni': 'famagusta',
              'Ayia Napa': 'famagusta',
              'Protaras': 'famagusta',
              'Deryneia': 'famagusta',
              'Sotira': 'famagusta',
              
              // Kyrenia et ses variations
              'Kyrenia': 'kyrenia',
              'Girne': 'kyrenia',
              'Κερύνεια': 'kyrenia'
            };

            // Chercher la zone en vérifiant toutes les clés
            for (const [cityName, zone] of Object.entries(zoneMapping)) {
              if (city.toLowerCase().includes(cityName.toLowerCase()) || 
                  place.formatted_address.toLowerCase().includes(cityName.toLowerCase())) {
                detectedZone = zone;
                break;
              }
            }

            // Si pas de zone détectée, utiliser l'adresse complète
            if (!detectedZone) {
              const fullAddress = place.formatted_address.toLowerCase();
              for (const [cityName, zone] of Object.entries(zoneMapping)) {
                if (fullAddress.includes(cityName.toLowerCase())) {
                  detectedZone = zone;
                  break;
                }
              }
            }

            // Mise à jour des champs du formulaire
            form.setValue('full_address', place.formatted_address);
            form.setValue('city', city);
            form.setValue('gps_latitude', lat);
            form.setValue('gps_longitude', lng);
            
            // Définir la zone géographique si détectée
            if (detectedZone) {
              form.setValue('cyprus_zone', detectedZone);
              console.log('✅ Zone détectée automatiquement:', detectedZone);
              toast.success(`Zone géographique détectée : ${detectedZone}`);
            } else {
              console.log('⚠️ Zone non détectée pour la ville:', city);
              toast.warning('Zone géographique non détectée, veuillez la sélectionner manuellement');
            }
          }
        });
      }
    }
  }, [currentStep, form]);

  // Enhanced amenities detection function
  const detectAmenities = async () => {
    const address = form.watch('full_address');
    if (!address) {
      toast("Adresse requise - Veuillez d'abord entrer une adresse", {
        description: "Erreur de validation"
      });
      return;
    }

    setIsDetecting(true);
    try {
      console.log('📡 Appel de googleMapsAgent.findNearbyPlaces...');
      const places = await googleMapsAgent.findNearbyPlaces(address, 2);
      console.log('📦 Résultat:', places);

      if (!places || places.length === 0) {
        toast("Aucune commodité trouvée", {
          description: "Vérifiez l'adresse ou la configuration Google Maps API"
        });
        return;
      }

      // Map results to amenities
      const detectedAmenities = places.map(place => ({
        nearby_amenity_id: place.type,
        distance_km: place.distance_km,
        details: `${place.name}${place.rating ? ` (${place.rating}⭐)` : ''}`
      }));

      // Merge with existing amenities
      const existing = form.watch('surrounding_amenities') || [];
      const merged = [...existing];
      
      detectedAmenities.forEach(newItem => {
        if (!merged.find(m => m.nearby_amenity_id === newItem.nearby_amenity_id)) {
          merged.push(newItem);
        }
      });

      form.setValue('surrounding_amenities', merged);

      // Auto-fill strategic distances if available
      const seaPlace = places.find(p => p.type === 'beach' || p.name.toLowerCase().includes('beach'));
      if (seaPlace && !form.watch('proximity_sea_km')) {
        form.setValue('proximity_sea_km', seaPlace.distance_km);
      }

      toast("✅ Détection terminée", {
        description: `${places.length} commodités trouvées et ajoutées`,
        duration: 5000,
      });
      
    } catch (error) {
      console.error('❌ Erreur détection:', error);
      toast("Erreur de détection", {
        description: error?.message || "Vérifiez la console pour plus de détails"
      });
    } finally {
      setIsDetecting(false);
    }
  };

  // Mapping complet des types Google Maps vers les types de la base de données
  const GOOGLE_TO_DB_TYPE_MAPPING: Record<string, string> = {
    // Transport
    'transit_station': 'transport_public',
    'bus_station': 'transport_public',
    'train_station': 'transport_public',
    'subway_station': 'transport_public',
    'airport': 'airport',
    
    // Santé
    'hospital': 'hospital',
    'pharmacy': 'pharmacy',
    'doctor': 'pharmacy',
    'dentist': 'dentist',
    'veterinary_care': 'veterinary_care',
    'physiotherapist': 'physiotherapist',
    
    // Éducation
    'school': 'school',
    'primary_school': 'school',
    'secondary_school': 'school',
    'university': 'university',
    
    // Shopping
    'supermarket': 'supermarket',
    'shopping_mall': 'shopping_center',
    'grocery_or_supermarket': 'supermarket',
    'convenience_store': 'supermarket',
    'bakery': 'bakery',
    
    // Finance
    'bank': 'bank',
    'atm': 'atm',
    'post_office': 'post_office',
    
    // Restauration
    'restaurant': 'restaurant',
    'cafe': 'cafe',
    'bar': 'bar',
    'night_club': 'night_club',
    
    // Loisirs
    'gym': 'gym',
    'spa': 'spa',
    'movie_theater': 'cinema',
    'park': 'park',
    'beach': 'beach',
    
    // Religion
    'church': 'church',
    
    // Services
    'parking': 'parking',
    'gas_station': 'gas_station',
    'police': 'police',
    'fire_station': 'fire_station',
    'city_hall': 'city_hall',
    
    // Culture
    'museum': 'museum',
    'art_gallery': 'art_gallery',
    'library': 'library',
    'tourist_attraction': 'tourist_attraction',
    
    // Hébergement
    'lodging': 'hotel',
    'hotel': 'hotel'
  };

  const handleDetectAll = async () => {
    const address = form.watch('full_address') || '';
    
    if (!address) {
      toast.error('Veuillez entrer une adresse');
      return;
    }

    setIsDetecting(true);
    
    try {
      console.log('🚀 Début de la détection automatique');
      console.log('📍 Adresse:', address);
      console.log('🚀 Détection avec rayon:', detectionRadius, 'km');
      
      const { data: result, error } = await supabase.functions.invoke('google-maps-agent', {
        body: {
          action: 'findNearbyPlaces',
          params: {
            address: address,
            radius: detectionRadius
          }
        }
      });

      if (error) throw error;
      
      if (result && result.places) {
        console.log(`✅ ${result.places.length} lieux trouvés par Google Maps`);
        
        if (result.location) {
          form.setValue('gps_latitude', result.location.lat);
          form.setValue('gps_longitude', result.location.lng);
          console.log('🌍 Coordonnées GPS:', result.location);
        }
        
        const commoditiesMap = new Map<string, any>();
        
        result.places.forEach((place: any) => {
          const dbType = GOOGLE_TO_DB_TYPE_MAPPING[place.type];
          
          if (dbType) {
            const existing = commoditiesMap.get(dbType);
            if (!existing || place.distance_km < existing.distance) {
              commoditiesMap.set(dbType, {
                nearby_amenity_id: dbType,
                distance_km: place.distance_km,
                details: place.name,
                lat: place.lat,
                lng: place.lng
              });
            }
          }
        });
        
        const nearbyAmenities = Array.from(commoditiesMap.values());
        
        form.setValue('surrounding_amenities', nearbyAmenities);
        
        // Pré-sélectionner les commodités essentielles
        const preSelected = new Set(
          nearbyAmenities
            .filter(a => ESSENTIAL_AMENITIES.includes(a.nearby_amenity_id))
            .map(a => a.nearby_amenity_id)
        );
        setSelectedAmenities(preSelected);

        console.log(`📍 ${nearbyAmenities.length} types de commodités uniques détectés`);
        console.log(`✅ ${preSelected.size} commodités pré-sélectionnées pour affichage`);
        
        if (result.strategicDistances) {
          const distances = {
            nearest_beach: result.strategicDistances.nearest_beach || 0,
            larnaca_airport_distance: result.strategicDistances.larnaca_airport_distance || 
                                       result.strategicDistances.airport_distance || 0,
            paphos_airport_distance: result.strategicDistances.paphos_airport_distance || 0,
            city_center_distance: result.strategicDistances.city_center_distance || 0,
            highway_distance: result.strategicDistances.highway_distance || 0,
            airport_distance: result.strategicDistances.airport_distance || 0
          };
          
          if (distances.nearest_beach) form.setValue('proximity_sea_km', distances.nearest_beach);
          if (distances.airport_distance) form.setValue('proximity_airport_km', distances.airport_distance);
          if (distances.city_center_distance) form.setValue('proximity_city_center_km', distances.city_center_distance);
          if (distances.highway_distance) form.setValue('proximity_highway_km', distances.highway_distance);
          
          console.log('📏 Distances stratégiques:');
          console.log('- Plage:', distances.nearest_beach, 'km');
          console.log('- Aéroport Larnaca:', distances.larnaca_airport_distance, 'km');
          console.log('- Aéroport Paphos:', distances.paphos_airport_distance, 'km');
          console.log('- Centre-ville:', distances.city_center_distance, 'km');
          console.log('- Autoroute:', distances.highway_distance, 'km');
          
          toast.success(
            `✅ Détection complète! ${nearbyAmenities.length} types de commodités trouvés`
          );
        } else {
          console.warn('⚠️ Distances stratégiques non disponibles');
          toast.warning('Détection partielle - Distances stratégiques non disponibles');
        }
        
      } else {
        console.error('❌ Aucun résultat de l\'API');
        toast.error('Aucun lieu trouvé à proximité');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la détection:', error);
      toast.error('Erreur lors de la détection automatique');
    } finally {
      setIsDetecting(false);
      console.log('🏁 Détection terminée');
    }
  };

  // Initialiser les commodités sélectionnées (essentielles par défaut)
  useEffect(() => {
    const amenities = form.watch('surrounding_amenities') || [];
    const selected = new Set(
      amenities
        .filter(a => ESSENTIAL_AMENITIES.includes(a.nearby_amenity_id || ''))
        .map(a => a.nearby_amenity_id)
    );
    setSelectedAmenities(selected);
  }, [form.watch('surrounding_amenities')]);

  // UTILISATION DU NOUVEAU COMPOSANT LocationSection AU LIEU DU CODE COMPLET
  const renderLocationStep = () => {
    return <LocationSection form={form} />;
  };

  // UTILISATION DU NOUVEAU COMPOSANT SpecificationsSection AU LIEU DU CODE COMPLET
  const renderSpecificationsStep = () => {
    return <SpecificationsSection form={form} />;
  };

  const renderPricingStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Prix et investissement</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix à partir de (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="300000"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value) || 0);
                          // Détection automatique Golden Visa
                          const price = parseFloat(e.target.value);
                          if (price >= 300000) {
                            form.setValue('golden_visa_eligible', true);
                            toast("✨ Éligible Golden Visa", {
                              description: "Ce projet est automatiquement éligible au Golden Visa (≥300,000€)",
                              duration: 3000,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix jusqu'à</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="800000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Indicateur Golden Visa */}
            {form.watch('golden_visa_eligible') && (
              <div className="col-span-full">
                <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Star className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900">Projet éligible Golden Visa</p>
                    <p className="text-sm text-amber-700">
                      Prix minimum de 300,000€ atteint pour l'obtention du visa doré
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="golden_visa_eligible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Éligible Golden Visa</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Automatiquement activé si prix ≥ 300,000€
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="financing_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Financement disponible</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Possibilité de crédit bancaire
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMediaStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Photos du projet</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Vérification de sécurité */}
            {(() => {
              const photos = form.watch('photos');
              console.log('📸 Current photos state:', photos);
              
              // S'assurer que photos est un objet valide
              if (!photos || typeof photos !== 'object') {
                form.setValue('photos', []);
              }
              
              return null;
            })()}
            
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CategorizedMediaUploader
                      field={{
                        value: (field.value as any) || [],
                        onChange: field.onChange
                      }}
                      bucketName="projects"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Contenu Multimédia</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="youtube_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Youtube className="w-4 h-4" />
                    Vidéo YouTube
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vr_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Visite VR 360°
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vimeo_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Vidéo Vimeo
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://vimeo.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Documents du Projet</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="master_plan_pdf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Plan de masse (PDF)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brochure_pdf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Brochure (PDF)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_list_pdf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Grille tarifaire (PDF)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technical_specs_pdf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Spécifications techniques (PDF)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Modèles 3D et Plans</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="model_3d_urls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Liens modèles 3D
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Séparez par des virgules: https://..."
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ar_experience_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Expérience AR
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaverse_preview_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Aperçu Metaverse
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  // UTILISATION DU NOUVEAU COMPOSANT MarketingSection AU LIEU DU CODE COMPLET
  const renderMarketingStep = () => {
    return <MarketingSection form={form} />;
  };

  const renderSummaryStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Résumé du projet</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Informations générales</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Nom:</span> {form.watch('title')}</div>
                  <div><span className="font-medium">Code:</span> {form.watch('project_code')}</div>
                  <div><span className="font-medium">Développeur:</span> {developers?.find(d => d.id === form.watch('developer_id'))?.name}</div>
                  <div><span className="font-medium">Phase:</span> {form.watch('project_phase')}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Localisation</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Zone:</span> {form.watch('cyprus_zone')}</div>
                  <div><span className="font-medium">Ville:</span> {form.watch('city')}</div>
                  <div><span className="font-medium">Adresse:</span> {form.watch('full_address')}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Prix</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">À partir de:</span> €{form.watch('price_from')?.toLocaleString()}</div>
                  <div><span className="font-medium">Jusqu'à:</span> €{form.watch('price_to')?.toLocaleString()}</div>
                  <div><span className="font-medium">Golden Visa:</span> {form.watch('golden_visa_eligible') ? 'Oui' : 'Non'}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Commodités</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Mer/Plage:</span> {form.watch('proximity_sea_km')} km</div>
                  <div><span className="font-medium">Aéroport:</span> {form.watch('proximity_airport_km')} km</div>
                  <div><span className="font-medium">Commodités détectées:</span> {form.watch('surrounding_amenities')?.length || 0}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render step based on currentStep
  switch (currentStep) {
    case 'basics':
      return renderBasicsStep();
    case 'buildings':
      return renderBuildingsStep();
    case 'location':
      return renderLocationStep();
    case 'amenities':
      return renderAmenitiesStep();
    case 'specifications':
      return renderSpecificationsStep();
    case 'pricing':
      return renderPricingStep();
    case 'media':
      return renderMediaStep();
    case 'marketing':
      return renderMarketingStep();
    case 'summary':
      return renderSummaryStep();
    default:
      return renderBasicsStep();
  }
};
