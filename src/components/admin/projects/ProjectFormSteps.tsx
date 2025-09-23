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
    'beach', 'supermarket', 'pharmacy', 'school', 'hospital', 'airport',
    'transport_public', 'restaurant', 'shopping_center', 'bank', 'gym', 'park'
  ];

  const amenityOptions = [
    { id: 'transport_public', label: 'Transport public', icon: Bus },
    { id: 'beach', label: 'Plage', icon: Waves },
    { id: 'hospital', label: 'Hôpital', icon: Stethoscope },
    { id: 'pharmacy', label: 'Pharmacie', icon: Plus },
    { id: 'school', label: 'École', icon: School },
    { id: 'university', label: 'Université', icon: GraduationCap },
    { id: 'supermarket', label: 'Supermarché', icon: ShoppingCart },
    { id: 'shopping_center', label: 'Centre commercial', icon: Store },
    { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
    { id: 'cafe', label: 'Café', icon: Coffee },
    { id: 'bank', label: 'Banque', icon: CreditCard },
    { id: 'gym', label: 'Salle de sport', icon: Dumbbell },
    { id: 'park', label: 'Parc', icon: Trees },
    { id: 'airport', label: 'Aéroport', icon: Plane },
    { id: 'marina', label: 'Marina', icon: Anchor },
    { id: 'gas_station', label: 'Station-service', icon: Fuel },
    { id: 'post_office', label: 'Bureau de poste', icon: Mail },
    { id: 'police', label: 'Police', icon: Shield },
    { id: 'fire_station', label: 'Caserne de pompiers', icon: Flame },
    { id: 'library', label: 'Bibliothèque', icon: Library },
    { id: 'cinema', label: 'Cinéma', icon: Film },
    { id: 'theater', label: 'Théâtre', icon: Drama },
    { id: 'museum', label: 'Musée', icon: Landmark },
    { id: 'zoo', label: 'Zoo', icon: PawPrint },
    { id: 'spa', label: 'Spa', icon: Smile },
    { id: 'nightclub', label: 'Boîte de nuit', icon: Music },
    { id: 'church', label: 'Église', icon: Church }
  ];

  // Préparer les données pour la carte avec les commodités environnantes
  const mapCommodities = useMemo(() => {
    const surroundingAmenities = form.watch('surrounding_amenities') || [];
    return surroundingAmenities
      .filter(amenity => amenity.distance_km)
      .map(amenity => ({
        id: amenity.nearby_amenity_id || '',
        lat: 0, // Will be updated when we have proper GPS data
        lng: 0, // Will be updated when we have proper GPS data
        name: amenity.nearby_amenity_id || '',
        type: amenity.nearby_amenity_id || ''
      }));
  }, [form.watch('surrounding_amenities')]);

  // Developers will be handled by parent component

  // Fonctions render (placeholders - remplacez par votre logique existante)
  const renderBasicsStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Informations de base</CardTitle>
            <CardDescription>
              Détails essentiels du projet immobilier
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du projet *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Marina Bay Residences" {...field} />
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
                    <FormLabel>Code projet</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: MBR-2024" {...field} />
                    </FormControl>
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

  const renderLocationStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Localisation
            </CardTitle>
            <CardDescription>
              Informations géographiques du projet
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* COLONNE GAUCHE : Formulaires (3/5) */}
              <div className="lg:col-span-3 space-y-6">
                <FormField
                  control={form.control}
                  name="full_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse complète *</FormLabel>
                      <FormControl>
                        <Input 
                          id="address-autocomplete"
                          placeholder="Tapez une adresse..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="land_area_m2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surface terrain (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 5000" {...field} />
                    </FormControl>
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

  const renderPricingStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Informations de prix</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix minimum (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 150000" 
                        value={field.value || ''} 
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
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

  const renderMediaStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Médias du projet</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p>Gestion des médias (photos, vidéos, documents)</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBuildingsStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Bâtiments du projet</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p>Gestion des bâtiments</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAmenitiesStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Équipements communs</CardTitle>
            <CardDescription>
              Équipements et services disponibles à l'intérieur du projet (piscines, espaces verts, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <AmenitiesSelector 
              selectedAmenities={form.watch('amenities') || []}
              onChange={(amenities) => form.setValue('amenities', amenities)}
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
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="og_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre SEO</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre optimisé pour les moteurs de recherche" {...field} />
                    </FormControl>
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
};