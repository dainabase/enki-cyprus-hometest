import { UseFormReturn } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/projectSchema';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ProjectEquipmentsStepProps {
  form: UseFormReturn<ProjectFormData>;
}

export function ProjectEquipmentsStep({ form }: ProjectEquipmentsStepProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Équipements principaux</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="has_pool"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Piscine</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_gym"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Salle de sport</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_spa"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Spa</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_playground"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Aire de jeux</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_garden"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Jardin</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_security_system"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Système de sécurité</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_cctv"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Vidéosurveillance</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_concierge"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Conciergerie</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_parking"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Parking</FormLabel>
                </FormItem>
              )}
            />
          </div>

          {form.watch('has_parking') && (
            <FormField
              control={form.control}
              name="parking_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de parking</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="underground">Souterrain</SelectItem>
                      <SelectItem value="outdoor">Extérieur</SelectItem>
                      <SelectItem value="covered">Couvert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
