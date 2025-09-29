-- MIGRATION D'URGENCE - EXÉCUTER IMMÉDIATEMENT DANS SUPABASE
-- Cette migration ajoute TOUS les champs manquants pour éviter les erreurs

-- Vérifier d'abord si les colonnes existent déjà pour éviter les erreurs
DO $$ 
BEGIN
    -- DIMENSIONS & STRUCTURE
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'surface_totale_batiment') THEN
        ALTER TABLE buildings ADD COLUMN surface_totale_batiment DECIMAL(10,2) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'hauteur_batiment') THEN
        ALTER TABLE buildings ADD COLUMN hauteur_batiment DECIMAL(5,2) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'nombre_logements_type') THEN
        ALTER TABLE buildings ADD COLUMN nombre_logements_type JSONB DEFAULT '{}';
    END IF;

    -- POSITIONNEMENT & ORIENTATION
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'position_dans_projet') THEN
        ALTER TABLE buildings ADD COLUMN position_dans_projet TEXT DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'orientation_principale') THEN
        ALTER TABLE buildings ADD COLUMN orientation_principale TEXT DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'vues_principales') THEN
        ALTER TABLE buildings ADD COLUMN vues_principales TEXT[] DEFAULT '{}';
    END IF;

    -- PARKINGS
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'nombre_places_parking') THEN
        ALTER TABLE buildings ADD COLUMN nombre_places_parking INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'parking_visiteurs') THEN
        ALTER TABLE buildings ADD COLUMN parking_visiteurs INTEGER DEFAULT 0;
    END IF;

    -- COMMERCIALISATION
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'prix_moyen_m2') THEN
        ALTER TABLE buildings ADD COLUMN prix_moyen_m2 DECIMAL(10,2) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'fourchette_prix_min') THEN
        ALTER TABLE buildings ADD COLUMN fourchette_prix_min DECIMAL(12,2) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'fourchette_prix_max') THEN
        ALTER TABLE buildings ADD COLUMN fourchette_prix_max DECIMAL(12,2) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'taux_occupation') THEN
        ALTER TABLE buildings ADD COLUMN taux_occupation DECIMAL(5,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'date_mise_en_vente') THEN
        ALTER TABLE buildings ADD COLUMN date_mise_en_vente DATE DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'configuration_etages') THEN
        ALTER TABLE buildings ADD COLUMN configuration_etages JSONB DEFAULT '{}';
    END IF;

    -- ASPECTS TECHNIQUES
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'type_chauffage') THEN
        ALTER TABLE buildings ADD COLUMN type_chauffage TEXT DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'type_climatisation') THEN
        ALTER TABLE buildings ADD COLUMN type_climatisation TEXT DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'annee_construction') THEN
        ALTER TABLE buildings ADD COLUMN annee_construction INTEGER DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'annee_renovation') THEN
        ALTER TABLE buildings ADD COLUMN annee_renovation INTEGER DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'norme_construction') THEN
        ALTER TABLE buildings ADD COLUMN norme_construction TEXT DEFAULT NULL;
    END IF;

    -- LOCAUX ANNEXES
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'nombre_caves') THEN
        ALTER TABLE buildings ADD COLUMN nombre_caves INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'surface_caves') THEN
        ALTER TABLE buildings ADD COLUMN surface_caves DECIMAL(5,2) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'local_velos') THEN
        ALTER TABLE buildings ADD COLUMN local_velos BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'local_poussettes') THEN
        ALTER TABLE buildings ADD COLUMN local_poussettes BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'nombre_box_fermes') THEN
        ALTER TABLE buildings ADD COLUMN nombre_box_fermes INTEGER DEFAULT 0;
    END IF;

    -- COPROPRIÉTÉ
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'nombre_lots') THEN
        ALTER TABLE buildings ADD COLUMN nombre_lots INTEGER DEFAULT NULL;
    END IF;
END $$;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Migration d''urgence exécutée avec succès !';
    RAISE NOTICE '✅ Tous les champs manquants ont été ajoutés';
    RAISE NOTICE '✅ Vous pouvez maintenant sauvegarder le formulaire';
END $$;