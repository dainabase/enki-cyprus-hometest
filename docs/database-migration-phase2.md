# Phase 2 - Migration Base de Données Supabase

## 📋 Vue d'ensemble

Ce document détaille la migration complète de la base de données Supabase pour supporter toutes les fonctionnalités de la page template NKREALTY haute conversion.

**Status actuel:** ✅ Phase 1 terminée (Mock data)
**Phase suivante:** Migration BDD avec nouveaux champs/relations

---

## 🎯 Objectifs Phase 2

1. **Ajouter champs manquants P0** (critiques pour conversion)
2. **Créer nouvelles tables relations** (testimonials, awards, press)
3. **Optimiser requêtes** (index, vues matérialisées)
4. **Préparer admin UI** (peuplement données)

---

## 🔴 P0 - MODIFICATIONS CRITIQUES (PRIORITÉ ABSOLUE)

### 1. Extension Table `properties` - Plans & Typologies

**Problème:** Section 5 (Plans) manque champs visuels et stock temps réel

```sql
-- Migration: 001_add_floorplans_to_properties.sql

ALTER TABLE properties 
ADD COLUMN floor_plan_2d TEXT,              -- URL PDF plan 2D
ADD COLUMN floor_plan_3d TEXT,              -- URL image plan 3D
ADD COLUMN floor_plan_thumbnail TEXT,       -- URL miniature aperçu
ADD COLUMN surface_total NUMERIC,           -- Surface totale (interne + terrasses)
ADD COLUMN view_3d_url TEXT;                -- URL visite virtuelle 3D unité

COMMENT ON COLUMN properties.floor_plan_2d IS 'URL du plan 2D technique (PDF)';
COMMENT ON COLUMN properties.floor_plan_3d IS 'URL du plan 3D visuel (JPG/PNG)';
COMMENT ON COLUMN properties.surface_total IS 'Surface totale = internal_area + covered_verandas + uncovered_verandas';

-- Trigger auto-calcul surface_total
CREATE OR REPLACE FUNCTION calculate_surface_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.surface_total := COALESCE(NEW.internal_area, 0) 
                     + COALESCE(NEW.covered_verandas, 0) 
                     + COALESCE(NEW.uncovered_verandas, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_surface_total
BEFORE INSERT OR UPDATE OF internal_area, covered_verandas, uncovered_verandas
ON properties
FOR EACH ROW
EXECUTE FUNCTION calculate_surface_total();

-- Backfill surfaces existantes
UPDATE properties 
SET surface_total = COALESCE(internal_area, 0) 
                  + COALESCE(covered_verandas, 0) 
                  + COALESCE(uncovered_verandas, 0)
WHERE surface_total IS NULL;
```

### 2. Extension Table `projects` - Investissement

**Problème:** Section 7 (Financement) manque détails Golden Visa et fiscalité

```sql
-- Migration: 002_add_investment_fields_to_projects.sql

ALTER TABLE projects
ADD COLUMN rental_price_monthly_estimate NUMERIC, -- Loyer mensuel estimé
ADD COLUMN appreciation_historical_percent NUMERIC, -- Plus-value historique %
ADD COLUMN golden_visa_details JSONB DEFAULT '{}'::jsonb,
ADD COLUMN tax_benefits JSONB DEFAULT '[]'::jsonb,
ADD COLUMN financing_options JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN projects.rental_price_monthly_estimate IS 'Estimation loyer mensuel pour calcul rendement';
COMMENT ON COLUMN projects.appreciation_historical_percent IS 'Appréciation moyenne annuelle zone (historique 5 ans)';
COMMENT ON COLUMN projects.golden_visa_details IS 'JSON: {minimumInvestment, benefits[], requirements[], processingTime}';
COMMENT ON COLUMN projects.tax_benefits IS 'JSON array: [{type, description, savingEstimate%}]';
COMMENT ON COLUMN projects.financing_options IS 'JSON: {partners[], downPaymentMin%, flexiblePayment}';

-- Exemple structure golden_visa_details
/*
{
  "minimumInvestment": 300000,
  "eligible": true,
  "benefits": [
    "Résidence permanente UE pour toute la famille",
    "Liberté circulation Espace Schengen"
  ],
  "requirements": [
    "Achat immobilier minimum €300,000",
    "Visite Cyprus tous les 2 ans"
  ],
  "processingTime": "2-3 mois",
  "applicationFee": 500
}
*/

-- Exemple structure tax_benefits
/*
[
  {
    "type": "Plus-value",
    "description": "Exonération totale si détention >5 ans",
    "savingEstimate": 20
  },
  {
    "type": "Revenus locatifs",
    "description": "Imposition 20% flat (vs 45% France)",
    "savingEstimate": 25
  }
]
*/
```

