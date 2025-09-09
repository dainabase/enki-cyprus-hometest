-- Ajouter des champs manquants pour une gestion complète des projets immobiliers
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS building_certification text,
ADD COLUMN IF NOT EXISTS construction_year integer,
ADD COLUMN IF NOT EXISTS renovation_year integer,
ADD COLUMN IF NOT EXISTS maintenance_fees_yearly numeric(10,2),
ADD COLUMN IF NOT EXISTS property_tax_yearly numeric(10,2),
ADD COLUMN IF NOT EXISTS hoa_fees_monthly numeric(10,2),
ADD COLUMN IF NOT EXISTS building_insurance text,
ADD COLUMN IF NOT EXISTS seismic_rating text,
ADD COLUMN IF NOT EXISTS accessibility_features text[],
ADD COLUMN IF NOT EXISTS internet_speed_mbps integer,
ADD COLUMN IF NOT EXISTS pet_policy text,
ADD COLUMN IF NOT EXISTS smoking_policy text;

-- Ajouter des commentaires pour clarifier l'usage des champs
COMMENT ON COLUMN public.projects.energy_rating IS 'Classe énergétique du bâtiment (A+, A, B, C, D, E, F, G)';
COMMENT ON COLUMN public.projects.building_certification IS 'Certifications du bâtiment (BREEAM, LEED, etc.)';
COMMENT ON COLUMN public.projects.construction_year IS 'Année de construction du bâtiment';
COMMENT ON COLUMN public.projects.renovation_year IS 'Année de la dernière rénovation majeure';
COMMENT ON COLUMN public.projects.maintenance_fees_yearly IS 'Frais de maintenance annuels en euros';
COMMENT ON COLUMN public.projects.property_tax_yearly IS 'Taxe foncière annuelle en euros';
COMMENT ON COLUMN public.projects.hoa_fees_monthly IS 'Charges de copropriété mensuelles en euros';
COMMENT ON COLUMN public.projects.building_insurance IS 'Type d assurance bâtiment';
COMMENT ON COLUMN public.projects.seismic_rating IS 'Niveau de résistance sismique';
COMMENT ON COLUMN public.projects.accessibility_features IS 'Caractéristiques d accessibilité (ascenseur, rampes, etc.)';
COMMENT ON COLUMN public.projects.internet_speed_mbps IS 'Vitesse internet disponible en Mbps';
COMMENT ON COLUMN public.projects.pet_policy IS 'Politique concernant les animaux domestiques';
COMMENT ON COLUMN public.projects.smoking_policy IS 'Politique concernant le tabac';