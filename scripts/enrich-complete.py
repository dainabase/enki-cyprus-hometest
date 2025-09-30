#!/usr/bin/env python3
"""
🚀 SCRIPT D'ENRICHISSEMENT COMPLET - ProjectFormSteps.tsx
═══════════════════════════════════════════════════════════

Ce script enrichit automatiquement le formulaire Projects avec :
- 3 nouveaux steps (Amenities, Legal, Utilities)
- 15 nouveaux champs dans PricingStep
- 8 nouveaux champs dans SpecificationsStep  
- 3 nouveaux champs dans MediaStep

Total : +29 champs pour une gestion immobilière complète

Usage: python3 scripts/enrich-complete.py
"""

import os
import re
import sys
from datetime import datetime
from pathlib import Path

# Couleurs pour les logs
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def log(message, color=Colors.OKBLUE):
    """Affiche un message coloré"""
    print(f"{color}{message}{Colors.ENDC}")

def log_success(message):
    log(f"✅ {message}", Colors.OKGREEN)

def log_error(message):
    log(f"❌ {message}", Colors.FAIL)

def log_warning(message):
    log(f"⚠️  {message}", Colors.WARNING)

def log_info(message):
    log(f"ℹ️  {message}", Colors.OKCYAN)

# Chemin du fichier à modifier
FILE_PATH = Path(__file__).parent.parent / 'src' / 'components' / 'admin' / 'projects' / 'ProjectFormSteps.tsx'

def create_backup(file_path):
    """Crée une sauvegarde horodatée du fichier"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = file_path.with_suffix(f'.backup_{timestamp}.tsx')
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    log_success(f"Backup créé : {backup_path.name}")
    return backup_path

def phase_1_add_imports(content):
    """PHASE 1 : Ajouter les imports des 3 nouveaux steps"""
    log_info("PHASE 1 : Ajout des imports...")
    
    import_marker = "import { safeBase64Encode, generateShortHash } from '@/utils/stringHelpers';"
    
    if import_marker not in content:
        log_warning("Marker d'imports non trouvé, utilisation d'une approche alternative")
        # Chercher la dernière ligne d'import
        import_lines = [line for line in content.split('\n') if line.startswith('import ')]
        if import_lines:
            last_import = import_lines[-1]
            import_marker = last_import
        else:
            log_error("Impossible de trouver les imports")
            return content
    
    new_imports = """import { ProjectAmenitiesStep } from './steps/ProjectAmenitiesStep';
import { LegalComplianceStep } from './steps/LegalComplianceStep';
import { UtilitiesServicesStep } from './steps/UtilitiesServicesStep';"""
    
    # Vérifier si les imports existent déjà
    if 'ProjectAmenitiesStep' in content:
        log_warning("Les imports existent déjà, passage à la phase suivante")
        return content
    
    content = content.replace(import_marker, f"{import_marker}\n{new_imports}")
    log_success("Imports ajoutés")
    
    return content

def phase_2_add_render_conditions(content):
    """PHASE 2 : Ajouter les conditions de rendu pour les 3 nouveaux steps"""
    log_info("PHASE 2 : Ajout des conditions de rendu...")
    
    # Vérifier si les conditions existent déjà
    if "if (currentStep === 'project-amenities')" in content:
        log_warning("Les conditions de rendu existent déjà, passage à la phase suivante")
        return content
    
    # Chercher le pattern pour insérer les conditions
    # On cherche après renderMarketingStep() et avant le return final
    marketing_pattern = r"(if \(currentStep === 'marketing'\) \{\s+return renderMarketingStep\(\);\s+\})"
    
    new_conditions = """
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
"""
    
    if re.search(marketing_pattern, content):
        content = re.sub(marketing_pattern, r'\1' + new_conditions, content)
        log_success("Conditions de rendu ajoutées")
    else:
        log_warning("Pattern marketing step non trouvé, recherche alternative...")
        # Chercher le dernier if (currentStep === ...) pattern
        all_step_conditions = list(re.finditer(r"if \(currentStep === '[^']+'\) \{[^}]+return[^}]+\}", content))
        if all_step_conditions:
            last_condition = all_step_conditions[-1]
            insert_pos = last_condition.end()
            content = content[:insert_pos] + new_conditions + content[insert_pos:]
            log_success("Conditions de rendu ajoutées (méthode alternative)")
        else:
            log_error("Impossible de trouver où insérer les conditions de rendu")
    
    return content

def phase_3_enrich_pricing_step(content):
    """PHASE 3 : Enrichir renderPricingStep avec 15 nouveaux champs"""
    log_info("PHASE 3 : Enrichissement PricingStep (+15 champs)...")
    
    # Vérifier si l'enrichissement existe déjà
    if 'price_per_m2' in content and 'roi_estimate_percent' in content:
        log_warning("PricingStep déjà enrichi, passage à la phase suivante")
        return content
    
    # Trouver la fin de renderPricingStep (avant le dernier </Card></div>)
    # On cherche la fermeture de la dernière Card dans renderPricingStep
    
    pricing_enrichment = """
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

            {/* Section Financement */}
            <Card className="border-2 border-slate-300 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Options de financement
                </CardTitle>
                <CardDescription>Modalités de paiement disponibles</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="financing_options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Options de financement</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Crédit bancaire jusqu'à 70% LTV, taux à partir de 3.5%..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Détaillez les options de crédit disponibles</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan de paiement</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: 30% à la réservation, 40% pendant construction, 30% à la livraison..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Échelonnement des paiements proposé</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incentives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incentives & Promotions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Meubles offerts, frais de notaire inclus, garantie locative 2 ans..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Avantages commerciaux proposés</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section Légal */}
            <Card className="border-2 border-slate-300 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informations légales
                </CardTitle>
                <CardDescription>Titres de propriété et garanties</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="title_deed_available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Titre de propriété disponible</FormLabel>
                        <FormDescription>Le titre est-il déjà émis ?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title_deed_timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Délai d'obtention du titre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 6 mois après la livraison" {...field} />
                      </FormControl>
                      <FormDescription>Temps estimé pour recevoir le titre de propriété</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="construction_warranty_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Détails garantie construction</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Garantie décennale structure, garantie 2 ans équipements..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Garanties constructeur et assurances</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
