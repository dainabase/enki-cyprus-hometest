import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, FileText, Globe, Lightbulb } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ToastProvider';
import { trackLexaiaCalculation } from '@/lib/analytics';

interface LexaiaResult {
  tax_saved: number;
  laws: string[];
  recommendations: string[];
  effective_rate: number;
  country_benefits: string[];
  scenarios?: string[];
}

interface LexaiaResponse {
  success: boolean;
  data: LexaiaResult;
  country: string;
  budget: number;
  source: 'api' | 'mock';
}

const countries = [
  { value: 'Chypre', label: 'Chypre 🇨🇾' },
  { value: 'Suisse', label: 'Suisse 🇨🇭' },
  { value: 'Portugal', label: 'Portugal 🇵🇹' },
  { value: 'Espagne', label: 'Espagne 🇪🇸' },
  { value: 'Malte', label: 'Malte 🇲🇹' },
  { value: 'Luxembourg', label: 'Luxembourg 🇱🇺' }
];

export function LexaiaCalculator() {
  const [formData, setFormData] = useState({
    country: '',
    budget: '',
    propertyType: 'apartment',
    citizenship: 'EU'
  });
  const [result, setResult] = useState<LexaiaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.country || !formData.budget) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Veuillez remplir tous les champs obligatoires.'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('lexaia-call', {
        body: {
          country: formData.country,
          budget: parseInt(formData.budget),
          propertyType: formData.propertyType,
          citizenship: formData.citizenship
        }
      });

      if (error) throw error;

      const response = data as LexaiaResponse;
      if (response.success) {
        setResult(response.data);
        trackLexaiaCalculation({
          country: formData.country,
          budget: parseInt(formData.budget),
          tax_saved: response.data.tax_saved,
          source: response.source
        });
      } else {
        throw new Error('Erreur lors du calcul');
      }
    } catch (error) {
      console.error('Lexaia calculation error:', error);
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de calculer l\'optimisation fiscale. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculateur d'Optimisation Fiscale Lexaia
          </CardTitle>
          <CardDescription>
            Découvrez vos économies d'impôts potentielles selon votre pays de résidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Pays de destination *</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget d'investissement (€) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="500000"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Type de bien</Label>
                <Select value={formData.propertyType} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Terrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenship">Citoyenneté</Label>
                <Select value={formData.citizenship} onValueChange={(value) => setFormData(prev => ({ ...prev, citizenship: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EU">Union Européenne</SelectItem>
                    <SelectItem value="US">États-Unis</SelectItem>
                    <SelectItem value="OTHER">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <LoadingSpinner /> : <Calculator className="mr-2 h-4 w-4" />}
              Calculer l'optimisation fiscale
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Résultats de l'optimisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Économies principales */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-primary">{formatCurrency(result.tax_saved)}</div>
                      <p className="text-sm text-muted-foreground">Économies fiscales</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-primary">{result.effective_rate}%</div>
                      <p className="text-sm text-muted-foreground">Taux effectif</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round((result.tax_saved / parseInt(formData.budget)) * 100)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Économies relatives</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              <Separator />

              {/* Recommandations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Recommandations
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <Badge variant="outline" className="mt-0.5 shrink-0">•</Badge>
                      <p className="text-sm">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <Separator />

              {/* Avantages pays */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Avantages du pays
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.country_benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Badge variant="secondary">{benefit}</Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Lois applicables */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Cadre légal
                </h3>
                <div className="space-y-1">
                  {result.laws.map((law, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="text-sm text-muted-foreground"
                    >
                      • {law}
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              {/* Scénarios */}
              {result.scenarios && result.scenarios.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="font-semibold mb-3">Scénarios d'optimisation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.scenarios.map((scenario, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                      >
                        <Badge variant="outline" className="w-full justify-start">
                          {scenario}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}