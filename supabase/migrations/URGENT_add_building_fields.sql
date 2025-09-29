-- MIGRATION URGENTE - Ajout des champs manquants pour les bâtiments
-- À exécuter IMMÉDIATEMENT dans Supabase SQL Editor

-- 1️⃣ STRUCTURE & DIMENSIONS
ALTER TABLE buildings 
ADD COLUMN IF NOT EXISTS surface_totale_batiment DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS hauteur_batiment DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS nombre_logements_type JSONB DEFAULT '{}';

-- 2️⃣ POSITIONNEMENT & ORIENTATION
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS position_dans_projet TEXT,
ADD COLUMN IF NOT EXISTS orientation_principale TEXT,
ADD COLUMN IF NOT EXISTS vues_principales TEXT[] DEFAULT '{}';

-- 3️⃣ PARKINGS
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS nombre_places_parking INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS parking_visiteurs INTEGER DEFAULT 0;

-- 4️⃣ COMMERCIALISATION
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS prix_moyen_m2 DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS fourchette_prix_min DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS fourchette_prix_max DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS taux_occupation DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS date_mise_en_vente DATE;

-- 5️⃣ RÉPARTITION PAR ÉTAGE
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS configuration_etages JSONB DEFAULT '{}';

-- 6️⃣ ASPECTS TECHNIQUES
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS type_chauffage TEXT,
ADD COLUMN IF NOT EXISTS type_climatisation TEXT,
ADD COLUMN IF NOT EXISTS annee_construction INTEGER,
ADD COLUMN IF NOT EXISTS annee_renovation INTEGER,
ADD COLUMN IF NOT EXISTS norme_construction TEXT;

-- 7️⃣ LOCAUX ANNEXES
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS nombre_caves INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS surface_caves DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS local_velos BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS local_poussettes BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nombre_box_fermes INTEGER DEFAULT 0;

-- 8️⃣ COPROPRIÉTÉ
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS nombre_lots INTEGER;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Migration complétée - 25 nouveaux champs ajoutés !';
END $$;