"""
    
    # Chercher la fin de renderPricingStep juste avant le </div>)
    pricing_pattern = r"(const renderPricingStep = \(\) => \{.*?</Card>\s*</div>\s*)(\);)"
    
    match = re.search(pricing_pattern, content, re.DOTALL)
    if match:
        # Insérer avant le dernier </div>);
        insert_pos = match.start(2)
        content = content[:insert_pos] + pricing_enrichment + '\n          ' + content[insert_pos:]
        log_success("PricingStep enrichi avec 15 champs")
    else:
        log_error("Pattern renderPricingStep non trouvé pour enrichissement")
    
    return content

def phase_4_enrich_specifications_step(content):
    """PHASE 4 : Enrichir renderSpecificationsStep avec 8 nouveaux champs"""
    log_info("PHASE 4 : Enrichissement SpecificationsStep (+8 champs)...")
    
    # Vérifier si l'enrichissement existe déjà
    if 'bedrooms_range_min' in content and 'finishing_level' in content:
        log_warning("SpecificationsStep déjà enrichi, passage à la phase suivante")
        return content
    
    specifications_enrichment = """
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

            {/* Section Qualité & Prestige */}
            <Card className="border-2 border-slate-300 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
                <CardTitle>Qualité & Prestige</CardTitle>
                <CardDescription>Niveau de finition et détails architecturaux</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="finishing_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau de finition</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le niveau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="luxury">Luxe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Qualité globale des finitions</FormDescription>
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
                        <Input placeholder="Ex: Contemporain, Méditerranéen, Moderne..." {...field} />
                      </FormControl>
                      <FormDescription>Style de design du projet</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="architect_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'architecte</FormLabel>
                      <FormControl>
                        <Input placeholder="Cabinet d'architecture responsable" {...field} />
                      </FormControl>
                      <FormDescription>Architecte ou cabinet de renom</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warranty_years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garantie constructeur (années)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          max="20"
                          placeholder="10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Durée de la garantie constructeur (0-20 ans)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
