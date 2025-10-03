import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Calculator, TrendingUp } from 'lucide-react';
import { PropertyFormData } from '@/schemas/property.schema';
import { formatPrice } from '@/lib/utils/formatters';

interface FinancialStepProps {
  form: UseFormReturn<PropertyFormData>;
  inheritedData?: {
    vat_rate?: number;
    commission_rate?: number;
  };
  calculations?: {
    vat_amount: number;
    price_including_vat: number;
    commission_amount: number;
    golden_visa_eligible: boolean;
  };
}

export const FinancialStep: React.FC<FinancialStepProps> = ({ form, inheritedData, calculations }) => {
  const priceExcludingVat = form.watch('price_excluding_vat') || 0;
  const vatRate = form.watch('vat_rate') || inheritedData?.vat_rate || 5;
  const commissionRate = form.watch('commission_rate') || inheritedData?.commission_rate || 5;
  const internalArea = form.watch('internal_area') || 1;
  const depositPercentage = form.watch('deposit_percentage') || 30;

  // Use calculations from parent or compute locally
  const vatAmount = calculations?.vat_amount || (priceExcludingVat * vatRate) / 100;
  const priceIncludingVat = calculations?.price_including_vat || priceExcludingVat + vatAmount;
  const commissionAmount = calculations?.commission_amount || (priceExcludingVat * commissionRate) / 100;
  const isGoldenVisa = calculations?.golden_visa_eligible || priceIncludingVat >= 300000;
  const pricePerSqm = priceExcludingVat / internalArea;
  const depositAmount = (priceExcludingVat * depositPercentage) / 100;

  return (
    <div className="space-y-8">
      {/* Alert Golden Visa */}
      {isGoldenVisa && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Crown className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Éligible Golden Visa</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Cette propriété est éligible au programme Golden Visa de Chypre (≥300,000€ TTC)
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground">Financier</CardTitle>
          <CardDescription className="text-muted-foreground">Prix, commissions et conditions financières</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Prix de base */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Prix de base
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price_excluding_vat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix HT *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        step="1000"
                        placeholder="300000"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                <FormDescription>Prix hors taxes en euros</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormField
                control={form.control}
                name="vat_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taux TVA *</FormLabel>
                    <Select onValueChange={value => field.onChange(parseFloat(value))} value={field.value?.toString() || "5"}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                  <SelectContent>
                    <SelectItem value="5">5% (Résidentiel)</SelectItem>
                    <SelectItem value="19">19% (Commercial)</SelectItem>
                    <SelectItem value="0">0% (Exemption)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Taux de TVA applicable</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Calculs automatiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 p-4 bg-white rounded border">
          <div className="text-center">
            <p className="text-sm text-gray-600">Montant TVA</p>
            <p className="font-semibold text-lg">{formatPrice(vatAmount)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Prix TTC</p>
            <p className="font-semibold text-lg text-primary">{formatPrice(priceIncludingVat)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Prix/m²</p>
            <p className="font-semibold text-lg">{formatPrice(pricePerSqm)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Commission</p>
            <p className="font-semibold text-lg text-green-600">{formatPrice(commissionAmount)}</p>
          </div>
        </div>
      </div>

      {/* Commissions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Commissions et frais
        </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="commission_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taux de commission (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        step="0.1"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                <FormDescription>Commission agence sur le prix HT</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormField
                control={form.control}
                name="original_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix original</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="1000"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                    <FormDescription>Prix initial si différent (pour calcul remise)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Conditions de paiement */}
          <div>
            <h3 className="font-semibold mb-4">Conditions de paiement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="deposit_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acompte (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        step="5"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                <FormDescription>
                  Montant: {formatPrice(depositAmount)}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                        step="500"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                <FormDescription>Montant de la réservation</FormDescription>
                <FormMessage />
              </FormItem>
              )}
            />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField
            control={form.control}
            name="payment_plan_available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Plan de paiement</FormLabel>
                  <FormDescription>
                    Paiement échelonné disponible
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finance_available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Financement</FormLabel>
                  <FormDescription>
                    Financement bancaire disponible
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
            </div>

            {form.watch('finance_available') && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="minimum_cash_required"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apport minimum requis</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          step="1000"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                        />
                      </FormControl>
                      <FormDescription>Montant minimum d'apport personnel</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Charges annuelles */}
          <div>
            <h3 className="font-semibold mb-4">Charges et taxes annuelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="annual_property_tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxe foncière annuelle</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="100"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormField
                control={form.control}
                name="communal_fees_monthly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Charges communes (mois)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="10"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormField
                control={form.control}
                name="maintenance_fee_monthly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frais d'entretien (mois)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="10"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};