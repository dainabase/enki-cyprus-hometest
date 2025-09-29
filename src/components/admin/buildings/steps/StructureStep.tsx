import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      className="h-12"
                      placeholder="5"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
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
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      className="h-12"
                      placeholder="20"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
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
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      className="h-12"
                      placeholder="15"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Statut de construction */}
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>Planification</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="approved">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Approuvé</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="construction">
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
                        <SelectItem value="delivered">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Livré</span>
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
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
                    Nombre total d'ascenseurs dans le bâtiment
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      className="h-12"
                      placeholder="2"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Ascenseur */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="has_elevator"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-slate-50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">
                      Ascenseur disponible
                    </FormLabel>
                    <FormDescription>
                      Le bâtiment dispose-t-il d'un ascenseur ?
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
  );
};