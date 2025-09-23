import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UseFormReturn } from 'react-hook-form';
import { Sparkles, AlertCircle, CheckCircle, Loader2, Link, Search } from 'lucide-react';
import { generateSEOContent, validateSEOContent } from '@/services/seoGenerator';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MarketingSectionProps {
  form: UseFormReturn<any>;
}

export const MarketingSection: React.FC<MarketingSectionProps> = ({ form }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Surveiller les changements pour valider en temps réel
  const metaTitle = form.watch('meta_title');
  const metaDescription = form.watch('meta_description');
  
  React.useEffect(() => {
    const validation = validateSEOContent({ 
      meta_title: metaTitle, 
      meta_description: metaDescription 
    });
    setValidationErrors(validation.errors);
  }, [metaTitle, metaDescription]);
  
  const handleGenerateSEO = async () => {
    setIsGenerating(true);
    
    try {
      // Récupérer les données du projet
      const projectData = form.getValues();
      
      // Validation minimale
      if (!projectData.title) {
        toast.error('Le titre du projet est requis pour générer le SEO');
        return;
      }
      
      // Générer le contenu SEO
      const seoContent = await generateSEOContent(projectData);
      
      // Mettre à jour les champs du formulaire
      form.setValue('meta_title', seoContent.meta_title);
      form.setValue('meta_description', seoContent.meta_description);
      form.setValue('meta_keywords', seoContent.meta_keywords);
      form.setValue('url_slug', seoContent.url_slug);
      
      // Mettre à jour aussi les champs OG
      form.setValue('og_title', seoContent.meta_title);
      form.setValue('og_description', seoContent.meta_description);
      
      toast.success('Contenu SEO généré avec succès', {
        description: 'Limites respectées : titre 60 car, description 160 car, sans emojis'
      });
      
    } catch (error) {
      console.error('Erreur génération SEO:', error);
      toast.error('Erreur lors de la génération du contenu SEO');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Fonction pour obtenir la couleur selon la longueur
  const getLengthColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage <= 80) return 'text-green-600';
    if (percentage <= 100) return 'text-orange-600';
    return 'text-red-600';
  };
  
  return (
    <div className="space-y-6">
      {/* Bouton de génération automatique */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Optimisation SEO Intelligente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Générez automatiquement du contenu optimisé pour les moteurs de recherche.
              Notre système respecte strictement les limites (60/160 caractères) et supprime tous les emojis.
            </p>
            
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={handleGenerateSEO}
                disabled={isGenerating || !form.watch('title')}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Générer avec l'IA
                  </>
                )}
              </Button>
              
              {!form.watch('title') && (
                <span className="text-sm text-orange-600">
                  ⚠️ Remplissez d'abord le titre du projet
                </span>
              )}
            </div>
            
            {/* Affichage des erreurs de validation */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Champs SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Métadonnées SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Slug */}
          <FormField
            control={form.control}
            name="url_slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  URL du projet (slug)
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="marina-towers-limassol"
                    {...field}
                    className="font-mono"
                  />
                </FormControl>
                <FormDescription>
                  URL finale : /projects/{field.value || 'votre-slug'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Titre SEO */}
          <FormField
            control={form.control}
            name="meta_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Titre SEO
                  <span className="ml-2 text-xs text-muted-foreground">
                    (max 60 caractères)
                  </span>
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Marina Towers - Luxury Apartments in Limassol Cyprus"
                      {...field}
                      maxLength={60}
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Titre qui apparaîtra dans les résultats de recherche Google
                      </div>
                      <div className={`text-sm font-medium ${getLengthColor(field.value?.length || 0, 60)}`}>
                        {field.value?.length || 0}/60
                        {field.value?.length > 60 && (
                          <span className="ml-2">⚠️ Trop long!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description SEO */}
          <FormField
            control={form.control}
            name="meta_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description SEO
                  <span className="ml-2 text-xs text-muted-foreground">
                    (max 160 caractères)
                  </span>
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Premium apartments in Limassol Marina. Golden Visa eligible. From €300,000. Contact us for exclusive viewing."
                      rows={3}
                      {...field}
                      maxLength={160}
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Description qui apparaîtra sous le titre dans Google
                      </div>
                      <div className={`text-sm font-medium ${getLengthColor(field.value?.length || 0, 160)}`}>
                        {field.value?.length || 0}/160
                        {field.value?.length > 160 && (
                          <span className="ml-2">⚠️ Trop long!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Mots-clés SEO */}
          <FormField
            control={form.control}
            name="meta_keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mots-clés SEO</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Séparez par des virgules : Cyprus property, Limassol real estate, Golden Visa"
                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                    onChange={(e) => {
                      const keywords = e.target.value
                        .split(',')
                        .map(k => k.trim())
                        .filter(k => k.length > 0);
                      field.onChange(keywords);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {Array.isArray(field.value) && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {field.value.slice(0, 10).map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                      {field.value.length > 10 && (
                        <Badge variant="outline">
                          +{field.value.length - 10} autres
                        </Badge>
                      )}
                    </div>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Open Graph / Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Open Graph (Réseaux sociaux)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="og_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre Open Graph</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Titre pour le partage sur les réseaux sociaux"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Laissez vide pour utiliser le titre SEO
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="og_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description Open Graph</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description pour le partage sur les réseaux sociaux"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Laissez vide pour utiliser la description SEO
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="og_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Open Graph</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="URL de l'image pour les réseaux sociaux"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Dimensions recommandées : 1200x630px
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Points marketing */}
      <Card>
        <CardHeader>
          <CardTitle>Points marketing clés</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="marketing_highlights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arguments de vente uniques</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Listez les points forts du projet (un par ligne) :
- Vue panoramique sur la mer
- À 5 minutes de la marina
- Éligible Golden Visa
- ROI estimé 8% par an"
                    rows={5}
                    value={Array.isArray(field.value) ? field.value.join('\n') : field.value || ''}
                    onChange={(e) => {
                      const highlights = e.target.value
                        .split('\n')
                        .map(h => h.replace(/^[-•]\s*/, '').trim())
                        .filter(h => h.length > 0);
                      field.onChange(highlights);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Ces points seront utilisés dans les descriptions marketing
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      
      {/* Statut de validation global */}
      {validationErrors.length === 0 && (metaTitle || metaDescription) && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✓ Contenu SEO valide : respecte les limites de caractères et ne contient pas d'emojis
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