### 3. Nouvelle Table `testimonials` - Preuve Sociale

**Problème:** Section 10 (Crédibilité) complètement absente

```sql
-- Migration: 003_create_testimonials_table.sql

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  
  -- Identité client
  name TEXT NOT NULL,
  nationality TEXT,
  flag_emoji TEXT, -- 🇫🇷, 🇧🇪, etc.
  photo_url TEXT,
  
  -- Témoignage
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  date DATE DEFAULT CURRENT_DATE,
  
  -- Vidéo (CRITIQUE pour conversion)
  video_url TEXT,
  video_thumbnail_url TEXT,
  video_duration INTEGER, -- secondes
  
  -- Contexte achat
  property_type TEXT, -- '2BR Apartment', 'Villa 3BR'
  location TEXT, -- Ville/Zone
  
  -- Validation
  verified BOOLEAN DEFAULT false,
  verification_method TEXT, -- 'video_call', 'document', 'in_person'
  
  -- Metadata
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'fr',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_testimonials_project ON testimonials(project_id);
CREATE INDEX idx_testimonials_developer ON testimonials(developer_id);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;
CREATE INDEX idx_testimonials_rating ON testimonials(rating DESC);

COMMENT ON TABLE testimonials IS 'Témoignages clients avec vidéos pour preuve sociale';
COMMENT ON COLUMN testimonials.video_url IS 'URL vidéo YouTube/Vimeo - CRITIQUE pour conversion +68%';
COMMENT ON COLUMN testimonials.verified IS 'Témoignage vérifié authentique par équipe';
```

### 4. Extension Table `developers` - Stats & Crédibilité

```sql
-- Migration: 004_add_developer_stats.sql

ALTER TABLE developers
ADD COLUMN revenue_annual BIGINT,            -- Chiffre affaires annuel €
ADD COLUMN employees_count INTEGER,          -- Nombre employés
ADD COLUMN families_satisfied INTEGER,       -- Familles satisfaites
ADD COLUMN units_built INTEGER,              -- Unités construites total
ADD COLUMN satisfaction_rate NUMERIC(4,2);   -- Taux satisfaction %

COMMENT ON COLUMN developers.revenue_annual IS 'CA annuel (€) pour crédibilité financière';
COMMENT ON COLUMN developers.families_satisfied IS 'Nombre familles ayant acheté (social proof)';
```

### 5. Nouvelle Table `awards` - Prix & Certifications

```sql
-- Migration: 005_create_awards_table.sql

CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL, -- Optionnel
  
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT,
  organization TEXT, -- 'Cyprus Property Awards', 'European Property Awards'
  
  image_url TEXT,
  logo_url TEXT,
  certificate_url TEXT,
  
  description TEXT,
  
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_awards_developer ON awards(developer_id);
CREATE INDEX idx_awards_project ON awards(project_id);
CREATE INDEX idx_awards_year ON awards(year DESC);

COMMENT ON TABLE awards IS 'Prix et certifications promoteur/projet pour crédibilité';
```

### 6. Nouvelle Table `press_mentions` - Couverture Médias

```sql
-- Migration: 006_create_press_mentions_table.sql

CREATE TABLE press_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  media_name TEXT NOT NULL, -- 'Financial Mirror', 'Cyprus Mail'
  media_logo_url TEXT,
  
  article_title TEXT NOT NULL,
  article_url TEXT NOT NULL,
  article_excerpt TEXT,
  
  publish_date DATE,
  
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_press_developer ON press_mentions(developer_id);
CREATE INDEX idx_press_project ON press_mentions(project_id);
CREATE INDEX idx_press_date ON press_mentions(publish_date DESC);

COMMENT ON TABLE press_mentions IS 'Articles presse médias reconnus pour crédibilité';
```

---

## 🟡 P1 - OPTIMISATIONS IMPORTANTES

### 7. Extension `proximities` - Temps Trajet

