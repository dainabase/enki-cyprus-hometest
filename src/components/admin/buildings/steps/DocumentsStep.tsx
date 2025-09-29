import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SimpleImageUploader from '@/components/admin/common/SimpleImageUploader';
import { FileText, Image, Building2, Link } from 'lucide-react';

interface DocumentsStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-500" />
          Documents & Photos
        </h2>
        <p className="text-slate-500 mt-2">
          Plans, documents et photos du bâtiment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan d'étage type */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="typical_floor_plan_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    Plan d'étage type
                  </FormLabel>
                  <FormDescription>
                    Plan architectural type d'un étage (URL)
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      className="h-12"
                      placeholder="https://exemple.com/plan-etage.pdf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Modèle 3D / Visite virtuelle */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="model_3d_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Link className="h-4 w-4 text-blue-500" />
                    Modèle 3D / Visite virtuelle
                  </FormLabel>
                  <FormDescription>
                    Lien vers un modèle 3D ou une visite virtuelle
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      className="h-12"
                      placeholder="https://exemple.com/visite-3d"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Brochure du bâtiment */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="building_brochure_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Brochure du bâtiment
                  </FormLabel>
                  <FormDescription>
                    Lien vers la brochure commerciale du bâtiment (URL)
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      className="h-12"
                      placeholder="https://exemple.com/brochure.pdf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Photos du bâtiment */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <FormLabel className="flex items-center gap-2 text-base font-semibold">
                  <Image className="h-4 w-4 text-green-500" />
                  Photos du bâtiment
                </FormLabel>
                <FormDescription className="mt-2">
                  Téléchargez des photos du bâtiment (extérieur, hall, espaces communs...)
                </FormDescription>
              </div>
              
              <SimpleImageUploader
                bucket="building-photos"
                entityId="building-new"
                onUploadComplete={(urls) => {
                  console.log('Photos du bâtiment uploadées:', urls);
                  // Les URLs peuvent être stockées dans un champ dédié si nécessaire
                }}
                maxFiles={10}
                existingImages={[]}
              />
              
              <p className="text-xs text-slate-500">
                Formats acceptés: JPG, PNG, WEBP • Taille max: 5MB par fichier • Maximum 10 fichiers
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};