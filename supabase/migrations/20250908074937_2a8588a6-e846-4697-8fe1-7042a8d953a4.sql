-- Migration: Ajouter les champs manquants à la table developers
-- Date: 2025-01-27

-- Ajouter les nouveaux champs à la table developers
ALTER TABLE developers
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS history TEXT,
ADD COLUMN IF NOT EXISTS main_activities TEXT,
ADD COLUMN IF NOT EXISTS key_projects TEXT,
ADD COLUMN IF NOT EXISTS main_city TEXT CHECK (main_city IN ('Paphos', 'Limassol', 'Les deux', NULL)),
ADD COLUMN IF NOT EXISTS addresses TEXT[],
ADD COLUMN IF NOT EXISTS phone_numbers TEXT[],
ADD COLUMN IF NOT EXISTS email_primary TEXT,
ADD COLUMN IF NOT EXISTS email_sales TEXT,
ADD COLUMN IF NOT EXISTS email_marketing TEXT,
ADD COLUMN IF NOT EXISTS reputation_reviews TEXT,
ADD COLUMN IF NOT EXISTS financial_stability TEXT,
ADD COLUMN IF NOT EXISTS rating_score DECIMAL(3,1) CHECK (rating_score >= 0 AND rating_score <= 10),
ADD COLUMN IF NOT EXISTS rating_justification TEXT,
ADD COLUMN IF NOT EXISTS total_projects INTEGER,
ADD COLUMN IF NOT EXISTS years_experience INTEGER;

-- Ajouter des commentaires pour documenter les champs
COMMENT ON COLUMN developers.founded_year IS 'Année de fondation de l''entreprise';
COMMENT ON COLUMN developers.history IS 'Historique détaillé de l''entreprise';
COMMENT ON COLUMN developers.main_activities IS 'Activités principales du développeur';
COMMENT ON COLUMN developers.key_projects IS 'Liste des projets clés réalisés';
COMMENT ON COLUMN developers.main_city IS 'Ville principale d''opération (Paphos/Limassol/Les deux)';
COMMENT ON COLUMN developers.addresses IS 'Liste des adresses physiques';
COMMENT ON COLUMN developers.phone_numbers IS 'Liste des numéros de téléphone';
COMMENT ON COLUMN developers.email_primary IS 'Email principal de contact';
COMMENT ON COLUMN developers.email_sales IS 'Email du service commercial';
COMMENT ON COLUMN developers.email_marketing IS 'Email du service marketing';
COMMENT ON COLUMN developers.reputation_reviews IS 'Réputation et avis clients';
COMMENT ON COLUMN developers.financial_stability IS 'Évaluation de la stabilité financière';
COMMENT ON COLUMN developers.rating_score IS 'Score de notation sur 10';
COMMENT ON COLUMN developers.rating_justification IS 'Justification du score attribué';
COMMENT ON COLUMN developers.total_projects IS 'Nombre total de projets réalisés';
COMMENT ON COLUMN developers.years_experience IS 'Années d''expérience dans le secteur';

-- Créer un index sur main_city pour les recherches par ville
CREATE INDEX IF NOT EXISTS idx_developers_main_city ON developers(main_city);

-- Créer un index sur rating_score pour les tris
CREATE INDEX IF NOT EXISTS idx_developers_rating_score ON developers(rating_score DESC);