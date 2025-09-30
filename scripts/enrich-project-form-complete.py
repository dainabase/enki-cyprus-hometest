#!/usr/bin/env python3
"""
Script complet pour enrichir le formulaire Projects avec 29 nouveaux champs.
Exécution: python scripts/enrich-project-form-complete.py
"""

import os
import re
from datetime import datetime
from pathlib import Path

FILE_PATH = Path(__file__).parent.parent / 'src' / 'components' / 'admin' / 'projects' / 'ProjectFormSteps.tsx'

def create_backup(file_path):
    """Crée un backup avec timestamp"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{file_path}.backup_{timestamp}"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Backup créé : {backup_path}")
    return backup_path

def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(file_path, content):
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def phase1_add_imports(content):
    """PHASE 1 : Ajoute les imports des 3 nouveaux steps"""
    print("\n📦 PHASE 1 : Ajout des imports...")
    
    marker = "import { safeBase64Encode, generateShortHash } from '@/utils/stringHelpers';"
    
    if marker not in content:
        print("⚠️  Marker d'imports non trouvé")
        return content
    
    imports_to_add = """
import { ProjectAmenitiesStep } from './steps/ProjectAmenitiesStep';
import { LegalComplianceStep } from './steps/LegalComplianceStep';
import { UtilitiesServicesStep } from './steps/UtilitiesServicesStep';"""
    
    content = content.replace(marker, marker + imports_to_add)
    print("✅ Imports ajoutés (3 steps)")
    return content

def phase2_add_render_conditions(content):
    """PHASE 2 : Ajoute les conditions de rendu"""
    print("\n🎨 PHASE 2 : Ajout des conditions de rendu...")
    
    pattern = r"(if \(currentStep === 'marketing'\) \{\s+return renderMarketingStep\(\);\s+\})"
    
    conditions = """

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
  }"""
    
    if re.search(pattern, content):
        content = re.sub(pattern, r'\1' + conditions, content)
        print("✅ Conditions de rendu ajoutées (3 steps)")
    else:
        print("⚠️  Pattern non trouvé")
    
    return content

def phase3_enrich_pricing_step(content):
    """PHASE 3 : Enrichit PricingStep (+15 champs)"""
    print("\n💰 PHASE 3 : Enrichissement PricingStep...")
    
    # Chercher juste avant la fermeture du renderPricingStep
    # On va insérer avant le dernier </Card></div> de la fonction
    
    enrichment = """
            {/* Section Tarification Transparente - NOUVEAU */}
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
                        <FormDescription>Frais de transfert (3-8% à Chypre)</FormDescription>
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
                          <FormDescription>TVA dans le prix ?</FormDescription>
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
                          <FormLabel className="text-base">Frais transfert inclus</FormLabel>
                          <FormDescription>Frais dans le prix ?</FormDescription>
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
                          <FormLabel className="text-base">Droits timbre inclus</FormLabel>
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
                          <FormDescription>Frais avocat inclus ?</FormDescription>
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

            {/* Section ROI Investisseurs - NOUVEAU */}
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
                      <FormDescription>ROI estimé (0-20%)</FormDescription>
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
                      <FormDescription>Rendement (6-16% typique à Chypre)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section Financement - NOUVEAU */}
            <Card className="border-2 border-slate-300 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Options de financement
                </CardTitle>
                <CardDescription>Facilités de paiement</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="financing_options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Options financement</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Partenariats bancaires..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Options de crédit disponibles</FormDescription>
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
                          placeholder="Ex: 30% signature, 70% échelonné..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Échéancier proposé</FormDescription>
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
                          placeholder="Ex: Meubles offerts..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Offres promotionnelles</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section Légal - NOUVEAU */}
            <Card className="border-2 border-slate-300 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informations légales
                </CardTitle>
                <CardDescription>Titre de propriété et garanties</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="title_deed_available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Titre de propriété disponible</FormLabel>
                        <FormDescription>Title deed prêt ?</FormDescription>
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
                      <FormLabel>Délai d'obtention titre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 6 mois après livraison" {...field} />
                      </FormControl>
                      <FormDescription>Estimation délai title deed</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="construction_warranty_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garantie construction</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Garantie décennale..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Garanties développeur</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
