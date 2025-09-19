import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyDBData } from '@/schemas/property-db.schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyFinancialStepProps {
  form: UseFormReturn<PropertyDBData>;
}

export const PropertyFinancialStep: React.FC<PropertyFinancialStepProps> = ({ form }) => {
  const price = form.watch('price') || 0;
  const vatRate = form.watch('vat_rate') || 5;
  const vatAmount = price * (vatRate / 100);
  const priceWithVat = price + vatAmount;
  const internalArea = form.watch('internal_area_m2') || 0;
  const pricePerM2 = internalArea > 0 ? price / internalArea : 0;
  const isGoldenVisa = priceWithVat >= 300000;

  return (
    <div className="space-y-8">
      
      {/* Golden Visa Alert */}
      {isGoldenVisa && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-yellow-800 text-sm">
              🏆 Cette propriété est éligible au Golden Visa (≥ 300 000€ TTC)
            </div>
          </div>
        </div>
      )}

      {/* Prix principal */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Prix de base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix (HT) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vat_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taux TVA (%)</FormLabel>
                <Select onValueChange={val => field.onChange(parseFloat(val))} value={field.value?.toString() || "5"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">0% (Exonéré)</SelectItem>
                    <SelectItem value="5">5% (Standard)</SelectItem>
                    <SelectItem value="19">19% (Majoré)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Calculs automatiques */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Calculs automatiques</h3>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span>TVA ({vatRate}%):</span>
            <span className="font-medium">{vatAmount.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="flex justify-between">
            <span>Prix TTC:</span>
            <span className="font-medium">{priceWithVat.toLocaleString('fr-FR')} €</span>
          </div>
          {internalArea > 0 && (
            <div className="flex justify-between">
              <span>Prix au m²:</span>
              <span className="font-medium">{pricePerM2.toLocaleString('fr-FR')} €/m²</span>
            </div>
          )}
        </div>
      </div>

      {/* Conditions de paiement */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Conditions de paiement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <FormField
            control={form.control}
            name="reservation_fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frais de réservation</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormDescription>Montant pour réserver le bien</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="down_payment_percent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acompte (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormDescription>Pourcentage d'acompte requis</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Options financières */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Options financières</h3>
        <div className="space-y-4">
          
          <FormField
            control={form.control}
            name="financing_available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Financement disponible</FormLabel>
                  <FormDescription>Le promoteur propose un financement</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bank_loan_eligible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Éligible prêt bancaire</FormLabel>
                  <FormDescription>Peut être financé par un prêt bancaire</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Offres spéciales */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Offres spéciales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <FormField
            control={form.control}
            name="special_offer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offre spéciale</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Promotion lancement" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remise (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};