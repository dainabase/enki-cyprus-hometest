import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp, Euro, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CommercializationStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const CommercializationStep: React.FC<CommercializationStepProps> = ({ form }) => {
  const tauxOccupation = form.watch('taux_occupation') || 0;
  
  return (
    <div className="space-y-6">
      {/* Titre de l'étape */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-500" />
          Commercialisation
        </h2>
        <p className="text-slate-500 mt-2">
          Informations sur les prix et l'état de commercialisation
        </p>
      </div>

      {/* Indicateur de taux d'occupation */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Taux d'occupation actuel</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{tauxOccupation}%</p>
            </div>
            <div className="flex gap-2">
              {tauxOccupation < 30 && <Badge className="bg-green-100 text-green-800">Forte disponibilité</Badge>}
              {tauxOccupation >= 30 && tauxOccupation < 70 && <Badge className="bg-yellow-100 text-yellow-800">Disponibilité moyenne</Badge>}
              {tauxOccupation >= 70 && <Badge className="bg-red-100 text-red-800">Peu de disponibilité</Badge>}
            </div>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-3 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${tauxOccupation}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prix moyen au m² */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="prix_moyen_m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Euro className="h-4 w-4 text-blue-500" />
                    Prix moyen au m²
                  </FormLabel>
                  <FormDescription>
                    Prix de vente moyen par mètre carré
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="100"
                      className="h-12"
                      placeholder="3500"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Fourchette de prix minimum */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="fourchette_prix_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Prix minimum
                  </FormLabel>
                  <FormDescription>
                    Prix le plus bas dans le bâtiment
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1000"
                      className="h-12"
                      placeholder="150000"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Fourchette de prix maximum */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="fourchette_prix_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Prix maximum
                  </FormLabel>
                  <FormDescription>
                    Prix le plus élevé dans le bâtiment
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1000"
                      className="h-12"
                      placeholder="750000"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Taux d'occupation */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="taux_occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Percent className="h-4 w-4 text-blue-500" />
                    Taux d'occupation (%)
                  </FormLabel>
                  <FormDescription>
                    Pourcentage vendu ou loué
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      max="100"
                      className="h-12"
                      placeholder="25"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Date de mise en vente */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="date_mise_en_vente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Date de mise en vente
                  </FormLabel>
                  <FormDescription>
                    Début de la commercialisation
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Répartition par type de logement */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Nombre de logements par type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['studios', 't2', 't3', 't4', 't5', 'penthouse', 'duplex'].map((type) => (
              <FormField
                key={type}
                control={form.control}
                name={`nombre_logements_type.${type}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm capitalize">{type}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="0"
                        className="h-10"
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          const currentTypes = form.getValues('nombre_logements_type') || {};
                          form.setValue('nombre_logements_type', {
                            ...currentTypes,
                            [type]: value
                          });
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration par étage */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configuration par étage (JSON)</h3>
          <FormField
            control={form.control}
            name="configuration_etages"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Exemple : {"{"}"rdc": {"{"}"studios": 3, "commerces": 2{"}"}, "etage_1": {"{"}"t2": 4{"}"}
                  {"}"}
                </FormDescription>
                <FormControl>
                  <textarea
                    value={JSON.stringify(field.value || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        field.onChange(parsed);
                      } catch (error) {
                        // Keep the text as is if not valid JSON
                      }
                    }}
                    className="w-full p-3 border rounded-lg font-mono text-sm"
                    rows={6}
                    placeholder={'{\n  "rdc": {\n    "studios": 0,\n    "commerces": 0\n  }\n}'}
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