```sql
-- Migration: 007_enhance_proximities.sql

-- Ajouter temps trajet aux proximités existantes
ALTER TABLE project_nearby_amenities
ADD COLUMN travel_time_car INTEGER,         -- Minutes en voiture
ADD COLUMN travel_time_walk INTEGER,        -- Minutes à pied
ADD COLUMN travel_time_bike INTEGER,        -- Minutes à vélo
ADD COLUMN travel_time_public INTEGER;      -- Minutes transport public

COMMENT ON COLUMN project_nearby_amenities.travel_time_car IS 'Temps trajet voiture (minutes)';
```

### 8. Extension `amenities` - Dimensions

```sql
-- Migration: 008_add_amenity_dimensions.sql

ALTER TABLE project_amenities
ADD COLUMN size_value NUMERIC,               -- Valeur numérique
ADD COLUMN size_unit TEXT,                   -- 'm2', 'm', 'places'
ADD COLUMN capacity INTEGER,                 -- Capacité personnes
ADD COLUMN opening_hours TEXT;               -- Horaires disponibilité

COMMENT ON COLUMN project_amenities.size_value IS 'Dimension/taille équipement (ex: piscine 25m)';
```

### 9. Nouvelle Table `specifications` - Finitions

```sql
-- Migration: 009_create_specifications_table.sql

CREATE TABLE project_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  category TEXT NOT NULL, -- 'kitchen', 'bathroom', 'flooring', 'windows', 'hvac', 'security'
  
  -- Cuisine
  kitchen_brand TEXT,
  kitchen_countertop TEXT,
  kitchen_appliances JSONB DEFAULT '[]'::jsonb,
  
  -- Salle bain
  bathroom_brand TEXT,
  bathroom_fixtures TEXT,
  bathroom_features JSONB DEFAULT '[]'::jsonb,
  
  -- Sols
  flooring_living TEXT,
  flooring_bedrooms TEXT,
  flooring_bathrooms TEXT,
  
  -- Fenêtres
  windows_type TEXT,
  windows_features JSONB DEFAULT '[]'::jsonb,
  
  -- HVAC
  hvac_type TEXT,
  hvac_heating TEXT,
  hvac_control TEXT,
  
  -- Sécurité
  security_door TEXT,
  security_intercom TEXT,
  security_alarm TEXT,
  security_cctv TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_specifications_project ON project_specifications(project_id);
```

### 10. Performance Énergétique Structurée

```sql
-- Migration: 010_create_energy_performance_table.sql

CREATE TABLE project_energy_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Certification
  rating_class VARCHAR(2) CHECK (rating_class IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G')),
  dpe_score INTEGER,
  
  -- Consommation
  consumption_kwh_per_m2 NUMERIC,
  consumption_co2_kg_per_m2 NUMERIC,
  
  -- Systèmes
  has_solar_panels BOOLEAN DEFAULT false,
  solar_capacity_kw NUMERIC,
  has_heat_pump BOOLEAN DEFAULT false,
  has_thermal_insulation BOOLEAN DEFAULT true,
  
  -- Certifications
  certifications JSONB DEFAULT '[]'::jsonb,
  
  certificate_number TEXT,
  certificate_date DATE,
  certificate_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_energy_project ON project_energy_performance(project_id);
```

### 11. Timeline Construction

```sql
-- Migration: 011_create_construction_timeline.sql

CREATE TABLE construction_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  phase_name TEXT NOT NULL,
  phase_order INTEGER NOT NULL,
  
  status TEXT CHECK (status IN ('upcoming', 'in_progress', 'completed', 'delayed')),
  
  start_date DATE,
  end_date DATE,
  completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  milestones JSONB DEFAULT '[]'::jsonb, -- [{description, date, completed}]
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phases_project ON construction_phases(project_id);
CREATE INDEX idx_phases_order ON construction_phases(phase_order);
```

---

## 🟢 P2 - NICE TO HAVE

### 12. Équipe Promoteur

```sql
-- Migration: 012_create_developer_team_table.sql

CREATE TABLE developer_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  
  linkedin_url TEXT,
  
  display_order INTEGER DEFAULT 0,
  is_key_member BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📊 Vues Matérialisées - Performance

### Vue Agrégée Projet Complet

```sql
-- Migration: 020_create_materialized_views.sql

