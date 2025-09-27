import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, BuildingFormData } from '@/types/building';
import { cn } from '@/lib/utils';

const buildingSchema = z.object({
  building_name: z.string().min(1, 'Le nom du bâtiment est requis'),
  building_type: z.enum(['apartment_building', 'villa_complex', 'mixed_residence', 'residential']),
  building_code: z.string().optional(),
  total_floors: z.number().min(0).optional(),
  total_units: z.number().min(0).optional(),
  units_available: z.number().min(0).optional(),
  construction_status: z.enum(['planned', 'construction', 'delivered']),
  expected_completion: z.string().optional(),
  actual_completion: z.string().optional(),
  building_class: z.enum(['A+', 'A', 'B', 'C']).optional(),
  energy_certificate: z.string().optional(),
  elevator_count: z.number().min(0).optional(),
  has_generator: z.boolean().optional(),
  has_security_system: z.boolean().optional(),
  has_cctv: z.boolean().optional(),
  has_concierge: z.boolean().optional(),
  has_pool: z.boolean().optional(),
  has_gym: z.boolean().optional(),
  has_spa: z.boolean().optional(),
  has_playground: z.boolean().optional(),
  has_garden: z.boolean().optional(),
  has_parking: z.boolean().optional(),
  parking_type: z.enum(['underground', 'outdoor', 'covered']).optional(),
  display_order: z.number().min(0).optional(),
});

interface BuildingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  building?: Building | null;
  onSave: (data: BuildingFormData) => Promise<void>;
  isLoading?: boolean;
}

export function BuildingModal({ 
  open, 
  onOpenChange, 
  building, 
  onSave, 
  isLoading = false 
}: BuildingModalProps) {
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      building_name: '',
      building_type: 'apartment_building',
      construction_status: 'planned',
      total_floors: 1,
      total_units: 1,
      units_available: 1,
      elevator_count: 0,
      has_generator: false,
      has_security_system: false,
      has_cctv: false,
      has_concierge: false,
      has_pool: false,
      has_gym: false,
      has_spa: false,
      has_playground: false,
      has_garden: false,
      has_parking: true,
      display_order: 0,
    },
  });

  // Reset form when building changes or modal opens/closes
  useEffect(() => {
    if (building) {
      form.reset({
        building_name: building.building_name,
        building_type: building.building_type,
        building_code: building.building_code || '',
        total_floors: building.total_floors || 1,
        total_units: building.total_units || 1,
        units_available: building.units_available || 1,
        construction_status: building.construction_status,
        expected_completion: building.expected_completion || '',
        actual_completion: building.actual_completion || '',
        building_class: building.building_class,
        energy_certificate: building.energy_certificate || '',
        elevator_count: building.elevator_count || 0,
        has_generator: building.has_generator || false,
        has_security_system: building.has_security_system || false,
        has_cctv: building.has_cctv || false,
        has_concierge: building.has_concierge || false,
        has_pool: building.has_pool || false,
        has_gym: building.has_gym || false,
        has_spa: building.has_spa || false,
        has_playground: building.has_playground || false,
        has_garden: building.has_garden || false,
        has_parking: building.has_parking || true,
        parking_type: building.parking_type,
        display_order: building.display_order || 0,
      });
    } else {
      form.reset();
    }
  }, [building, open, form]);

  const onSubmit = async (data: BuildingFormData, e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSubmitLoading(true);
    try {
      await onSave(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving building:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {building ? 'Modifier le bâtiment' : 'Nouveau bâtiment'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit((data) => onSubmit(data, e))();
          }} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="building_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du bâtiment *</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: Bâtiment A, Villa Marina..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="building_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code bâtiment</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: A1, VIL-01..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="building_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de bâtiment *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment_building">Immeuble d'appartements</SelectItem>
                              <SelectItem value="villa_complex">Complexe de villas</SelectItem>
                              <SelectItem value="mixed_residence">Résidence mixte</SelectItem>
                              <SelectItem value="residential">Résidentiel</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="construction_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut construction *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planifié</SelectItem>
                              <SelectItem value="construction">En construction</SelectItem>
                              <SelectItem value="delivered">Livré</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Structure & Units */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Structure & Unités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="total_floors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre d'étages</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_units"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total unités</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="units_available"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unités disponibles</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="building_class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classe bâtiment</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="energy_certificate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificat énergétique</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: A+, B..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="elevator_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre d'ascenseurs</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Equipment & Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Équipements & Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">Sécurité & Technique</h4>
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="has_security_system"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm">Système de sécurité</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="has_cctv"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm">Vidéosurveillance</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="has_generator"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm">Générateur</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="has_concierge"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm">Concierge</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">Loisirs & Espaces</h4>
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="has_pool"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm">Piscine</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="has_gym"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm">Salle de sport</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="has_spa"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm">Spa</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="has_garden"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm">Jardin</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="has_playground"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm">Aire de jeux</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Parking */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="has_parking"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Parking disponible</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('has_parking') && (
                    <FormField
                      control={form.control}
                      name="parking_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de parking</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner le type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="underground">Souterrain</SelectItem>
                                <SelectItem value="outdoor">Extérieur</SelectItem>
                                <SelectItem value="covered">Couvert</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit((data) => onSubmit(data, e))();
                }}
                disabled={submitLoading || isLoading}
              >
                {submitLoading ? 'Sauvegarde...' : (building ? 'Modifier' : 'Créer')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}