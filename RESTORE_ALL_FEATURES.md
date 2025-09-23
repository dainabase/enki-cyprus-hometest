# 🚨 RESTAURATION COMPLÈTE - SCRIPT AUTOMATIQUE

## Script bash pour restaurer automatiquement toutes les fonctionnalités

```bash
#!/bin/bash

echo "🚨 RESTAURATION URGENTE DES FONCTIONNALITÉS PERDUES"
echo "================================================="

# 1. Sauvegarder l'état actuel
echo "📦 Sauvegarde de l'état actuel..."
git add .
git stash save "Backup avant restauration $(date +%Y%m%d_%H%M%S)"

# 2. Récupérer la dernière version de GitHub
echo "🔄 Synchronisation avec GitHub..."
git pull origin main

# 3. Vider le cache
echo "🗑️ Nettoyage du cache..."
rm -rf .vite
rm -rf node_modules/.vite
rm -rf dist

# 4. Réinstaller les dépendances
echo "📦 Réinstallation des dépendances..."
npm ci

# 5. Redémarrer le serveur
echo "🚀 Redémarrage du serveur de développement..."
npm run dev
```

## ✅ FONCTIONNALITÉS À VÉRIFIER APRÈS RESTAURATION

### 1. **Google Maps - Détection automatique**
- [ ] Le bouton "Détecter" dans l'onglet Location fonctionne
- [ ] Les commodités sont détectées automatiquement
- [ ] Les distances stratégiques sont calculées
- [ ] La carte affiche les marqueurs

### 2. **Bâtiments - Création sans erreur**  
- [ ] Ajout d'un nouveau bâtiment sans erreur "units_available"
- [ ] Pas d'erreur "construction_year"
- [ ] Les champs sont correctement initialisés

### 3. **SEO - Génération avec IA**
- [ ] Le bouton "Générer avec l'IA" fonctionne
- [ ] Le titre respecte 60 caractères max
- [ ] La description respecte 160 caractères max
- [ ] Pas d'emojis dans le contenu généré

### 4. **Localisation - Nouveaux champs**
- [ ] Champs séparés : street_address, postal_code, city
- [ ] Détection automatique de zone depuis code postal
- [ ] Indicateurs visuels de détection

## 🔧 CORRECTIONS MANUELLES SI NÉCESSAIRE

### Correction 1 : Restaurer Google Maps dans LocationSection

Si la détection Google Maps ne fonctionne pas, ajouter dans LocationSection.tsx :

```typescript
// Ajouter après les imports
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Dans le composant, ajouter le bouton de détection
<Button
  type="button"
  onClick={async () => {
    setIsDetecting(true);
    try {
      const address = form.getValues('street_address');
      const postalCode = form.getValues('postal_code'); 
      const city = form.getValues('city');
      
      const fullAddress = `${address}, ${postalCode} ${city}, Cyprus`;
      
      const { data: result } = await supabase.functions.invoke('google-maps-agent', {
        body: {
          action: 'findNearbyPlaces',
          params: { 
            address: fullAddress,
            radius: 2
          }
        }
      });
      
      if (result) {
        // Traiter les résultats
        form.setValue('surrounding_amenities', result.places);
        toast.success('Détection complète !');
      }
    } catch (error) {
      toast.error('Erreur de détection');
    } finally {
      setIsDetecting(false);
    }
  }}
  disabled={isDetecting}
>
  {isDetecting ? (
    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Détection...</>
  ) : (
    'Détecter commodités'
  )}
</Button>
```

### Correction 2 : Fix du schéma Building

Dans src/schemas/projectSchema.ts, s'assurer que :

```typescript
buildings: z.array(z.object({
  building_name: z.string(),
  building_type: z.string(),
  construction_status: z.string(),
  total_floors: z.number().optional(),
  total_units: z.number().optional(),
  units_available: z.number().optional(),
  // PAS de construction_year ici !
}))
```

### Correction 3 : Fix de la génération SEO

Dans MarketingSection.tsx, corriger la fonction handleGenerateSEO :

```typescript
const handleGenerateSEO = async () => {
  setIsGenerating(true);
  
  try {
    const projectData = form.getValues();
    
    if (!projectData.title) {
      toast.error('Le titre du projet est requis');
      return;
    }
    
    // Appel au service SEO
    const seoContent = await generateSEOContent(projectData);
    
    // Mise à jour des champs (vérifier les noms des champs)
    form.setValue('seo_title', seoContent.meta_title);
    form.setValue('seo_description', seoContent.meta_description);
    form.setValue('seo_keywords', seoContent.meta_keywords);
    form.setValue('project_slug', seoContent.url_slug);
    
    // Open Graph
    form.setValue('og_title', seoContent.meta_title);
    form.setValue('og_description', seoContent.meta_description);
    
    toast.success('SEO généré avec succès !');
  } catch (error) {
    toast.error('Erreur lors de la génération SEO');
  } finally {
    setIsGenerating(false);
  }
};
```

## 🔍 VÉRIFICATIONS BASE DE DONNÉES

```sql
-- Vérifier que construction_year est dans projects, pas dans buildings
SELECT 
  table_name,
  column_name
FROM information_schema.columns
WHERE column_name = 'construction_year'
  AND table_schema = 'public';

-- Doit retourner : projects, PAS buildings

-- Vérifier que units_available existe dans buildings
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'buildings'
  AND column_name IN ('units_available', 'total_units', 'total_floors');

-- Doit retourner les 3 colonnes
```

## 🎯 RÉSULTAT ATTENDU APRÈS RESTAURATION

1. **Google Maps** : Détection automatique fonctionnelle
2. **Bâtiments** : Création sans aucune erreur
3. **SEO** : Génération avec respect des limites 60/160
4. **Localisation** : Champs séparés et détection auto

## ⚠️ SI LES PROBLÈMES PERSISTENT

1. **Vider complètement le cache navigateur**
   - Chrome : Ctrl+Shift+Delete → Tout sélectionner → Effacer

2. **Réinitialiser le projet**
```bash
# Sauvegarder vos modifications
git stash

# Réinitialiser complètement
rm -rf node_modules
rm -rf .vite
rm package-lock.json

# Réinstaller
npm install
npm run dev
```

3. **Vérifier la console navigateur**
   - F12 → Console
   - Chercher les erreurs en rouge
   - Partager les messages d'erreur exacts

## 📞 SUPPORT IMMÉDIAT

Je suis là pour vous aider. Si après ces corrections vous avez toujours des problèmes :
1. Partagez les messages d'erreur exacts de la console
2. Indiquez quelle fonctionnalité ne marche pas
3. Je vais corriger immédiatement

---

**IMPORTANT** : Le code sur GitHub contient déjà des corrections partielles. Ce document vous guide pour restaurer TOUTES les fonctionnalités manquantes.
