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
  Croissant, Flame, Camera, Hotel, Shirt, Scissors, ChevronRight, ChevronDown, Eye, EyeOff
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
    'shopping_center',  // 6. Centre commercial (NOUVEAU)
    'university',       // 7. Université (NOUVEAU)
    'beach',           // 8. Plage
    'bank',            // 9. Banque
    'restaurant',      // 10. Restaurant
    'gym',             // 11. Salle de sport
    'cafe'             // 12. Café (NOUVEAU)
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
        {/* CARTE: Prestations internes du projet */}
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
  };

  // Google Places Autocomplete initialization
  useEffect(() => {
    if (currentStep === 'location' && window.google) {
      const input = document.getElementById('address-autocomplete');
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input as HTMLInputElement, {
          types: ['address'],
          componentRestrictions: { country: 'cy' }, // Cyprus only
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
            addressComponents.forEach(component => {
              if (component.types.includes('locality')) {
                city = component.long_name;
  };
              if (component.types.includes('postal_code')) {
                postalCode = component.long_name;
              }
            });

            // Map city to geographical zone
            const zoneMap = {
              'Limassol': 'limassol',
              'Paphos': 'paphos',
              'Larnaca': 'larnaca',
              'Nicosia': 'nicosia',
              'Famagusta': 'famagusta',
              'Kyrenia': 'kyrenia'
            };

            const detectedZone = Object.keys(zoneMap).find(zone => 
              city.toLowerCase().includes(zone.toLowerCase())
            );

            // Update form fields
            form.setValue('full_address', place.formatted_address);
            form.setValue('city', city);
            form.setValue('gps_latitude', lat);
            form.setValue('gps_longitude', lng);
            if (detectedZone) {
              form.setValue('cyprus_zone', zoneMap[detectedZone]);
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

  // 🚨 AUDIT FUNCTION WITH COMPLETE FRAUD DETECTION
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
      console.log('🚀 Détection avec rayon:', detectionRadius, 'km'); // IMPORTANT
      
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
        
        const GOOGLE_TO_DB_TYPE_MAPPING: Record<string, string> = {
          'transit_station': 'transport_public',
          'bus_station': 'transport_public',
          'train_station': 'transport_public',
          'subway_station': 'transport_public',
          'airport': 'airport',
          'hospital': 'hospital',
          'pharmacy': 'pharmacy',
          'doctor': 'pharmacy',
          'dentist': 'dentist',
          'veterinary_care': 'veterinary_care',
          'physiotherapist': 'physiotherapist',
          'school': 'school',
          'primary_school': 'school',
          'secondary_school': 'school',
          'university': 'university',
          'supermarket': 'supermarket',
          'shopping_mall': 'shopping_center',
          'grocery_or_supermarket': 'supermarket',
          'convenience_store': 'supermarket',
          'bakery': 'bakery',
          'bank': 'bank',
          'atm': 'atm',
          'post_office': 'post_office',
          'restaurant': 'restaurant',
          'cafe': 'cafe',
          'bar': 'bar',
          'night_club': 'night_club',
          'gym': 'gym',
          'spa': 'spa',
          'beauty_salon': 'spa',
          'movie_theater': 'cinema',
          'park': 'park',
          'church': 'church',
          'parking': 'parking',
          'gas_station': 'gas_station',
          'police': 'police',
          'fire_station': 'fire_station',
          'city_hall': 'city_hall',
          'courthouse': 'city_hall',
          'embassy': 'city_hall',
          'museum': 'museum',
          'art_gallery': 'art_gallery',
          'library': 'library',
          'tourist_attraction': 'tourist_attraction',
          'lodging': 'hotel',
          'hotel': 'hotel',
          'laundry': 'laundry',
          'hair_care': 'hair_salon'
        };
        
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
        console.log('Commodités:', nearbyAmenities);
        
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
          
          console.log('📏 Distances stratégiques mises à jour:', result.strategicDistances);
          
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

  // Render the restructured location step
  const renderLocationStep = () => {
    // Liste complète des commodités disponibles
    const commoditiesList = [
      { id: 'transport_public', label: 'Transport public' },
      { id: 'beach', label: 'Plage' },
      { id: 'hospital', label: 'Hôpital' },
      { id: 'pharmacy', label: 'Pharmacie' },
      { id: 'school', label: 'École' },
      { id: 'university', label: 'Université' },
      { id: 'supermarket', label: 'Supermarché' },
      { id: 'shopping_center', label: 'Centre commercial' },
      { id: 'restaurant', label: 'Restaurant' },
      { id: 'cafe', label: 'Café' },
      { id: 'bank', label: 'Banque' },
      { id: 'atm', label: 'ATM' },
      { id: 'post_office', label: 'Bureau de poste' },
      { id: 'park', label: 'Parc' },
      { id: 'gym', label: 'Salle de sport' },
      { id: 'spa', label: 'Spa' },
      { id: 'cinema', label: 'Cinéma' },
      { id: 'parking', label: 'Parking' },
      { id: 'gas_station', label: 'Station essence' },
      { id: 'church', label: 'Église' },
      { id: 'airport', label: 'Aéroport' },
      { id: 'train_station', label: 'Gare' },
      { id: 'bus_station', label: 'Arrêt de bus' },
      { id: 'dentist', label: 'Dentiste' },
      { id: 'veterinary_care', label: 'Vétérinaire' },
      { id: 'physiotherapist', label: 'Kinésithérapeute' },
      { id: 'bakery', label: 'Boulangerie' },
      { id: 'bar', label: 'Bar' },
      { id: 'night_club', label: 'Discothèque' },
      { id: 'police', label: 'Police' },
      { id: 'fire_station', label: 'Pompiers' },
      { id: 'city_hall', label: 'Mairie' },
      { id: 'museum', label: 'Musée' },
      { id: 'art_gallery', label: 'Galerie d\'art' },
      { id: 'library', label: 'Bibliothèque' },
      { id: 'tourist_attraction', label: 'Attraction touristique' },
      { id: 'hotel', label: 'Hôtel' },
      { id: 'laundry', label: 'Laverie' },
      { id: 'hair_salon', label: 'Salon de coiffure' }
    ];

    const COMMODITY_ICONS: { [key: string]: string } = {
      hospital: '🏥',
      pharmacy: '💊',
      school: '🎓',
      university: '🎓',
      supermarket: '🛒',
      restaurant: '🍽️',
      bank: '🏦',
      atm: '🏧',
      bus_station: '🚌',
      gym: '💪',
      park: '🌳',
      cafe: '☕'
    };

    const handleCommodityChange = (commodityId: string, checked: boolean) => {
      const existing = form.watch('surrounding_amenities') || [];
      if (checked) {
        if (!existing.find(a => a.nearby_amenity_id === commodityId)) {
          form.setValue('surrounding_amenities', [
            ...existing,
            { nearby_amenity_id: commodityId, distance_km: 0, details: '' }
          ]);
        }
      } else {
        form.setValue('surrounding_amenities', 
          existing.filter(a => a.nearby_amenity_id !== commodityId)
        );
      }
    };


    return (
      <div className="space-y-8">
        {/* CARTE 1: Localisation */}
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Localisation
            </CardTitle>
            <CardDescription>
              Adresse et coordonnées du projet
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Adresse avec autocomplétion */}
            <FormField
              control={form.control}
              name="full_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse complète *</FormLabel>
                  <FormControl>
                    <Input 
                      id="address-autocomplete"
                      placeholder="Commencez à taper une adresse à Chypre..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    L'autocomplétion Google Places vous aidera à sélectionner l'adresse exacte
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Zone géographique */}
              <FormField
                control={form.control}
                name="cyprus_zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone géographique</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-50">
                          <SelectValue placeholder="Auto-détectée depuis l'adresse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="limassol">Limassol</SelectItem>
                        <SelectItem value="nicosia">Nicosie</SelectItem>
                        <SelectItem value="paphos">Paphos</SelectItem>
                        <SelectItem value="larnaca">Larnaca</SelectItem>
                        <SelectItem value="famagusta">Famagouste</SelectItem>
                        <SelectItem value="kyrenia">Kyrenia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Détectée automatiquement depuis l'adresse
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ville */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Auto-remplie"
                        {...field}
                        className="bg-gray-50"
                        readOnly
                      />
                    </FormControl>
                    <FormDescription>
                      Extraite automatiquement de l'adresse
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Coordonnées GPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gps_latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude GPS</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="34.6851" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-gray-50"
                        readOnly
                      />
                    </FormControl>
                    <FormDescription>
                      Calculée automatiquement depuis l'adresse
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gps_longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude GPS</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="33.0280" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-gray-50"
                        readOnly
                      />
                    </FormControl>
                    <FormDescription>
                      Calculée automatiquement depuis l'adresse
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* CARTE 2: Distances & Commodités - STRUCTURE CORRIGÉE */}
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Distances & Commodités
                </CardTitle>
                <CardDescription>
                  Distances stratégiques et commodités de proximité
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={handleDetectAll}
                disabled={!form.watch('full_address') || isDetecting}
                variant="outline"
                size="sm"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Détection...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Détecter
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 relative">
            {/* Overlay de chargement */}
            {isDetecting && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-sm font-medium">Analyse en cours...</p>
                  <p className="text-xs text-gray-500 mt-1">10-15 secondes</p>
                </div>
              </div>
            )}

            {/* Sélecteur de rayon de détection - VERSION BOUTONS */}
            <div className="space-y-2 mb-4">
              <Label className="text-sm font-medium">Rayon de détection</Label>
              <div className="flex gap-2">
                {[0.5, 1, 2, 3, 5].map((radius) => (
                  <Button
                    key={radius}
                    type="button"
                    size="sm"
                    variant={detectionRadius === radius ? "default" : "outline"}
                    onClick={() => setDetectionRadius(radius)}
                    className="flex-1"
                  >
                    {radius < 1 ? `${radius * 1000}m` : `${radius}km`}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Recherche dans un rayon de {detectionRadius} km autour de l'adresse
              </p>
            </div>

            {/* GRILLE PRINCIPALE CORRIGÉE */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* COLONNE GAUCHE : Contrôles (3/5) */}
              <div className="lg:col-span-3 space-y-6">
{/* Distances stratégiques avec 2 aéroports */}
<div className="space-y-2">
  <Label className="text-base font-semibold">Distances stratégiques</Label>
  
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-2">
        <Waves className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-semibold">Mer / Plage</span>
      </div>
      <p className="text-2xl font-bold text-blue-900">
        {form.watch('proximity_sea_km') || '—'} km
      </p>
      {form.watch('proximity_sea_km') && form.watch('proximity_sea_km') > 1 && (
        <p className="text-xs text-blue-700 mt-1">
          🚗 ~{Math.round(form.watch('proximity_sea_km') * 2)} min voiture
        </p>
      )}
    </div>
    
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="h-5 w-5 text-green-600" />
        <span className="text-sm font-semibold">Centre-ville</span>
      </div>
      <p className="text-2xl font-bold text-green-900">
        {form.watch('proximity_city_center_km') || '—'} km
      </p>
      {form.watch('proximity_city_center_km') > 0 && (
        <p className="text-xs text-green-700 mt-1">
          🚗 ~{Math.round(form.watch('proximity_city_center_km') * 2.5)} min voiture
        </p>
      )}
    </div>
    
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
      <div className="flex items-center gap-2 mb-2">
        <Car className="h-5 w-5 text-purple-600" />
        <span className="text-sm font-semibold">Autoroute</span>
      </div>
      <p className="text-2xl font-bold text-purple-900">
        {form.watch('proximity_highway_km') || '—'} km
      </p>
      {form.watch('proximity_highway_km') > 0 && (
        <p className="text-xs text-purple-700 mt-1">
          🚗 ~{Math.round(form.watch('proximity_highway_km') * 2)} min voiture
        </p>
      )}
    </div>
    
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
      <div className="flex items-center gap-2 mb-2">
        <Plane className="h-5 w-5 text-orange-600" />
        <span className="text-sm font-semibold">Aéroport Larnaca</span>
      </div>
      <p className="text-2xl font-bold text-orange-900">
        {(() => {
          const dist = form.watch('proximity_airport_km');
          if (dist) return dist;
          const lat = form.watch('gps_latitude');
          const lng = form.watch('gps_longitude');
          if (lat && lng) {
            const larnaca = { lat: 34.8751, lng: 33.6248 };
            const R = 6371;
            const dLat = (larnaca.lat - lat) * Math.PI / 180;
            const dLon = (larnaca.lng - lng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat * Math.PI / 180) * Math.cos(larnaca.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return Math.round(R * c * 10) / 10;
          }
          return '—';
        })()} km
      </p>
      <p className="text-xs text-orange-700 mt-1">
        🚗 ~{Math.round((form.watch('proximity_airport_km') || 67) * 1.2)} min voiture
      </p>
    </div>
    
    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
      <div className="flex items-center gap-2 mb-2">
        <Plane className="h-5 w-5 text-pink-600" />
        <span className="text-sm font-semibold">Aéroport Paphos</span>
      </div>
      <p className="text-2xl font-bold text-pink-900">
        {(() => {
          const lat = form.watch('gps_latitude');
          const lng = form.watch('gps_longitude');
          if (lat && lng) {
            const paphos = { lat: 34.7180, lng: 32.4857 };
            const R = 6371;
            const dLat = (paphos.lat - lat) * Math.PI / 180;
            const dLon = (paphos.lng - lng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat * Math.PI / 180) * Math.cos(paphos.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return Math.round(R * c * 10) / 10;
          }
          return '—';
        })()} km
      </p>
      <p className="text-xs text-pink-700 mt-1">
        🚗 ~{Math.round(55 * 1.2)} min voiture
      </p>
    </div>
  </div>
</div>

{/* Commodités de proximité - VERSION AVEC CHECKBOXES FONCTIONNELS */}
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <Label className="text-base font-semibold">Commodités de proximité</Label>
    <Button 
      type="button" 
      onClick={() => {
        console.log('🧪 BOUTON TEST - État actuel:', Array.from(selectedAmenities));
        const newSet = new Set(['school', 'hospital']);
        setSelectedAmenities(newSet);
        console.log('🧪 BOUTON TEST - Nouvel état:', Array.from(newSet));
      }}
      variant="outline" 
      size="sm"
    >
      🧪 Test Checkboxes
    </Button>
    {form.watch('surrounding_amenities')?.length > 0 && (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {selectedAmenities.size} / {form.watch('surrounding_amenities')?.length} sélectionnées pour affichage
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const amenities = form.watch('surrounding_amenities') || [];
            if (selectedAmenities.size === amenities.length) {
              // Tout désélectionner
              setSelectedAmenities(new Set());
              form.setValue('surrounding_amenities', amenities.map(a => ({
                ...a,
                selected: false
              })));
            } else {
              // Tout sélectionner
              const allTypes = new Set(amenities.map(a => a.nearby_amenity_id));
              setSelectedAmenities(allTypes);
              form.setValue('surrounding_amenities', amenities.map(a => ({
                ...a,
                selected: true
              })));
            }
          }}
        >
          {selectedAmenities.size === form.watch('surrounding_amenities')?.length 
            ? 'Tout désélectionner' 
            : 'Tout sélectionner'}
        </Button>
      </div>
    )}
  </div>
  
  {form.watch('surrounding_amenities')?.length > 0 ? (
    <div className="space-y-4">
      {/* Section 1 : Commodités ESSENTIELLES */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Star className="h-4 w-4" />
          Commodités essentielles (critères d'achat principaux)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {form.watch('surrounding_amenities')
            ?.filter(a => ESSENTIAL_AMENITIES.includes(a.nearby_amenity_id))
            ?.sort((a, b) => a.distance_km - b.distance_km)
            ?.map((amenity, idx) => {
              const option = amenityOptions.find(opt => opt.value === amenity.nearby_amenity_id);
              if (!option) return null;
              
              const isSelected = selectedAmenities.has(amenity.nearby_amenity_id || '');
              const getTimeLabel = (dist) => {
                if (dist <= 0.5) return '⚡ 5 min à pied';
                if (dist <= 1) return '👟 10 min à pied';
                if (dist <= 2) return '🚶 20 min à pied';
                return `🚗 ${Math.round(dist * 2.5)} min voiture`;
              };
              
              return (
                <div 
                  key={`ess-${amenity.nearby_amenity_id}-${idx}`} 
                  className={`bg-white rounded-lg p-3 border transition-all ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        console.log(`🔄 CLICK! ${amenity.nearby_amenity_id}: ${e.target.checked}`);
                        
                        // MÉTHODE SIMPLE : Toggle direct dans le state
                        const currentSelected = selectedAmenities;
                        const newSelected = new Set(currentSelected);
                        
                        if (e.target.checked) {
                          newSelected.add(amenity.nearby_amenity_id || '');
                          console.log('✅ AJOUTÉ:', amenity.nearby_amenity_id);
                        } else {
                          newSelected.delete(amenity.nearby_amenity_id || '');
                          console.log('❌ SUPPRIMÉ:', amenity.nearby_amenity_id);
                        }
                        
                        setSelectedAmenities(newSelected);
                        console.log('📊 TOTAL SÉLECTIONS:', newSelected.size);
                      }}
                      className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">{option.icon}</span>
                        <span className="font-medium text-sm">{option.label}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-bold">{amenity.distance_km} km</span>
                        <span className="text-xs text-gray-600">{getTimeLabel(amenity.distance_km)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      
      {/* Section 2 : Autres commodités AVEC CHECKBOXES FONCTIONNELS */}
      {form.watch('surrounding_amenities')?.filter(a => !ESSENTIAL_AMENITIES.includes(a.nearby_amenity_id)).length > 0 && (
        <div className="bg-gray-50 rounded-lg border">
          <details open>
            <summary className="p-4 cursor-pointer font-semibold text-sm text-gray-700 hover:bg-gray-100">
              <span className="inline-flex items-center gap-2">
                <ChevronDown className="h-4 w-4" />
                Autres commodités ({form.watch('surrounding_amenities')?.filter(a => !ESSENTIAL_AMENITIES.includes(a.nearby_amenity_id)).length})
                <span className="text-xs font-normal text-gray-500 ml-2">
                  Cliquez les cases pour sélectionner celles à afficher
                </span>
              </span>
            </summary>
            <div className="p-4 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {form.watch('surrounding_amenities')
                  ?.filter(a => !ESSENTIAL_AMENITIES.includes(a.nearby_amenity_id))
                  ?.sort((a, b) => a.distance_km - b.distance_km)
                  ?.map((amenity, idx) => {
                    const option = amenityOptions.find(opt => opt.value === amenity.nearby_amenity_id);
                    if (!option) return null;
                    
                    const isSelected = selectedAmenities.has(amenity.nearby_amenity_id || '');
                    
                    return (
                      <div 
                        key={`other-${amenity.nearby_amenity_id}-${idx}`} 
                        className={`bg-white rounded-lg p-3 border transition-all cursor-pointer hover:shadow-md ${
                          isSelected ? 'ring-2 ring-gray-500 bg-gray-50' : ''
                        }`}
                        onClick={() => {
                          console.log(`🎯 Card cliquée pour ${amenity.nearby_amenity_id}`);
                          const newSelected = new Set(selectedAmenities);
                          if (isSelected) {
                            newSelected.delete(amenity.nearby_amenity_id || '');
                          } else {
                            newSelected.add(amenity.nearby_amenity_id || '');
                          }
                          setSelectedAmenities(newSelected);
                          console.log(`✅ Nouvelles sélections:`, Array.from(newSelected));
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              console.log(`📝 Input checkbox pour ${amenity.nearby_amenity_id}: ${e.target.checked}`);
                              const newSelected = new Set(selectedAmenities);
                              if (e.target.checked) {
                                newSelected.add(amenity.nearby_amenity_id || '');
                              } else {
                                newSelected.delete(amenity.nearby_amenity_id || '');
                              }
                              setSelectedAmenities(newSelected);
                              console.log(`✅ Input nouvelles sélections:`, Array.from(newSelected));
                            }}
                            className="h-4 w-4 text-gray-600 rounded border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-gray-600">{option.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{option.label}</p>
                            <p className="text-xs text-gray-500">{amenity.distance_km} km</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </details>
        </div>
      )}
      
      {/* Note d'information */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-xs text-amber-800">
          <strong>💡 Info :</strong> Cliquez sur les cases ou les cartes pour sélectionner les commodités qui apparaîtront sur le site public. 
          Les commodités essentielles sont pré-sélectionnées par défaut.
        </p>
      </div>
    </div>
  ) : (
    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <MapPin className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">Aucune commodité détectée</p>
    </div>
  )}
</div>
              </div>

              {/* COLONNE DROITE : Carte (2/5) */}
              <div className="lg:col-span-2">
                <div className="sticky top-4">
                  <h4 className="font-medium text-sm mb-3">Visualisation sur carte</h4>
                  {(() => {
                    const lat = form.watch('gps_latitude');
                    const lng = form.watch('gps_longitude');
                    
                    const latNum = typeof lat === 'number' ? lat : parseFloat(lat as string);
                    const lngNum = typeof lng === 'number' ? lng : parseFloat(lng as string);
                    const hasValidCoords = !isNaN(latNum) && !isNaN(lngNum) && latNum !== 0 && lngNum !== 0;
                    
                    if (hasValidCoords) {
                      return (
                        <LocationMap
                          center={{ lat: latNum, lng: lngNum }}
                          markers={mapCommodities.map(c => ({
                            position: { lat: c.lat, lng: c.lng },
                            title: c.name
                          }))}
                          radius={detectionRadius}
                        />
                      );
                    } else {
                      return (
                        <div className="h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Entrez une adresse pour afficher la carte</p>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSpecificationsStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Spécifications générales</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="land_area_m2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surface terrain (m²)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="2500"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="built_area_m2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surface construite (m²)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="1800"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parking_spaces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Places de parking</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
              name="model_3d_urls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    Modèles 3D
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

  const renderMarketingStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Marketing & SEO</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Bouton générateur SEO */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-slate-700" />
                      Générateur de contenu SEO
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Générez automatiquement les métadonnées optimisées par l'IA
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={async () => {
                       // État de chargement
                       const loadingToastId = toast("⚙️ Génération en cours...", {
                         description: "L'IA analyse votre projet (15-30 secondes)",
                         duration: 30000,
                       });
                       
                       try {
                         const projectData = form.getValues();
                         
                         // Validation minimale
                         if (!projectData.title || !projectData.description) {
                           toast("❌ Données manquantes", {
                             description: "Veuillez remplir le titre et la description du projet"
                           });
                           return;
                         }
                         
                         // Appel API simulé (remplacer par votre Edge Function)
                         await new Promise(resolve => setTimeout(resolve, 3000));
                         
                         // Génération du contenu SEO avancé
                         const seoTitle = `${projectData.title} | Immobilier ${projectData.city || 'Chypre'} - Investissement Golden Visa Cyprus ${new Date().getFullYear()}`;
                         
                         const seoDescription = `🏆 ${projectData.title} : Projet immobilier premium à ${projectData.city || 'Chypre'}, ${projectData.cyprus_zone || 'zone prime'}. ✅ ${projectData.total_units || 'Plusieurs'} unités disponibles à partir de ${projectData.price_from ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(projectData.price_from) : 'prix attractif'}. ${projectData.golden_visa_eligible ? '🌟 Éligible Golden Visa (Résidence permanente UE).' : ''} ROI estimé ${projectData.roi_estimate_percent || 8}%/an. Livraison ${projectData.completion_month || '2026'}. ${projectData.proximity_sea_km ? `🏖️ À seulement ${projectData.proximity_sea_km}km de la mer.` : ''} Contactez-nous pour une visite privée.`;
                         
                         const seoKeywords = [
                           // Mots-clés principaux
                           'immobilier chypre',
                           'investissement chypre',
                           'golden visa cyprus',
                           'residence permit cyprus',
                           'propriété chypre',
                           // Mots-clés locaux
                           projectData.city?.toLowerCase(),
                           projectData.cyprus_zone,
                           projectData.neighborhood?.toLowerCase(),
                           // Mots-clés spécifiques
                           `appartement ${projectData.city?.toLowerCase() || 'chypre'}`,
                           'achat immobilier chypre',
                           'programme neuf chypre',
                           // Mots-clés développeur
                           projectData.developer_id,
                           // Année
                           `immobilier chypre ${new Date().getFullYear()}`,
                           // Type de propriété
                           ...(projectData.property_sub_type || [])
                         ].filter(Boolean);
                         
                         const seoSlug = projectData.title
                           .toLowerCase()
                           .normalize('NFD')
                           .replace(/[\u0300-\u036f]/g, '') // Enlever accents
                           .replace(/[^a-z0-9]+/g, '-')
                           .replace(/^-+|-+$/g, '')
                           .substring(0, 60); // Limite longueur
                         
                         // Mise à jour des champs
                         form.setValue('meta_title', seoTitle);
                         form.setValue('meta_description', seoDescription);
                         form.setValue('meta_keywords', seoKeywords);
                         form.setValue('url_slug', seoSlug);
                         
                         // Afficher le résultat
                         toast("✅ Contenu SEO généré avec succès !", {
                           description: "Vérifiez et ajustez si nécessaire les textes générés",
                           duration: 5000,
                         });
                         
                         // Scroll vers les champs SEO pour les voir
                         const seoSection = document.querySelector('[name="meta_title"]');
                         if (seoSection) {
                           seoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                         }
                         
                       } catch (error) {
                         console.error('Erreur génération SEO:', error);
                         toast("❌ Erreur de génération", {
                           description: "Impossible de générer le contenu SEO"
                         });
                       } finally {
                         // Fermer le toast de chargement
                         // Note: sonner toast doesn't have dismiss method, just let it auto-dismiss
                       }
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Générer le SEO
                  </Button>
                </div>
              </CardContent>
            </Card>
            <FormField
              control={form.control}
              name="meta_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre SEO</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre optimisé pour les moteurs de recherche (60 caractères max)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description SEO</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description pour les moteurs de recherche (160 caractères max)"
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
              name="meta_keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mots-clés SEO</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Séparez par des virgules: immobilier, chypre, investissement..."
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
              name="marketing_highlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points Marketing</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Séparez par des virgules: Vue mer, Golden Visa, Près plage..."
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
              name="target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience Cible</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Séparez par des virgules: Investisseurs, Retraités, Familles..."
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
              name="url_slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="marina-towers-limassol"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="featured_project"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Projet en vedette</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Afficher en priorité
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
                name="construction_phase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase de construction</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planifiée</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="completion">Finition</SelectItem>
                        <SelectItem value="finished">Terminée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Main switch based on current step
  return (() => {
    switch (currentStep) {
      case 'basics':
        return renderBasicsStep();
      case 'location':
        return renderLocationStep();
      case 'specifications':
        return renderSpecificationsStep();
      case 'pricing':
        return renderPricingStep();
      case 'media':
        return renderMediaStep();
      case 'buildings':
        return renderBuildingsStep();
      case 'amenities':
        return renderAmenitiesStep();
      case 'marketing':
        return renderMarketingStep();
      default:
        return renderBasicsStep();
    }
  })();
};
