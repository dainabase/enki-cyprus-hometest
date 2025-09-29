-- Migration pour ajouter les champs critiques manquants à la table buildings
-- Date: 2024-01-09
-- Description: Ajout des champs essentiels pour une description complète des bâtiments

-- 1️⃣ STRUCTURE & DIMENSIONS
ALTER TABLE buildings 
ADD COLUMN IF NOT EXISTS surface_totale_batiment DECIMAL(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS hauteur_batiment DECIMAL(5,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS nombre_logements_type JSONB DEFAULT '{}';

COMMENT ON COLUMN buildings.surface_totale_batiment IS 'Surface totale du bâtiment en m²';
COMMENT ON COLUMN buildings.hauteur_batiment IS 'Hauteur du bâtiment en mètres';
COMMENT ON COLUMN buildings.nombre_logements_type IS 'Répartition par type: {"studios": 5, "t2": 10, "t3": 8, "t4": 2, "penthouse": 1}';

-- 2️⃣ POSITIONNEMENT & ORIENTATION
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS position_dans_projet TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS orientation_principale TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS vues_principales TEXT[] DEFAULT '{}';

COMMENT ON COLUMN buildings.position_dans_projet IS 'Position dans le projet: Entrée, Fond, Vue mer, Centre, etc.';
COMMENT ON COLUMN buildings.orientation_principale IS 'Orientation principale: Nord, Sud, Est, Ouest, Nord-Est, etc.';
COMMENT ON COLUMN buildings.vues_principales IS 'Vues principales: {Mer, Montagne, Parc, Ville, Piscine}';

-- 3️⃣ PARKINGS (détails)
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS nombre_places_parking INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS parking_visiteurs INTEGER DEFAULT 0;

COMMENT ON COLUMN buildings.nombre_places_parking IS 'Nombre total de places de parking pour le bâtiment';
COMMENT ON COLUMN buildings.parking_visiteurs IS 'Nombre de places visiteurs';

-- 4️⃣ COMMERCIALISATION
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS prix_moyen_m2 DECIMAL(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS fourchette_prix_min DECIMAL(12,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS fourchette_prix_max DECIMAL(12,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS taux_occupation DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS date_mise_en_vente DATE DEFAULT NULL;

COMMENT ON COLUMN buildings.prix_moyen_m2 IS 'Prix moyen au m² dans le bâtiment';
COMMENT ON COLUMN buildings.fourchette_prix_min IS 'Prix minimum dans le bâtiment';
COMMENT ON COLUMN buildings.fourchette_prix_max IS 'Prix maximum dans le bâtiment';
COMMENT ON COLUMN buildings.taux_occupation IS 'Pourcentage vendu/loué (0-100)';
COMMENT ON COLUMN buildings.date_mise_en_vente IS 'Date de début de commercialisation';

-- 5️⃣ RÉPARTITION PAR ÉTAGE
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS configuration_etages JSONB DEFAULT '{}';

COMMENT ON COLUMN buildings.configuration_etages IS 'Configuration par étage: {"rdc": {"studios": 3, "commerces": 2}, "etage_1": {"t2": 4}}';

-- 7️⃣ ASPECTS TECHNIQUES
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS type_chauffage TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS type_climatisation TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS annee_construction INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS annee_renovation INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS norme_construction TEXT DEFAULT NULL;

COMMENT ON COLUMN buildings.type_chauffage IS 'Type de chauffage: Collectif, Individuel gaz, Individuel électrique, Pompe à chaleur, etc.';
COMMENT ON COLUMN buildings.type_climatisation IS 'Type de climatisation: Central, Split, Multi-split, Pré-installation, Aucune';
COMMENT ON COLUMN buildings.annee_construction IS 'Année de construction du bâtiment';
COMMENT ON COLUMN buildings.annee_renovation IS 'Année de la dernière rénovation majeure';
COMMENT ON COLUMN buildings.norme_construction IS 'Norme de construction: RT2012, BBC, HQE, Passivhaus, etc.';

-- 8️⃣ LOCAUX ANNEXES
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS nombre_caves INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS surface_caves DECIMAL(5,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS local_velos BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS local_poussettes BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nombre_box_fermes INTEGER DEFAULT 0;

COMMENT ON COLUMN buildings.nombre_caves IS 'Nombre total de caves dans le bâtiment';
COMMENT ON COLUMN buildings.surface_caves IS 'Surface moyenne des caves en m²';
COMMENT ON COLUMN buildings.local_velos IS 'Présence d''un local vélos';
COMMENT ON COLUMN buildings.local_poussettes IS 'Présence d''un local poussettes';
COMMENT ON COLUMN buildings.nombre_box_fermes IS 'Nombre de box fermés/garages';

-- 9️⃣ CHARGES & COPROPRIÉTÉ  
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS nombre_lots INTEGER DEFAULT NULL;

COMMENT ON COLUMN buildings.nombre_lots IS 'Nombre total de lots dans la copropriété';

-- Ajout d'index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_buildings_prix_moyen_m2 ON buildings(prix_moyen_m2);
CREATE INDEX IF NOT EXISTS idx_buildings_taux_occupation ON buildings(taux_occupation);
CREATE INDEX IF NOT EXISTS idx_buildings_orientation ON buildings(orientation_principale);
CREATE INDEX IF NOT EXISTS idx_buildings_annee_construction ON buildings(annee_construction);

-- Ajout de contraintes de validation
ALTER TABLE buildings
ADD CONSTRAINT check_taux_occupation CHECK (taux_occupation >= 0 AND taux_occupation <= 100),
ADD CONSTRAINT check_prix_positif CHECK (
    (prix_moyen_m2 IS NULL OR prix_moyen_m2 > 0) AND
    (fourchette_prix_min IS NULL OR fourchette_prix_min > 0) AND
    (fourchette_prix_max IS NULL OR fourchette_prix_max > 0)
),
ADD CONSTRAINT check_prix_coherent CHECK (
    fourchette_prix_min IS NULL OR 
    fourchette_prix_max IS NULL OR 
    fourchette_prix_min <= fourchette_prix_max
),
ADD CONSTRAINT check_annees_coherentes CHECK (
    annee_construction IS NULL OR 
    annee_renovation IS NULL OR 
    annee_construction <= annee_renovation
);

-- Fonction pour calculer automatiquement le taux d'occupation
CREATE OR REPLACE FUNCTION calculate_building_occupancy()
RETURNS TRIGGER AS $$
BEGIN
    -- Met à jour le taux d'occupation basé sur les propriétés du bâtiment
    UPDATE buildings
    SET taux_occupation = (
        SELECT 
            CASE 
                WHEN COUNT(*) = 0 THEN 0
                ELSE (COUNT(*) FILTER (WHERE status IN ('sold', 'reserved', 'rented')) * 100.0 / COUNT(*))
            END
        FROM properties
        WHERE building_id = NEW.building_id
    )
    WHERE id = NEW.building_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le taux d'occupation
DROP TRIGGER IF EXISTS update_building_occupancy ON properties;
CREATE TRIGGER update_building_occupancy
    AFTER INSERT OR UPDATE OF status OR DELETE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION calculate_building_occupancy();

-- Fonction pour calculer automatiquement les fourchettes de prix
CREATE OR REPLACE FUNCTION update_building_price_range()
RETURNS TRIGGER AS $$
BEGIN
    -- Met à jour les fourchettes de prix basées sur les propriétés
    UPDATE buildings
    SET 
        fourchette_prix_min = (
            SELECT MIN(price)
            FROM properties
            WHERE building_id = NEW.building_id AND price > 0
        ),
        fourchette_prix_max = (
            SELECT MAX(price)
            FROM properties
            WHERE building_id = NEW.building_id AND price > 0
        ),
        prix_moyen_m2 = (
            SELECT AVG(price / NULLIF(surface_area, 0))
            FROM properties
            WHERE building_id = NEW.building_id 
                AND price > 0 
                AND surface_area > 0
        )
    WHERE id = NEW.building_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour les prix
DROP TRIGGER IF EXISTS update_building_prices ON properties;
CREATE TRIGGER update_building_prices
    AFTER INSERT OR UPDATE OF price, surface_area OR DELETE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_building_price_range();

-- Ajout de valeurs par défaut pour le type de chauffage et climatisation
UPDATE buildings SET type_chauffage = 'Individuel électrique' WHERE type_chauffage IS NULL;
UPDATE buildings SET type_climatisation = 'Split' WHERE type_climatisation IS NULL;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration complétée avec succès !';
    RAISE NOTICE 'Nouveaux champs ajoutés : 25';
    RAISE NOTICE 'Index créés : 4';
    RAISE NOTICE 'Contraintes ajoutées : 4';
    RAISE NOTICE 'Triggers créés : 2';
END $$;