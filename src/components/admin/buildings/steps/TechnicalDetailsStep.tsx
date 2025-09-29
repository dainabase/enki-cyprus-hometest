import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Thermometer, Wind, Calendar, Home, Package, Wrench } from 'lucide-react';

interface TechnicalDetailsStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const TechnicalDetailsStep: React.FC<TechnicalDetailsStepProps> = ({ form }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="space-y-6">
      {/* Titre de l'étape */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Thermometer className="h-6 w-6 text-blue-500" />
          Détails Techniques & Locaux Annexes
        </h2>
        <p className="text-slate-500 mt-2">
          Systèmes techniques et espaces de stockage
        </p>
      </div>

      {/* Section Systèmes techniques */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-slate-600" />
          Systèmes techniques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type de chauffage */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="type_chauffage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      Type de chauffage
                    </FormLabel>
                    <FormDescription>
                      Système de chauffage du bâtiment
                    </FormDescription>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collectif_gaz">Collectif gaz</SelectItem>
                          <SelectItem value="collectif_fioul">Collectif fioul</SelectItem>
                          <SelectItem value="individuel_gaz">Individuel gaz</SelectItem>
                          <SelectItem value="individuel_electrique">Individuel électrique</SelectItem>
                          <SelectItem value="pompe_chaleur">Pompe à chaleur</SelectItem>
                          <SelectItem value="pompe_chaleur_reversible">Pompe à chaleur réversible</SelectItem>
                          <SelectItem value="geothermie">Géothermie</SelectItem>
                          <SelectItem value="chauffage_sol">Chauffage au sol</SelectItem>
                          <SelectItem value="mixte">Système mixte</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Type de climatisation */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="type_climatisation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Wind className="h-4 w-4 text-blue-500" />
                      Type de climatisation
                    </FormLabel>
                    <FormDescription>
                      Système de refroidissement
                    </FormDescription>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="central">Climatisation centrale</SelectItem>
                          <SelectItem value="split">Split individuel</SelectItem>
                          <SelectItem value="multi_split">Multi-split</SelectItem>
                          <SelectItem value="gainable">Gainable</SelectItem>
                          <SelectItem value="vrf">VRF/VRV</SelectItem>
                          <SelectItem value="pre_installation">Pré-installation</SelectItem>
                          <SelectItem value="reversible">Réversible (chaud/froid)</SelectItem>
                          <SelectItem value="aucune">Aucune</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Année de construction */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="annee_construction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Année de construction
                    </FormLabel>
                    <FormDescription>
                      Pour les bâtiments existants
                    </FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1900"
                        max={currentYear}
                        className="h-12"
                        placeholder={String(currentYear)}
                        value={field.value || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : parseInt(val) || undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Année de rénovation */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="annee_renovation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Année de rénovation
                    </FormLabel>
                    <FormDescription>
                      Dernière rénovation majeure
                    </FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1900"
                        max={currentYear}
                        className="h-12"
                        placeholder={String(currentYear - 1)}
                        value={field.value || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : parseInt(val) || undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Norme de construction */}
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="norme_construction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Home className="h-4 w-4 text-green-500" />
                      Norme de construction
                    </FormLabel>
                    <FormDescription>
                      Standards et certifications du bâtiment
                    </FormDescription>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Sélectionnez la norme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rt2012">RT 2012</SelectItem>
                          <SelectItem value="re2020">RE 2020</SelectItem>
                          <SelectItem value="bbc">BBC (Bâtiment Basse Consommation)</SelectItem>
                          <SelectItem value="hqe">HQE (Haute Qualité Environnementale)</SelectItem>
                          <SelectItem value="bepos">BEPOS (Bâtiment à Énergie Positive)</SelectItem>
                          <SelectItem value="passivhaus">Passivhaus</SelectItem>
                          <SelectItem value="leed">LEED</SelectItem>
                          <SelectItem value="breeam">BREEAM</SelectItem>
                          <SelectItem value="standard">Standard local</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section Locaux Annexes */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-purple-500" />
          Locaux annexes et stockage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre de caves */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="nombre_caves"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Nombre de caves
                    </FormLabel>
                    <FormDescription>
                      Total des caves dans le bâtiment
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
                          placeholder="15"
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

          {/* Surface moyenne des caves */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="surface_caves"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Surface moyenne des caves
                    </FormLabel>
                    <FormDescription>
                      En mètres carrés
                    </FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.5"
                        className="h-12"
                        placeholder="5"
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

          {/* Nombre de box fermés */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="nombre_box_fermes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Nombre de box fermés
                    </FormLabel>
                    <FormDescription>
                      Garages ou boxes individuels
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
                          placeholder="10"
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

          {/* Nombre de lots */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="nombre_lots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Nombre total de lots
                    </FormLabel>
                    <FormDescription>
                      Pour la copropriété
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
                          placeholder="50"
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

          {/* Local vélos */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="local_velos"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-slate-50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold cursor-pointer">
                        Local vélos
                      </FormLabel>
                      <FormDescription>
                        Espace dédié au stockage des vélos
                      </FormDescription>
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
            </CardContent>
          </Card>

          {/* Local poussettes */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="local_poussettes"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-slate-50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold cursor-pointer">
                        Local poussettes
                      </FormLabel>
                      <FormDescription>
                        Espace pour les poussettes et équipements bébé
                      </FormDescription>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
