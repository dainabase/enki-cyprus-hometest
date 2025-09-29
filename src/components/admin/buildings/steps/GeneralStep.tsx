import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Hash, Layers, Home } from 'lucide-react';

interface GeneralStepProps {
  form: UseFormReturn<BuildingFormData>;
  projects: any[];
}

export const GeneralStep: React.FC<GeneralStepProps> = ({ form, projects }) => {
  return (
    <div className="space-y-6">
      {/* Titre de l'étape */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Building2 className="h-6 w-6 text-blue-500" />
          Informations générales
        </h2>
        <p className="text-slate-500 mt-2">
          Définissez les informations de base du bâtiment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projet (OBLIGATOIRE) */}
        <Card className="border-2 border-blue-100">
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Home className="h-4 w-4 text-blue-500" />
                    Projet *
                  </FormLabel>
                  <FormDescription>
                    Sélectionnez le projet auquel appartient ce bâtiment
                  </FormDescription>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="Choisissez un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div>
                              <div className="font-medium">{project.title}</div>
                              <div className="text-xs text-slate-500">{project.cyprus_zone}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Nom du bâtiment */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="building_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    Nom du bâtiment *
                  </FormLabel>
                  <FormDescription>
                    Le nom ou l'identifiant unique du bâtiment
                  </FormDescription>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="h-12"
                      placeholder="Ex: Bâtiment A, Tour Nord, etc." 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Code du bâtiment */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="building_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Hash className="h-4 w-4 text-slate-500" />
                    Code du bâtiment
                  </FormLabel>
                  <FormDescription>
                    Code court pour identifier rapidement le bâtiment
                  </FormDescription>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="h-12"
                      placeholder="Ex: B-01, TN, etc." 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Ordre d'affichage */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Ordre d'affichage
                  </FormLabel>
                  <FormDescription>
                    Définit l'ordre d'apparition dans les listes
                  </FormDescription>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number"
                      className="h-12"
                      placeholder="0" 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Type de bâtiment */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="building_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Layers className="h-4 w-4 text-slate-500" />
                    Type de bâtiment
                  </FormLabel>
                  <FormDescription>
                    Catégorie principale du bâtiment
                  </FormDescription>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏠</span>
                            <span>Résidentiel</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="commercial">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏢</span>
                            <span>Commercial</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="mixed">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏗️</span>
                            <span>Mixte</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="office">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">💼</span>
                            <span>Bureau</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="hotel">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏨</span>
                            <span>Hôtel</span>
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

        {/* Classe du bâtiment */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="building_class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Classe du bâtiment
                  </FormLabel>
                  <FormDescription>
                    Niveau de standing et de qualité
                  </FormDescription>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">⭐⭐⭐</span>
                            <span>Classe A+ (Premium)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="A">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">⭐⭐</span>
                            <span>Classe A (Haut de gamme)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="B">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">⭐</span>
                            <span>Classe B (Standard)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="C">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">☆</span>
                            <span>Classe C (Économique)</span>
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
      </div>
    </div>
  );
};