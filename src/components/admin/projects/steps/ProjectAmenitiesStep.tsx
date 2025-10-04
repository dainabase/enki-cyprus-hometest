import { UseFormReturn } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/projectSchema';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectAmenitiesStepProps {
  form: UseFormReturn<ProjectFormData>;
}

export function ProjectAmenitiesStep({ form }: ProjectAmenitiesStepProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Équipements de base</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="has_pool"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
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
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
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
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
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
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
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
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Jardin</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_parking"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
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
                    <FormLabel className="text-sm">Type de parking</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
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
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Sécurité</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="has_security_system"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
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
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">CCTV</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_concierge"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Conciergerie</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_security_24_7"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Sécurité 24/7</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Infrastructure</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="has_generator"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Générateur</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_solar_panels"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Panneaux solaires</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Loisirs & Sports</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="has_tennis_court"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Court de tennis</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sports_facilities"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Installations sportives</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="golf_course"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Golf</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wellness_center"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Centre bien-être</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Services & Commerces</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="club_house"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Club house</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="restaurant"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Restaurant</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cafe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Café</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mini_market"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Mini-marché</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_center"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Centre d'affaires</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coworking_space"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Espace coworking</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Accès & Transports</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="beach_access"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Accès plage</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marina_access"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Accès marina</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shuttle_service"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Navette</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kids_club"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Club enfants</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