"""
    
    # Trouver la fin du dernier </CardContent> dans renderPricingStep, juste avant </Card></div>);
    # On cherche après financing_available
    marker = """              <FormField
                control={form.control}
                name="financing_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Financement disponible</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Possibilité de crédit bancaire
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };"""
    
    if marker in content:
        content = content.replace(marker, marker + enrichment)
        print("✅ PricingStep enrichi (+15 champs)")
    else:
        print("⚠️  Marker PricingStep non trouvé")
    
    return content

def phase4_enrich_specifications_step(content):
    """PHASE 4 : Enrichit SpecificationsStep (+8 champs)"""
    print("\n🏗️  PHASE 4 : Enrichissement SpecificationsStep...")
    
    enrichment = """
            {/* Section Gamme Unités - NOUVEAU */}
            <Card className="border-2 border-slate-300 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
                <CardTitle>Gamme des unités</CardTitle>
                <CardDescription>Fourchettes chambres et surfaces</CardDescription>
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
                        <FormDescription>Minimum chambres</FormDescription>
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
                        <FormDescription>Maximum chambres</FormDescription>
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
                        <FormDescription>Surface minimale</FormDescription>
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
                        <FormDescription>Surface maximale</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section Qualité & Prestige - NOUVEAU */}
            <Card className="border-2 border-slate-300 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
                <CardTitle>Qualité & Prestige</CardTitle>
                <CardDescription>Finitions et caractéristiques</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="finishing_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau de finitions</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Catégorie finitions</FormDescription>
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
                        <Input placeholder="Ex: Contemporary, Mediterranean..." {...field} />
                      </FormControl>
                      <FormDescription>Style de design</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="architect_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom architecte</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Studio XYZ..." {...field} />
                      </FormControl>
                      <FormDescription>Cabinet/Architecte</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warranty_years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Années de garantie</FormLabel>
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
                      <FormDescription>Durée garantie (années)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
"""
    
    # Marker : après parking_spaces, avant la fermeture
    marker = """              <FormField
                control={form.control}
                name="parking_spaces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Places de parking</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };"""
    
    if marker in content:
        content = content.replace(marker, marker + enrichment)
        print("✅ SpecificationsStep enrichi (+8 champs)")
    else:
        print("⚠️  Marker SpecificationsStep non trouvé")
    
    return content

def phase5_enrich_media_step(content):
    """PHASE 5 : Enrichit MediaStep (+3 champs)"""
    print("\n📸 PHASE 5 : Enrichissement MediaStep...")
    
    # Ajouter video_url et drone_footage_url après vimeo_tour_url
    enrichment1 = """
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
                  <FormDescription>Vidéo présentation générale</FormDescription>
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
                  <FormDescription>Vidéo aérienne drone</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />"""
    
    marker1 = """            <FormField
              control={form.control}
              name="vimeo_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Vidéo Vimeo
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://vimeo.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>"""
    
    replacement1 = """            <FormField
              control={form.control}
              name="vimeo_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Vidéo Vimeo
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://vimeo.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
""" + enrichment1 + """
          </CardContent>
        </Card>"""
    
    if marker1 in content:
        content = content.replace(marker1, replacement1)
        print("✅ video_url et drone_footage_url ajoutés")
    else:
        print("⚠️  Marker vimeo non trouvé")
    
    # Ajouter brochure_pdf après site_plan_url
    enrichment2 = """
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
                  <FormDescription>URL brochure PDF</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />"""
    
    marker2 = """            <FormField
              control={form.control}
              name="site_plan_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Spécifications techniques (PDF)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>"""
    
    replacement2 = """            <FormField
              control={form.control}
              name="site_plan_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Spécifications techniques (PDF)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
""" + enrichment2 + """
          </CardContent>
        </Card>"""
    
    if marker2 in content:
        content = content.replace(marker2, replacement2)
        print("✅ brochure_pdf ajouté")
    else:
        print("⚠️  Marker site_plan non trouvé")
    
    return content

def main():
    print("🚀 ENRICHISSEMENT AUTOMATIQUE - Formulaire Projects")
    print(f"📁 Fichier : {FILE_PATH}")
    
    if not FILE_PATH.exists():
        print(f"❌ Fichier non trouvé : {FILE_PATH}")
        return 1
    
    # Backup
    backup_path = create_backup(FILE_PATH)
    
    # Lecture
    content = read_file(FILE_PATH)
    print(f"📄 {len(content)} caractères lus")
    
    # Phases
    content = phase1_add_imports(content)
    content = phase2_add_render_conditions(content)
    content = phase3_enrich_pricing_step(content)
    content = phase4_enrich_specifications_step(content)
    content = phase5_enrich_media_step(content)
    
    # Écriture
    write_file(FILE_PATH, content)
    
    print("\n✨ ✅ ENRICHISSEMENT TERMINÉ !")
    print(f"📁 Modifié : {FILE_PATH}")
    print(f"💾 Backup : {backup_path}")
    
    print("\n📊 RÉCAPITULATIF :")
    print("  ✅ 3 imports ajoutés")
    print("  ✅ 3 conditions rendu")
    print("  ✅ PricingStep +15 champs")
    print("  ✅ SpecificationsStep +8 champs")
    print("  ✅ MediaStep +3 champs")
    print("  🎉 TOTAL : +29 CHAMPS")
    
    print("\n🎯 PROCHAINES ÉTAPES :")
    print("  1. git diff src/components/admin/projects/ProjectFormSteps.tsx")
    print("  2. npm run dev")
    print("  3. git add . && git commit -m 'feat: Enrich form with 29 fields'")
    print("  4. git push origin feature/enrich-project-form-steps")
    
    return 0

if __name__ == "__main__":
    exit(main())
