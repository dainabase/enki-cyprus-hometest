#!/bin/bash
# Script d'application automatique des corrections Enki Reality
# Date: 23/09/2025

echo "🔧 Application automatique des corrections Enki Reality..."

# 1. CRÉER LE FICHIER DE PATCH POUR ProjectFormSteps.tsx
cat > project-form-steps.patch << 'EOF'
// PATCH AUTOMATIQUE POUR ProjectFormSteps.tsx
// Ce fichier remplace les sections problématiques

// ========================================
// 1. AJOUTER CES IMPORTS (ligne ~50 après les autres imports)
// ========================================
import { LocationSection } from './LocationSection';
import { SpecificationsSection } from './SpecificationsSection';  
import { MarketingSection } from './MarketingSection';

// ========================================
// 2. REMPLACER renderLocationStep (chercher "const renderLocationStep")
// ========================================
const renderLocationStep = () => {
  return <LocationSection form={form} />;
};

// ========================================
// 3. REMPLACER renderSpecificationsStep (chercher "const renderSpecificationsStep")
// ========================================  
const renderSpecificationsStep = () => {
  return <SpecificationsSection form={form} />;
};

// ========================================
// 4. REMPLACER renderMarketingStep (chercher "const renderMarketingStep")
// ========================================
const renderMarketingStep = () => {
  return <MarketingSection form={form} />;
};

// ========================================
// 5. DANS renderBuildingsStep, REMPLACER la fonction addBuilding par:
// ========================================
const addBuilding = () => {
  const newBuilding: ProjectBuilding = {
    building_name: `Bâtiment ${buildingsValue.length + 1}`,
    building_type: 'apartment_building',
    construction_status: 'planned',
    total_floors: 0,
    total_units: 0,
    units_available: 0
    // IMPORTANT: PAS de construction_year ici !
  };
  form.setValue('buildings', [...buildingsValue, newBuilding]);
};
EOF

echo "✅ Patch créé pour ProjectFormSteps.tsx"

# 2. CRÉER LE FICHIER SQL DE MIGRATION AUTOMATIQUE
cat > fix_database.sql << 'EOF'
-- MIGRATION AUTOMATIQUE POUR CORRIGER LA STRUCTURE
-- Exécuter dans Supabase SQL Editor

-- 1. Ajouter les champs manquants dans projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS auto_detected_zone BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS district VARCHAR(50),
ADD COLUMN IF NOT EXISTS municipality VARCHAR(100),
ADD COLUMN IF NOT EXISTS energy_rating VARCHAR(2),
ADD COLUMN IF NOT EXISTS construction_materials TEXT[],
ADD COLUMN IF NOT EXISTS design_style VARCHAR(100),
ADD COLUMN IF NOT EXISTS building_certification VARCHAR(255),
ADD COLUMN IF NOT EXISTS construction_year INTEGER,
ADD COLUMN IF NOT EXISTS architect_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS architect_license_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS builder_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS renovation_year INTEGER,
ADD COLUMN IF NOT EXISTS maintenance_fees_yearly DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS property_tax_yearly DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS hoa_fees_monthly DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS building_insurance VARCHAR(255),
ADD COLUMN IF NOT EXISTS seismic_rating VARCHAR(10),
ADD COLUMN IF NOT EXISTS accessibility_features TEXT[],
ADD COLUMN IF NOT EXISTS internet_speed_mbps INTEGER,
ADD COLUMN IF NOT EXISTS pet_policy VARCHAR(20),
ADD COLUMN IF NOT EXISTS smoking_policy VARCHAR(20),
ADD COLUMN IF NOT EXISTS sustainability_certifications TEXT[],
ADD COLUMN IF NOT EXISTS warranty_years INTEGER,
ADD COLUMN IF NOT EXISTS finishing_level VARCHAR(20);

-- 2. Supprimer construction_year de buildings s'il existe
ALTER TABLE buildings 
DROP COLUMN IF EXISTS construction_year;

-- 3. Créer fonction de détection automatique de zone
CREATE OR REPLACE FUNCTION detect_cyprus_zone_from_postal(postal_code TEXT)
RETURNS TEXT AS $$
BEGIN
  IF postal_code IS NULL THEN
    RETURN 'limassol';
  END IF;
  
  CASE 
    WHEN postal_code BETWEEN '3000' AND '3999' THEN RETURN 'limassol';
    WHEN postal_code BETWEEN '8000' AND '8999' THEN RETURN 'paphos';
    WHEN postal_code BETWEEN '6000' AND '6999' THEN RETURN 'larnaca';
    WHEN postal_code BETWEEN '7000' AND '7999' THEN RETURN 'larnaca';
    WHEN postal_code BETWEEN '1000' AND '2999' THEN RETURN 'nicosia';
    WHEN postal_code BETWEEN '5000' AND '5999' THEN RETURN 'famagusta';
    ELSE RETURN 'limassol';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- 4. Message de confirmation
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Migration appliquée avec succès !';
END $$;
EOF

echo "✅ Script SQL créé : fix_database.sql"

# 3. INSTRUCTIONS FINALES
echo ""
echo "==========================================="
echo "📋 INSTRUCTIONS D'APPLICATION MANUELLE"
echo "==========================================="
echo ""
echo "1️⃣ ÉTAPE 1 : Appliquer la migration SQL"
echo "   - Ouvrez Supabase Dashboard"
echo "   - Allez dans SQL Editor"
echo "   - Copiez le contenu de fix_database.sql"
echo "   - Exécutez le script"
echo ""
echo "2️⃣ ÉTAPE 2 : Modifier ProjectFormSteps.tsx"
echo "   - Ouvrez src/components/admin/projects/ProjectFormSteps.tsx"
echo "   - Appliquez les modifications du fichier project-form-steps.patch"
echo "   - Ajoutez les imports en ligne ~50"
echo "   - Remplacez les 3 fonctions render indiquées"
echo ""
echo "3️⃣ ÉTAPE 3 : Vider le cache et redémarrer"
echo "   - Arrêtez le serveur dev (Ctrl+C)"
echo "   - Videz le cache : rm -rf .vite node_modules/.vite"
echo "   - Redémarrez : npm run dev"
echo "   - Videz le cache navigateur : Ctrl+Shift+R"
echo ""
echo "4️⃣ ÉTAPE 4 : Tester"
echo "   - Créer un nouveau bâtiment (plus d'erreur construction_year)"
echo "   - Générer SEO (respecte 60/160 caractères)"
echo "   - Tester la localisation (champs séparés)"
echo ""
echo "✅ Script terminé !"
