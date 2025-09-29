import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Link } from 'lucide-react';

interface DocumentsStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-500" />
          Documents
        </h2>
        <p className="text-slate-500 mt-2">
          URLs des documents et modèles liés au bâtiment
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="typical_floor_plan_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Link className="h-4 w-4 text-blue-500" />
                    URL Plan d'étage type
                  </FormLabel>
                  <FormDescription>
                    Lien vers le plan d'étage type du bâtiment (PDF, image, etc.)
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com/floor-plan.pdf"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="model_3d_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Link className="h-4 w-4 text-blue-500" />
                    URL Modèle 3D
                  </FormLabel>
                  <FormDescription>
                    Lien vers le modèle 3D ou visite virtuelle du bâtiment
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com/model-3d.obj"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="building_brochure_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Link className="h-4 w-4 text-blue-500" />
                    URL Brochure du bâtiment
                  </FormLabel>
                  <FormDescription>
                    Lien vers la brochure commerciale ou technique du bâtiment
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com/brochure.pdf"
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
    </div>
  );
};