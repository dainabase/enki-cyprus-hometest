/**
 * Script pour enrichir automatiquement le formulaire Projects
 * Usage: node scripts/enrich-project-form.js
 */

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../src/components/admin/projects/ProjectFormSteps.tsx');

function enrichProjectForm() {
  console.log('🚀 D\u00e9but de l\'enrichissement du formulaire Projects...');
  
  let content = fs.readFileSync(FILE_PATH, 'utf8');
  
  // PHASE 1 : Ajouter les imports
  console.log('📦 PHASE 1 : Ajout des imports...');
  const importsToAdd = `
import { ProjectAmenitiesStep } from './steps/ProjectAmenitiesStep';
import { LegalComplianceStep } from './steps/LegalComplianceStep';
import { UtilitiesServicesStep } from './steps/UtilitiesServicesStep';`;
  
  // Trouver la ligne apr\u00e8s les imports existants
  const importMarker = "import { safeBase64Encode, generateShortHash } from '@/utils/stringHelpers';";
  if (content.includes(importMarker)) {
    content = content.replace(importMarker, importMarker + importsToAdd);
    console.log('✅ Imports ajout\u00e9s');
  } else {
    console.log('⚠️ Marker d\'imports non trouv\u00e9');
  }
  
  // PHASE 2 : Ajouter les render conditions
  console.log('🎨 PHASE 2 : Ajout des conditions de rendu...');
  const renderConditions = `
  // Step 8 : \u00c9quipements du projet
  if (currentStep === 'project-amenities') {
    return <ProjectAmenitiesStep form={form} />;
  }

  // Step 9 : L\u00e9gal & Conformit\u00e9
  if (currentStep === 'legal-compliance') {
    return <LegalComplianceStep form={form} />;
  }

  // Step 10 : Utilitaires & Services
  if (currentStep === 'utilities-services') {
    return <UtilitiesServicesStep form={form} />;
  }
`;
  
  // Chercher la fin de la fonction ProjectFormSteps
  // On va chercher le dernier 'if (currentStep ===' et ajouter apr\u00e8s
  const lastIfPattern = /if \(currentStep === 'marketing'\) {[\s\S]*?return renderMarketingStep\(\);[\s]*}/;
  if (lastIfPattern.test(content)) {
    content = content.replace(lastIfPattern, (match) => match + '\n' + renderConditions);
    console.log('✅ Conditions de rendu ajout\u00e9es');
  } else {
    console.log('⚠️ Pattern de rendu non trouv\u00e9');
  }
  
  // PHASE 3 : Enrichir renderPricingStep
  console.log('💰 PHASE 3 : Enrichissement renderPricingStep...');
  // Cette partie est complexe, on va ajouter le code avant la fermeture de la fonction
  const pricingEnrichment = `
            {/* Section Tarification Transparente */}
            <Card className="border-2 border-slate-300 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
                <CardTitle>Transparence tarifaire</CardTitle>
                <CardDescription>Frais inclus et informations financi\u00e8res</CardDescription>
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
                        <FormDescription>Prix moyen par m\u00e8tre carr\u00e9</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
`;
  
  // Trouver la fin de renderPricingStep (avant le return final)
  const pricingPattern = /(const renderPricingStep = \(\) => {[\s\S]*?<\/Card>[\s]*<\/div>)(\s*\);)/;
  if (pricingPattern.test(content)) {
    content = content.replace(pricingPattern, (match, p1, p2) => p1 + '\n' + pricingEnrichment + p2);
    console.log('✅ renderPricingStep enrichi');
  } else {
    console.log('⚠️ Pattern renderPricingStep non trouv\u00e9');
  }
  
  // Sauvegarder le fichier modifi\u00e9
  fs.writeFileSync(FILE_PATH, content, 'utf8');
  console.log('\n✨ ✅ Enrichissement termin\u00e9 avec succ\u00e8s!');
  console.log('📁 Fichier modifi\u00e9 :', FILE_PATH);
  console.log('\n🎯 Prochaine \u00e9tape : Tester le formulaire dans l\'application');
}

try {
  enrichProjectForm();
} catch (error) {
  console.error('❌ Erreur lors de l\'enrichissement :', error.message);
  process.exit(1);
}
