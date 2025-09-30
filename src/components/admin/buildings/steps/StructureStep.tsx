import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Calendar, Zap, ArrowUp } from 'lucide-react';

interface StructureStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const StructureStep: React.FC<StructureStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      {/* Titre de l'étape */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Layers className="h-6 w-6 text-blue-500" />
          Structure du bâtiment
        </h2>
        <p className="text-slate-500 mt-2">
          Informations structurelles et construction
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre d'étages */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="total_floors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Layers className="h-4 w-4 text-blue-500" />
                    Nombre d'étages
                  </FormLabel>
                  <FormDescription>
                    Total des étages du bâtiment
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseInt(field.value as any) || 0;
                          field.onChange(Math.max(1, current - 1));
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-lg font-semibold transition-colors"
                      >
                        −
                      </button>
                      <Input
                        {...field}
                        type="number"
                        min="1"
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

        {/* Total d'unités */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="total_units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Total d'unités
                  </FormLabel>
                  <FormDescription>
                    Nombre total d'unités dans le bâtiment
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
                        placeholder="20"
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

        {/* Unités disponibles */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="units_available"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Unités disponibles
                  </FormLabel>
                  <FormDescription>
                    Nombre d'unités actuellement disponibles
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

        {/* Statut de construction - ✅ CORRIGÉ AVEC LES BONNES VALEURS */}
        <Card className="border-2 border-orange-100">
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="construction_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    Statut de construction
                  </FormLabel>
                  <FormDescription>
                    État actuel de la construction
                  </FormDescription>
                  <FormControl>
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>Planifié</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="under_construction">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>En construction</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="completed">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Terminé</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ready_to_move">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Prêt à emménager</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Date de livraison prévue */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="expected_completion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Date de livraison prévue
                  </FormLabel>
                  <FormDescription>
                    Date estimée de fin des travaux
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="h-12"
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Date de livraison réelle */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="actual_completion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Date de livraison réelle
                  </FormLabel>
                  <FormDescription>
                    Date effective de fin des travaux
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="h-12"
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Certificat énergétique */}
        <Card className="border-2 border-green-100">
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="energy_certificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Zap className="h-4 w-4 text-green-500" />
                    Certificat énergétique
                  </FormLabel>
                  <FormDescription>
                    Classe énergétique du bâtiment
                  </FormDescription>
                  <FormControl>
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sélectionner une classe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-green-700 text-white text-xs font-bold rounded">A+</div>
                            <span>Très performant</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="A">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">A</div>
                            <span>Performant</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="B">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">B</div>
                            <span>Bon</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="C">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">C</div>
                            <span>Moyen</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="D">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">D</div>
                            <span>Passable</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="E">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">E</div>
                            <span>Médiocre</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="F">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">F</div>
                            <span>Mauvais</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="G">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-red-700 text-white text-xs font-bold rounded">G</div>
                            <span>Très mauvais</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Nombre d'ascenseurs */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="elevator_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <ArrowUp className="h-4 w-4 text-slate-500" />
                    Nombre d'ascenseurs
                  </FormLabel>
                  <FormDescription>
                    Sélectionnez le nombre d'ascenseurs dans le bâtiment
                  </FormDescription>
                  <FormControl>
                    <Select 
                      value={String(field.value || '0')} 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Aucun ascenseur</SelectItem>
                        <SelectItem value="1">1 ascenseur</SelectItem>
                        <SelectItem value="2">2 ascenseurs</SelectItem>
                        <SelectItem value="3">3 ascenseurs</SelectItem>
                        <SelectItem value="4">4 ascenseurs</SelectItem>
                        <SelectItem value="5">5 ascenseurs</SelectItem>
                        <SelectItem value="6">6 ascenseurs</SelectItem>
                        <SelectItem value="7">7 ascenseurs</SelectItem>
                        <SelectItem value="8">8 ascenseurs</SelectItem>
                        <SelectItem value="9">9 ascenseurs</SelectItem>
                        <SelectItem value="10">10 ascenseurs ou plus</SelectItem>
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
  );
};
