import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { Building2, Ruler, Calendar, Shield, Zap, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SpecificationsSectionProps {
  form: UseFormReturn<any>;
}

export const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      {/* Dimensions et capacité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Dimensions et capacité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="land_area_m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface terrain (m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="2500"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="built_area_m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface construite (m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="1800"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
                  <FormLabel>Unités totales</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="24"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
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
                      placeholder="12"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floors_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre d'étages</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="5"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parking_spaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Places de parking</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="50"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Construction et certification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Construction et certification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="construction_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Année de construction
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="2025"
                      min="1900"
                      max="2050"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Année de construction du projet
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energy_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Classe énergétique
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la classe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A+">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">A+</Badge>
                          <span>Très haute performance</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="A">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">A</Badge>
                          <span>Haute performance</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="B">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-lime-500">B</Badge>
                          <span>Bonne performance</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="C">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500">C</Badge>
                          <span>Performance moyenne</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="D">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-500">D</Badge>
                          <span>Performance faible</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="E">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-600">E</Badge>
                          <span>Performance très faible</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="F">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-500">F</Badge>
                          <span>Performance insuffisante</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="G">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-600">G</Badge>
                          <span>Très mauvaise performance</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Classification énergétique européenne
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="building_certification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification bâtiment</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: LEED Gold, BREEAM"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Certifications environnementales ou qualité
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="design_style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style architectural</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Moderne, Méditerranéen"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professionnels du projet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Professionnels du projet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="architect_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'architecte</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Jean Dupont"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="architect_license_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° licence architecte</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: CY-12345"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="builder_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise de construction</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Cyprus Construction Ltd"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seismic_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classification sismique</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Zone 2"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Résistance aux tremblements de terre
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Frais et charges */}
      <Card>
        <CardHeader>
          <CardTitle>Frais et charges annuels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="maintenance_fees_yearly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frais de maintenance (€/an)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="1200"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_tax_yearly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxe foncière (€/an)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="800"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hoa_fees_monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charges copropriété (€/mois)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="150"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Politiques et équipements */}
      <Card>
        <CardHeader>
          <CardTitle>Politiques et équipements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="pet_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Politique animaux</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="allowed">Autorisés</SelectItem>
                      <SelectItem value="restricted">Avec restrictions</SelectItem>
                      <SelectItem value="forbidden">Interdits</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smoking_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Politique fumeurs</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="allowed">Autorisé</SelectItem>
                      <SelectItem value="restricted">Zones dédiées</SelectItem>
                      <SelectItem value="forbidden">Interdit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internet_speed_mbps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Wifi className="w-4 w-4" />
                    Vitesse Internet (Mbps)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Fibre optique disponible
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Niveau de finition */}
      <Card>
        <CardHeader>
          <CardTitle>Niveau de finition</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="finishing_level"
            render={({ field }) => (
              <FormItem>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le niveau de finition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basic">
                      <div>
                        <div className="font-medium">Basique</div>
                        <div className="text-sm text-muted-foreground">Finitions standards, matériaux économiques</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="standard">
                      <div>
                        <div className="font-medium">Standard</div>
                        <div className="text-sm text-muted-foreground">Finitions de qualité, matériaux durables</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="premium">
                      <div>
                        <div className="font-medium">Premium</div>
                        <div className="text-sm text-muted-foreground">Finitions haut de gamme, matériaux nobles</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="luxury">
                      <div>
                        <div className="font-medium">Luxe</div>
                        <div className="text-sm text-muted-foreground">Finitions exceptionnelles, matériaux de prestige</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
