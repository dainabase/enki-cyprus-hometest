import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface FinancialStepProps {
  form: UseFormReturn<any>;
}

export const FinancialStep: React.FC<FinancialStepProps> = ({ form }) => {
  const watchPrice = form.watch('price');
  const goldenVisaEligible = watchPrice >= 300000;

  React.useEffect(() => {
    if (watchPrice) {
      form.setValue('golden_visa_eligible', goldenVisaEligible);
      form.setValue('price_per_m2', watchPrice / (form.getValues('internal_area_m2') || 1));
    }
  }, [watchPrice, form, goldenVisaEligible]);

  return (
    <div className="space-y-8">
      
      {/* Prix principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Prix et valorisation</CardTitle>
          <CardDescription>Prix de vente et calculs financiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de vente (€) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      step="1000"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      className="text-lg font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_per_m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix au m² (€/m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="10"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      disabled
                      className="bg-gray-50"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">Calculé automatiquement</p>
                </FormItem>
              )}
            />
          </div>

          {/* Golden Visa */}
          <FormField
            control={form.control}
            name="golden_visa_eligible"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                <div>
                  <FormLabel className="font-medium text-yellow-800">Éligible Golden Visa</FormLabel>
                  <p className="text-sm text-yellow-600">
                    {goldenVisaEligible ? "✅ Éligible (≥ 300 000€)" : "❌ Non éligible (< 300 000€)"}
                  </p>
                </div>
                <FormControl>
                  <Switch 
                    checked={field.value || goldenVisaEligible} 
                    onCheckedChange={field.onChange}
                    disabled
                  />
                </FormControl>
              </FormItem>
            )}
          />

        </CardContent>
      </Card>

      {/* Paiement et financement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Conditions de paiement</CardTitle>
          <CardDescription>Acompte, financement et frais associés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="down_payment_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acompte requis (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      step="5"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reservation_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frais de réservation (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="100"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Financement disponible */}
          <FormField
            control={form.control}
            name="financing_available"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <FormLabel className="font-medium">Financement disponible</FormLabel>
                  <p className="text-sm text-muted-foreground">Possibilité de crédit bancaire</p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

        </CardContent>
      </Card>

      {/* Charges et frais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Charges et frais mensuels</CardTitle>
          <CardDescription>Coûts récurrents pour le propriétaire</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="common_expenses_monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charges communes (€/mois)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="10"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="management_fee_monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frais de gestion (€/mois)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="10"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </CardContent>
      </Card>

    </div>
  );
};