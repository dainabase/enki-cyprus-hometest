import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Ruler, Compass, Eye, MapPin, Waves, Mountain, Trees, Building2, Flower, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface DimensionsOrientationStepProps {
  form: UseFormReturn<BuildingFormData>;
}

const vuesOptions = [
  { id: 'mer', label: 'Vue mer', icon: Waves },
  { id: 'montagne', label: 'Vue montagne', icon: Mountain },
  { id: 'parc', label: 'Vue parc', icon: Trees },
  { id: 'ville', label: 'Vue ville', icon: Building },
  { id: 'piscine', label: 'Vue piscine', icon: Waves },
  { id: 'jardin', label: 'Vue jardin', icon: Flower },
  { id: 'golf', label: 'Vue golf', icon: Trees },
  { id: 'marina', label: 'Vue marina', icon: Waves }
];

export const DimensionsOrientationStep: React.FC<DimensionsOrientationStepProps> = ({ form }) => {
  const surfaceTotale = form.watch('surface_totale_batiment') || 0;
  const hauteur = form.watch('hauteur_batiment') || 0;
  
  return (
    <div className="space-y-6">
      {/* Titre de l'étape */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Ruler className="h-6 w-6 text-blue-500" />
          Dimensions & Orientation
        </h2>
        <p className="text-slate-500 mt-2">
          Caractéristiques physiques et positionnement du bâtiment
        </p>
      </div>

      {/* Indicateurs visuels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Surface totale</p>
                <p className="text-2xl font-bold text-blue-900">{surfaceTotale} m²</p>
              </div>
              <Ruler className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Hauteur</p>
                <p className="text-2xl font-bold text-green-900">{hauteur} m</p>
              </div>
              <Ruler className="h-8 w-8 text-green-500 rotate-90" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Étages</p>
                <p className="text-2xl font-bold text-purple-900">{form.watch('total_floors') || 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Surface totale du bâtiment */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="surface_totale_batiment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Ruler className="h-4 w-4 text-blue-500" />
                    Surface totale du bâtiment
                  </FormLabel>
                  <FormDescription>
                    Surface construite totale en m²
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="10"
                      className="h-12"
                      placeholder="2500"
                      value={field.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? '' : parseFloat(val) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Hauteur du bâtiment */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="hauteur_batiment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Hauteur du bâtiment
                  </FormLabel>
                  <FormDescription>
                    Hauteur totale en mètres
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="0.5"
                      className="h-12"
                      placeholder="18.5"
                      value={field.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? '' : parseFloat(val) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Position dans le projet */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="position_dans_projet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Position dans le projet
                  </FormLabel>
                  <FormDescription>
                    Emplacement relatif dans le complexe
                  </FormDescription>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sélectionnez la position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entree">Entrée principale</SelectItem>
                        <SelectItem value="centre">Centre du projet</SelectItem>
                        <SelectItem value="fond">Fond du projet</SelectItem>
                        <SelectItem value="facade_mer">Façade mer</SelectItem>
                        <SelectItem value="facade_route">Façade route</SelectItem>
                        <SelectItem value="cote_jardin">Côté jardin</SelectItem>
                        <SelectItem value="cote_piscine">Côté piscine</SelectItem>
                        <SelectItem value="isole">Isolé/Indépendant</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Orientation principale */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="orientation_principale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Compass className="h-4 w-4 text-blue-500" />
                    Orientation principale
                  </FormLabel>
                  <FormDescription>
                    Direction de la façade principale
                  </FormDescription>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sélectionnez l'orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nord">Nord</SelectItem>
                        <SelectItem value="nord-est">Nord-Est</SelectItem>
                        <SelectItem value="est">Est</SelectItem>
                        <SelectItem value="sud-est">Sud-Est</SelectItem>
                        <SelectItem value="sud">Sud</SelectItem>
                        <SelectItem value="sud-ouest">Sud-Ouest</SelectItem>
                        <SelectItem value="ouest">Ouest</SelectItem>
                        <SelectItem value="nord-ouest">Nord-Ouest</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Nombre de places de parking */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="nombre_places_parking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Nombre total de places de parking
                  </FormLabel>
                  <FormDescription>
                    Toutes les places du bâtiment
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseInt(field.value as any) || 0;
                          field.onChange(Math.max(0, current - 1));
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-lg font-semibold transition-colors"
                      >
                        −
                      </button>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        className="h-12 text-center"
                        placeholder="30"
                        value={field.value || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? '' : parseInt(val) || 0);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseInt(field.value as any) || 0;
                          field.onChange(current + 1);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-lg font-semibold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Places visiteurs */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="parking_visiteurs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Places parking visiteurs
                  </FormLabel>
                  <FormDescription>
                    Places réservées aux visiteurs
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseInt(field.value as any) || 0;
                          field.onChange(Math.max(0, current - 1));
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-lg font-semibold transition-colors"
                      >
                        −
                      </button>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        className="h-12 text-center"
                        placeholder="5"
                        value={field.value || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? '' : parseInt(val) || 0);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseInt(field.value as any) || 0;
                          field.onChange(current + 1);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-lg font-semibold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Vues principales */}
      <Card>
        <CardContent className="p-6">
          <FormField
            control={form.control}
            name="vues_principales"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-base font-semibold mb-4">
                  <Eye className="h-4 w-4 text-blue-500" />
                  Vues principales
                </FormLabel>
                <FormDescription className="mb-4">
                  Sélectionnez toutes les vues disponibles depuis le bâtiment
                </FormDescription>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vuesOptions.map((vue) => {
                    const Icon = vue.icon;
                    return (
                      <div key={vue.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={vue.id}
                          checked={field.value?.includes(vue.id)}
                          onCheckedChange={(checked) => {
                            const currentVues = field.value || [];
                            if (checked) {
                              field.onChange([...currentVues, vue.id]);
                            } else {
                              field.onChange(currentVues.filter((v: string) => v !== vue.id));
                            }
                          }}
                        />
                        <label
                          htmlFor={vue.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                        >
                          <Icon className="h-4 w-4 text-slate-500" />
                          {vue.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