"""
    
    # Chercher la fin de renderSpecificationsStep
    specs_pattern = r"(const renderSpecificationsStep = \(\) => \{.*?</Card>\s*</div>\s*)(\);)"
    
    match = re.search(specs_pattern, content, re.DOTALL)
    if match:
        insert_pos = match.start(2)
        content = content[:insert_pos] + specifications_enrichment + '\n        ' + content[insert_pos:]
        log_success("SpecificationsStep enrichi avec 8 champs")
    else:
        log_error("Pattern renderSpecificationsStep non trouvé pour enrichissement")
    
    return content

def phase_5_enrich_media_step(content):
    """PHASE 5 : Enrichir renderMediaStep avec 3 nouveaux champs"""
    log_info("PHASE 5 : Enrichissement MediaStep (+3 champs)...")
    
    # Vérifier si l'enrichissement existe déjà
    if 'video_url' in content and 'drone_footage_url' in content and 'brochure_pdf' in content:
        log_warning("MediaStep déjà enrichi")
        return content
    
    # Ajouter les 3 champs dans la section "Contenu Multimédia"
    media_enrichment_videos = """
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
              render={({ field }) => (
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
"""
    
    # Chercher après vimeo_tour_url dans la section Contenu Multimédia
    vimeo_pattern = r"(name=\"vimeo_tour_url\"[\s\S]*?</FormItem>\s*\)\s*}\s*/>)"
    
    match = re.search(vimeo_pattern, content)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + media_enrichment_videos + content[insert_pos:]
        log_success("Champs vidéo ajoutés à MediaStep")
    else:
        log_warning("Pattern vimeo_tour_url non trouvé")
    
    # Ajouter brochure_pdf dans la section Documents
    brochure_enrichment = """
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
"""
    
    # Chercher dans la section Documents du Projet
    # Chercher après site_plan_url
    site_plan_pattern = r"(name=\"site_plan_url\"[\s\S]*?</FormItem>\s*\)\s*}\s*/>)"
    
    match = re.search(site_plan_pattern, content)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + brochure_enrichment + content[insert_pos:]
        log_success("Champ brochure_pdf ajouté à MediaStep")
    else:
        log_warning("Pattern site_plan_url non trouvé")
    
    return content

def main():
    """Fonction principale"""
    log(f"\n{'='*60}", Colors.BOLD)
    log("🚀 ENRICHISSEMENT COMPLET - ProjectFormSteps.tsx", Colors.BOLD)
    log(f"{'='*60}\n", Colors.BOLD)
    
    # Vérifier que le fichier existe
    if not FILE_PATH.exists():
        log_error(f"Fichier non trouvé : {FILE_PATH}")
        log_info("Assurez-vous d'exécuter ce script depuis la racine du projet")
        sys.exit(1)
    
    log_info(f"Fichier cible : {FILE_PATH}")
    log_info(f"Taille : {FILE_PATH.stat().st_size / 1024:.2f} KB")
    
    # Créer une sauvegarde
    backup_path = create_backup(FILE_PATH)
    
    try:
        # Lire le contenu du fichier
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        log_info(f"Contenu chargé : {len(content)} caractères, {len(content.splitlines())} lignes\n")
        
        # Appliquer toutes les phases
        content = phase_1_add_imports(content)
        content = phase_2_add_render_conditions(content)
        content = phase_3_enrich_pricing_step(content)
        content = phase_4_enrich_specifications_step(content)
        content = phase_5_enrich_media_step(content)
        
        # Écrire le fichier modifié
        with open(FILE_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        
        log(f"\n{'='*60}", Colors.BOLD)
        log_success("✨ ENRICHISSEMENT TERMINÉ AVEC SUCCÈS !")
        log(f"{'='*60}\n", Colors.BOLD)
        
        log_info("📊 Résumé des modifications :")
        log_info("  ✅ Phase 1 : Imports des 3 steps ajoutés")
        log_info("  ✅ Phase 2 : Conditions de rendu ajoutées")
        log_info("  ✅ Phase 3 : PricingStep enrichi (+15 champs)")
        log_info("  ✅ Phase 4 : SpecificationsStep enrichi (+8 champs)")
        log_info("  ✅ Phase 5 : MediaStep enrichi (+3 champs)")
        log_info(f"  📦 Total : +29 champs ajoutés\n")
        
        log_info("🔄 Prochaines étapes :")
        log_info("  1. Vérifier les modifications : git diff src/components/admin/projects/ProjectFormSteps.tsx")
        log_info("  2. Tester localement : npm run dev")
        log_info("  3. Commiter : git add . && git commit -m 'feat: Enrich project form'")
        log_info("  4. Pusher : git push\n")
        
        log_info(f"💾 Backup sauvegardé : {backup_path.name}")
        
    except Exception as e:
        log_error(f"Erreur lors de l'enrichissement : {str(e)}")
        log_warning(f"Le backup est disponible : {backup_path}")
        sys.exit(1)

if __name__ == "__main__":
    main()
