# Guide d'implémentation - Enrichissement Formulaire Projects

## 🎯 Modifications à effectuer manuellement

Le fichier `ProjectFormSteps.tsx` fait 2619 lignes (114KB), il faut faire les modifications suivantes :

### PHASE 1 : Ajouter les imports (ligne ~27)

Après la ligne :
```typescript
import { safeBase64Encode, generateShortHash } from '@/utils/stringHelpers';
```

Ajouter :
```typescript
import { ProjectAmenitiesStep } from './steps/ProjectAmenitiesStep';
import { LegalComplianceStep } from './steps/LegalComplianceStep';
import { UtilitiesServicesStep } from './steps/UtilitiesServicesStep';
```

### PHASE 2 : Ajouter les conditions de rendu (fin du composant)

Chercher la fin de la fonction principale `ProjectFormSteps` (autour ligne 2600), et AVANT le `return` final ou APRÈS les autres `if` conditions de rendering, ajouter :

```typescript
// Step 8 : Équipements du projet
if (currentStep === 'project-amenities') {
  return <ProjectAmenitiesStep form={form} />;
}

// Step 9 : Légal & Conformité
if (currentStep === 'legal-compliance') {
  return <LegalComplianceStep form={form} />;
}

// Step 10 : Utilitaires & Services
if (currentStep === 'utilities-services') {
  return <UtilitiesServicesStep form={form} />;
}
```

### PHASE 3 : Enrichir renderPricingStep()

Dans la fonction `renderPricingStep()`, APRÈS les champs existants `golden_visa_eligible` et `financing_available`, ajouter :

```typescript
{/* Section Tarification Transparente */}
<Card className="border-2 border-slate-300 shadow-lg mt-6">
  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
    <CardTitle>Transparence tarifaire</CardTitle>
    <CardDescription>Frais inclus et informations financières</CardDescription>
  </CardHeader>
  <CardContent className="p-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="price_per_m2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix au m²</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                placeholder="2500"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>Prix moyen par mètre carré</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="transfer_fee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frais de transfert (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                max="10"
                step="0.1"
                placeholder="3-8%"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>Frais de transfert de propriété (3-8% à Chypre)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="vat_included"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">TVA incluse</FormLabel>
              <FormDescription>La TVA est-elle incluse dans le prix affiché ?</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="transfer_fees_included"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Frais de transfert inclus</FormLabel>
              <FormDescription>Frais inclus dans le prix ?</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="stamp_duty_included"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Droits de timbre inclus</FormLabel>
              <FormDescription>Stamp duty inclus ?</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="legal_fees_included"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Frais légaux inclus</FormLabel>
              <FormDescription>Frais d'avocat inclus ?</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  </CardContent>
</Card>

{/* Section ROI Investisseurs */}
<Card className="border-2 border-slate-300 shadow-lg mt-6">
  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
    <CardTitle className="flex items-center gap-2">
      <BarChart3 className="w-5 h-5" />
      Retour sur investissement
    </CardTitle>
    <CardDescription>Données pour investisseurs</CardDescription>
  </CardHeader>
  <CardContent className="p-6 space-y-6">
    <FormField
      control={form.control}
      name="roi_estimate_percent"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between mb-2">
            <FormLabel>ROI estimé annuel</FormLabel>
            <span className="text-sm font-semibold">{field.value || 0}%</span>
          </div>
          <FormControl>
            <Slider
              min={0}
              max={20}
              step={0.5}
              value={[field.value || 0]}
              onValueChange={(vals) => field.onChange(vals[0])}
            />
          </FormControl>
          <FormDescription>Retour sur investissement estimé (0-20%)</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="rental_yield_percent"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between mb-2">
            <FormLabel>Rendement locatif annuel</FormLabel>
            <span className="text-sm font-semibold">{field.value || 0}%</span>
          </div>
          <FormControl>
            <Slider
              min={0}
              max={20}
              step={0.5}
              value={[field.value || 0]}
              onValueChange={(vals) => field.onChange(vals[0])}
            />
          </FormControl>
          <FormDescription>Rendement locatif estimé (6-16% typique à Chypre)</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </CardContent>
</Card>
```

Continuez avec les sections Financement et Légal tel que décrit dans le prompt initial.

### PHASE 4 : Enrichir renderSpecificationsStep()

Ajouter après les champs existants :

```typescript
{/* Section Gamme Unités */}
<Card className="border-2 border-slate-300 shadow-lg mt-6">
  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
    <CardTitle>Gamme des unités</CardTitle>
    <CardDescription>Fourchettes de chambres et surfaces</CardDescription>
  </CardHeader>
  <CardContent className="p-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="bedrooms_range_min"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chambres minimum</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                max="10"
                placeholder="1"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>Nombre minimum de chambres</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bedrooms_range_max"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chambres maximum</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                max="10"
                placeholder="5"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>Nombre maximum de chambres</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="square_meters_min"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Surface minimum (m²)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                placeholder="80"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>Surface minimale des unités</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="square_meters_max"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Surface maximum (m²)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                placeholder="250"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>Surface maximale des unités</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </CardContent>
</Card>
```

Continuez avec la section Qualité & Prestige.

### PHASE 5 : Enrichir renderMediaStep()

Dans la Card "Contenu Multimédia", ajouter APRÈS youtube_tour_url, vr_tour_url, vimeo_tour_url :

```typescript
<FormField
  control={form.control}
  name="video_url"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="flex items-center gap-2">
        <Video className="w-4 h-4" />
        Vidéo générique
      </FormLabel>
      <FormControl>
        <Input placeholder="https://..." {...field} />
      </FormControl>
      <FormDescription>Vidéo de présentation générale du projet</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="drone_footage_url"
  render={({ field}) => (
    <FormItem>
      <FormLabel className="flex items-center gap-2">
        <Camera className="w-4 h-4" />
        Vidéo drone
      </FormLabel>
      <FormControl>
        <Input placeholder="https://..." {...field} />
      </FormControl>
      <FormDescription>Vidéo aérienne par drone</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

Dans la Card "Documents du Projet", ajouter :

```typescript
<FormField
  control={form.control}
  name="brochure_pdf"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Brochure PDF
      </FormLabel>
      <FormControl>
        <Input placeholder="https://..." {...field} />
      </FormControl>
      <FormDescription>URL de la brochure au format PDF</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## ✅ Checklist finale

- [ ] Imports ajoutés en haut du fichier
- [ ] 3 conditions de rendu ajoutées (project-amenities, legal-compliance, utilities-services)
- [ ] PricingStep enrichi avec 15 nouveaux champs
- [ ] SpecificationsStep enrichi avec 8 nouveaux champs
- [ ] MediaStep enrichi avec 3 nouveaux champs
- [ ] Test création projet
- [ ] Test édition projet
- [ ] Test navigation entre tous les steps
- [ ] Test sauvegarde de tous les champs

## 🚀 Pour tester

```bash
# Basculer sur la branche
git checkout feature/enrich-project-form-steps

# Lancer le projet
npm run dev

# Tester le formulaire Projects
```