CREATE MATERIALIZED VIEW project_complete_view AS
SELECT 
  p.*,
  
  -- Developer info
  d.name as developer_name,
  d.logo as developer_logo,
  d.rating_score as developer_rating,
  
  -- Stats unités
  COUNT(DISTINCT pr.id) as total_properties,
  COUNT(DISTINCT pr.id) FILTER (WHERE pr.property_status = 'available') as available_properties,
  COUNT(DISTINCT pr.id) FILTER (WHERE pr.property_status = 'sold') as sold_properties,
  
  -- Testimonials
  COUNT(DISTINCT t.id) as testimonials_count,
  AVG(t.rating) as avg_testimonial_rating,
  
  -- Awards
  COUNT(DISTINCT a.id) as awards_count,
  
  -- Press
  COUNT(DISTINCT pm.id) as press_mentions_count
  
FROM projects p
LEFT JOIN developers d ON p.developer_id = d.id
LEFT JOIN properties pr ON pr.project_id = p.id
LEFT JOIN testimonials t ON t.project_id = p.id
LEFT JOIN awards a ON a.project_id = p.id
LEFT JOIN press_mentions pm ON pm.project_id = p.id
GROUP BY p.id, d.name, d.logo, d.rating_score;

CREATE UNIQUE INDEX ON project_complete_view (id);

-- Refresh automatique toutes les heures
CREATE OR REPLACE FUNCTION refresh_project_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY project_complete_view;
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 Scripts d'Exécution

### Ordre d'exécution migrations

```bash
# Phase 2A - Modifications critiques P0 (1-6)
psql $DATABASE_URL -f migrations/001_add_floorplans_to_properties.sql
psql $DATABASE_URL -f migrations/002_add_investment_fields_to_projects.sql
psql $DATABASE_URL -f migrations/003_create_testimonials_table.sql
psql $DATABASE_URL -f migrations/004_add_developer_stats.sql
psql $DATABASE_URL -f migrations/005_create_awards_table.sql
psql $DATABASE_URL -f migrations/006_create_press_mentions_table.sql

# Phase 2B - Optimisations P1 (7-11)
psql $DATABASE_URL -f migrations/007_enhance_proximities.sql
psql $DATABASE_URL -f migrations/008_add_amenity_dimensions.sql
psql $DATABASE_URL -f migrations/009_create_specifications_table.sql
psql $DATABASE_URL -f migrations/010_create_energy_performance_table.sql
psql $DATABASE_URL -f migrations/011_create_construction_timeline.sql

# Phase 2C - Nice to have P2 (12+)
psql $DATABASE_URL -f migrations/012_create_developer_team_table.sql

# Phase 2D - Performance
psql $DATABASE_URL -f migrations/020_create_materialized_views.sql
```

### Via Supabase Dashboard

1. Aller à **Database** → **SQL Editor**
2. Copier/coller contenu migrations dans l'ordre
3. Exécuter une par une
4. Vérifier succès avant suivante

---

## ✅ Checklist Validation Phase 2

### Après chaque migration

- [ ] Migration exécutée sans erreur
- [ ] Données existantes non corrompues
- [ ] Index créés correctement
- [ ] Contraintes fonctionnent
- [ ] RLS policies ajustées si nécessaire
- [ ] Documentation API mise à jour

### Tests end-to-end

- [ ] Récupération projet enrichi fonctionne
- [ ] Toutes relations chargent correctement
- [ ] Performance acceptable (<500ms)
- [ ] Mock data peut être remplacé progressivement

---

## 🔄 Rollback Plan

En cas de problème:

```sql
-- Rollback exemple pour testimonials
DROP TABLE IF EXISTS testimonials CASCADE;

-- Rollback champs projects
ALTER TABLE projects 
DROP COLUMN IF EXISTS rental_price_monthly_estimate,
DROP COLUMN IF EXISTS appreciation_historical_percent,
DROP COLUMN IF EXISTS golden_visa_details,
DROP COLUMN IF EXISTS tax_benefits,
DROP COLUMN IF EXISTS financing_options;
```

---

## 📝 Notes Importantes

1. **Backup obligatoire** avant toute migration production
2. **Tester sur staging** d'abord
3. **Migrations incrémentales** - possibilité rollback individuel
4. **RLS policies** à mettre à jour pour nouvelles tables
5. **API types TypeScript** à regénérer après migrations

---

## 🎯 Prochaines Étapes

Après Phase 2 migration:

1. **Phase 3A** - Créer interface admin peuplement données
2. **Phase 3B** - Import progressif données réelles
3. **Phase 3C** - Tests A/B sections critiques
4. **Phase 3D** - Optimisation conversion finale

---

**Document créé:** Phase 1
**Dernière mise à jour:** 2025-01-04
**Auteur:** Claude AI + NKREALTY Team