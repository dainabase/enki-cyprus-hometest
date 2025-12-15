# 🏗️ SOLUTION ARCHITECTURE : ÉQUIPEMENTS PROJET vs BÂTIMENT
**Date**: 2025-10-03
**Problème**: Gérer les équipements communs ET privés dans un projet immobilier

---

## 🎯 ANALYSE DU BESOIN RÉEL

### Cas d'usage réels (vos exemples)

```
Projet: Marina Bay Residences

├── Building 1: Tower A (Immeuble)
│   └── Partage: Piscine commune, Gym commun
│
├── Building 2: Tower B (Immeuble)
│   └── Partage: Piscine commune, Gym commun
│
└── Building 3-10: Villas individuelles
    └── Chacune a: Piscine privée, Jardin privé
```

**Constat** :
- ✅ Piscine **commune** (Towers A & B)
- ✅ Piscine **privée** (Villas)
- ✅ Les deux coexistent dans le MÊME projet

---

## 💡 SOLUTION RECOMMANDÉE : ARCHITECTURE À 3 NIVEAUX

### Niveau 1 : PROJECT (Équipements communs partagés)
**Principe** : Ce que TOUS les résidents du projet peuvent utiliser

```sql
projects.has_shared_pool        -- Piscine commune à tout le projet
projects.has_shared_gym         -- Gym commun
projects.has_shared_spa         -- Spa commun
projects.has_tennis_court       -- Court de tennis commun
projects.club_house             -- Club house commun
```

### Niveau 2 : BUILDING (Équipements spécifiques au bâtiment)
**Principe** : Ce qui est EXCLUSIF à ce bâtiment/groupe de villas

```sql
buildings.has_private_pool      -- Piscine privée (villa)
buildings.has_private_gym       -- Gym privé (penthouse)
buildings.has_private_garden    -- Jardin privé
buildings.has_rooftop_terrace   -- Terrasse toit
```

### Niveau 3 : PROPERTY (Équipements dans l'unité)
**Principe** : Ce qui est À L'INTÉRIEUR de l'appartement/villa

```sql
properties.has_private_pool     -- Piscine privée villa
properties.has_jacuzzi          -- Jacuzzi dans l'unité
properties.has_sauna            -- Sauna privé
properties.has_fireplace        -- Cheminée
```

---

## 📋 MAPPING COMPLET DES ÉQUIPEMENTS

### Catégorie A : ÉQUIPEMENTS COMMUNS UNIQUEMENT (Niveau PROJECT)

Ces équipements sont TOUJOURS partagés par tous les bâtiments :

| Équipement | Champ Project | Pourquoi Commun |
|------------|---------------|-----------------|
| Court de tennis | `has_tennis_court` | Infrastructure partagée |
| Club house | `club_house` | Centre social commun |
| Restaurant | `restaurant` | Service commun |
| Café | `cafe` | Service commun |
| Mini market | `mini_market` | Commerce commun |
| Business center | `business_center` | Espace travail partagé |
| Kids club | `kids_club` | Garderie commune |
| Beach access | `beach_access` | Accès plage commun |
| Marina access | `marina_access` | Accès marina commun |
| Golf course | `golf_course` | Parcours commun |
| Shuttle service | `shuttle_service` | Navette commune |
| Coworking space | `coworking_space` | Espace travail partagé |

**Total Niveau PROJECT** : **12 champs**

---

### Catégorie B : ÉQUIPEMENTS MIXTES (Niveaux PROJECT + BUILDING)

Ces équipements peuvent être COMMUNS ou PRIVÉS selon le bâtiment :

| Équipement | Champ Project (Commun) | Champ Building (Privé) | Exemple |
|------------|------------------------|------------------------|---------|
| **Piscine** | `has_shared_pool` | `has_private_pool` | Piscine commune Tours A/B + Piscines privées villas |
| **Gym** | `has_shared_gym` | `has_private_gym` | Gym commun + Gym privé penthouse |
| **Spa** | `has_shared_spa` | `has_private_spa` | Spa commun + Spa privé villa luxe |
| **Jardin** | `has_shared_garden` | `has_private_garden` | Jardin partagé + Jardins privés villas |
| **Playground** | `has_shared_playground` | `has_private_playground` | Aire de jeu commune + Aire privée villa |

**Total Catégorie B** :
- **5 champs** dans `projects` (version shared)
- **5 champs** dans `buildings` (version private)

---

### Catégorie C : ÉQUIPEMENTS BÂTIMENT UNIQUEMENT (Niveau BUILDING)

Ces équipements sont spécifiques à chaque bâtiment :

| Équipement | Champ Building | Pourquoi Bâtiment |
|------------|----------------|-------------------|
| Nombre d'ascenseurs | `elevator_count` | Varie par immeuble |
| Type de parking | `parking_type` | Varie par bâtiment |
| Classe énergétique | `energy_certificate` | Certification par bâtiment |
| Terrasse toit | `has_rooftop_terrace` | Spécifique penthouse |
| Local vélos | `local_velos` | Par immeuble |
| Local poussettes | `local_poussettes` | Par immeuble |
| Caves | `nombre_caves` | Par immeuble |

**Total Niveau BUILDING** : **~15 champs techniques**

---

### Catégorie D : INFRASTRUCTURES & SÉCURITÉ (Niveaux PROJECT + BUILDING)

| Infrastructure | Champ Project (Commun) | Champ Building (Privé) |
|----------------|------------------------|------------------------|
| **Générateur** | `has_shared_generator` | `has_backup_generator` |
| **Panneaux solaires** | `has_shared_solar_panels` | `has_private_solar_panels` |
| **Sécurité 24/7** | `has_security_24_7` | - (toujours commun) |
| **CCTV** | `has_shared_cctv` | `has_private_cctv` |
| **Système sécurité** | `has_security_system` | - (toujours commun) |
| **Concierge** | `has_concierge` | - (toujours commun) |

**Total Catégorie D** :
- **6 champs** dans `projects`
- **2 champs** dans `buildings`

---

## 📊 RÉCAPITULATIF FINAL

### Répartition des champs

| Niveau | Équipements Communs | Équipements Privés | Total |
|--------|--------------------|--------------------|-------|
| **PROJECT** | 23 champs | - | 23 |
| **BUILDING** | - | 22 champs | 22 |
| **PROPERTY** | - | ~15 champs | 15 |

### Nommage clair

```sql
-- ✅ PROJET (Commun/Partagé)
projects.has_shared_pool
projects.has_shared_gym
projects.has_shared_spa
projects.has_shared_garden
projects.has_shared_playground
projects.has_shared_generator
projects.has_shared_solar_panels
projects.has_shared_cctv

-- ✅ BÂTIMENT (Privé/Exclusif)
buildings.has_private_pool
buildings.has_private_gym
buildings.has_private_spa
buildings.has_private_garden
buildings.has_private_playground
buildings.has_backup_generator
buildings.has_private_solar_panels
buildings.has_private_cctv

-- ✅ BÂTIMENT (Technique)
buildings.elevator_count
buildings.parking_type
buildings.energy_certificate
buildings.has_rooftop_terrace
buildings.local_velos
buildings.local_poussettes
```

---

## 🎨 INTERFACE UTILISATEUR

### Formulaire Project

```
┌─ ÉQUIPEMENTS COMMUNS (Partagés par tous) ────────┐
│                                                    │
│ ☑ Piscine commune                                 │
│ ☑ Gym commun                                      │
│ ☑ Spa commun                                      │
│ ☑ Jardin partagé                                  │
│ ☑ Aire de jeu commune                             │
│ ☑ Court de tennis                                 │
│ ☑ Club house                                      │
│ ☑ Restaurant                                      │
│ ☑ Sécurité 24/7                                   │
│ ☑ CCTV commun                                     │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Formulaire Building

```
┌─ ÉQUIPEMENTS PRIVÉS (Exclusifs à ce bâtiment) ───┐
│                                                    │
│ Type: ▼ Villa individuelle                        │
│                                                    │
│ ☑ Piscine privée                                  │
│ ☑ Jardin privé                                    │
│ ☐ Gym privé                                       │
│ ☐ Spa privé                                       │
│ ☐ Terrasse toit                                   │
│                                                    │
│ ─────────────────────────────────────────         │
│                                                    │
│ TECHNIQUE                                          │
│ Ascenseurs: [2]                                   │
│ Parking: ▼ Souterrain                             │
│ Certificat énergétique: ▼ A                       │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Affichage pour l'acheteur

```
Villa 12 - Marina Bay Residences

✨ ÉQUIPEMENTS PRIVÉS (Votre villa)
✅ Piscine privée 8x4m
✅ Jardin privé 150m²
✅ Terrasse 40m²

🏘️ ÉQUIPEMENTS COMMUNS (Projet)
✅ Piscine commune olympique
✅ Gym équipé
✅ Spa & Hammam
✅ Court de tennis
✅ Club house
✅ Restaurant
✅ Sécurité 24/7
```

---

## 🔧 MIGRATIONS SQL

### Migration 1 : Renommer les champs PROJECT (Ajouter "shared_")

```sql
-- 20251003_rename_project_amenities_to_shared.sql

/*
  # Rename Project Amenities to Shared (Explicit Naming)

  ## Changes
  Renames amenity fields in projects table to make it explicit they are SHARED.
  Example: has_pool → has_shared_pool

  This clarifies that these amenities are common to ALL buildings in the project.
*/

-- Step 1: Add new "shared_" columns
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS has_shared_pool BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_shared_gym BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_shared_spa BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_shared_garden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_shared_playground BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_shared_generator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_shared_solar_panels BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_shared_cctv BOOLEAN DEFAULT false;

-- Step 2: Copy data from old columns to new columns
UPDATE projects
SET
  has_shared_pool = COALESCE(has_pool, false),
  has_shared_gym = COALESCE(has_gym, false),
  has_shared_spa = COALESCE(has_spa, false),
  has_shared_garden = COALESCE(has_garden, false),
  has_shared_playground = COALESCE(has_playground, false),
  has_shared_generator = COALESCE(has_generator, false),
  has_shared_solar_panels = COALESCE(has_solar_panels, false),
  has_shared_cctv = COALESCE(has_cctv, false);

-- Step 3: Keep old columns for backward compatibility (can drop later)
COMMENT ON COLUMN projects.has_pool IS
  'DEPRECATED: Use has_shared_pool instead';
COMMENT ON COLUMN projects.has_gym IS
  'DEPRECATED: Use has_shared_gym instead';
```

### Migration 2 : Renommer les champs BUILDING (Ajouter "private_")

```sql
-- 20251003_rename_building_amenities_to_private.sql

/*
  # Rename Building Amenities to Private (Explicit Naming)

  ## Changes
  Renames amenity fields in buildings table to make it explicit they are PRIVATE.
  Example: has_pool → has_private_pool

  This clarifies that these amenities are EXCLUSIVE to this specific building.
*/

-- Step 1: Add new "private_" columns
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS has_private_pool BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_private_gym BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_private_spa BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_private_garden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_private_playground BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_backup_generator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_private_solar_panels BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_private_cctv BOOLEAN DEFAULT false;

-- Step 2: Copy data from old columns
UPDATE buildings
SET
  has_private_pool = COALESCE(has_pool, false),
  has_private_gym = COALESCE(has_gym, false),
  has_private_spa = COALESCE(has_spa, false),
  has_private_garden = COALESCE(has_garden, false),
  has_private_playground = COALESCE(has_playground, false),
  has_backup_generator = COALESCE(has_generator, false),
  has_private_solar_panels = COALESCE(has_solar_panels, false),
  has_private_cctv = COALESCE(has_cctv, false);

-- Step 3: Keep old columns temporarily
COMMENT ON COLUMN buildings.has_pool IS
  'DEPRECATED: Use has_private_pool instead';
```

### Migration 3 : Ajouter les 32 champs manquants

```sql
-- 20251003_add_missing_building_fields.sql

/*
  # Add Missing Building Fields

  Adds 32 technical fields that exist in TypeScript but are missing from database.
*/

ALTER TABLE buildings
-- Dimensions & Position
ADD COLUMN IF NOT EXISTS surface_totale_batiment DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS hauteur_batiment DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS position_dans_projet TEXT,
ADD COLUMN IF NOT EXISTS orientation_principale TEXT,
ADD COLUMN IF NOT EXISTS vues_principales JSONB DEFAULT '[]',

-- Parking détaillé
ADD COLUMN IF NOT EXISTS nombre_places_parking INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS parking_visiteurs INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS disabled_parking_spaces INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS nombre_box_fermes INTEGER DEFAULT 0,

-- Commercialisation
ADD COLUMN IF NOT EXISTS prix_moyen_m2 DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS fourchette_prix_min DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS fourchette_prix_max DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS taux_occupation DECIMAL(5,2)
  CHECK (taux_occupation >= 0 AND taux_occupation <= 100),
ADD COLUMN IF NOT EXISTS date_mise_en_vente DATE,
ADD COLUMN IF NOT EXISTS nombre_logements_type JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS configuration_etages JSONB DEFAULT '{}',

-- Technique
ADD COLUMN IF NOT EXISTS type_chauffage TEXT,
ADD COLUMN IF NOT EXISTS type_climatisation TEXT,
ADD COLUMN IF NOT EXISTS annee_construction INTEGER
  CHECK (annee_construction >= 1900 AND annee_construction <= 2100),
ADD COLUMN IF NOT EXISTS annee_renovation INTEGER
  CHECK (annee_renovation >= 1900 AND annee_renovation <= 2100),
ADD COLUMN IF NOT EXISTS norme_construction TEXT,

-- Locaux annexes
ADD COLUMN IF NOT EXISTS nombre_caves INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS surface_caves DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS local_velos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS local_poussettes BOOLEAN DEFAULT false,

-- Copropriété
ADD COLUMN IF NOT EXISTS nombre_lots INTEGER DEFAULT 0,

-- Infrastructure bâtiment
ADD COLUMN IF NOT EXISTS has_elevator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_intercom BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS central_vacuum_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS water_softener_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS water_purification_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS smart_building_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS package_room BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pet_washing_station BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS car_wash_area BOOLEAN DEFAULT false,

-- Bâtiment spécifique
ADD COLUMN IF NOT EXISTS has_rooftop_terrace BOOLEAN DEFAULT false;

-- Add comments
COMMENT ON COLUMN buildings.has_private_pool IS
  'Private pool exclusive to this building (e.g., villa private pool)';

COMMENT ON COLUMN buildings.has_rooftop_terrace IS
  'Rooftop terrace (typically for penthouses or villa complex)';

COMMENT ON COLUMN buildings.nombre_logements_type IS
  'JSONB: Distribution of unit types {studios: 2, t2: 5, t3: 8, etc.}';

COMMENT ON COLUMN buildings.configuration_etages IS
  'JSONB: Floor configuration {RDC: {t2: 2}, Etage1: {t3: 4}, etc.}';
```

---

## 📱 MISE À JOUR DU CODE TYPESCRIPT

### Types mis à jour

```typescript
// types/project.ts
export interface Project {
  // Équipements COMMUNS (partagés)
  has_shared_pool?: boolean;
  has_shared_gym?: boolean;
  has_shared_spa?: boolean;
  has_shared_garden?: boolean;
  has_shared_playground?: boolean;
  has_shared_generator?: boolean;
  has_shared_solar_panels?: boolean;
  has_shared_cctv?: boolean;

  // Services communs (toujours partagés)
  has_tennis_court?: boolean;
  club_house?: boolean;
  restaurant?: boolean;
  cafe?: boolean;
  mini_market?: boolean;
  business_center?: boolean;
  kids_club?: boolean;
  beach_access?: boolean;
  marina_access?: boolean;
  golf_course?: boolean;
  shuttle_service?: boolean;
  coworking_space?: boolean;

  // Sécurité commune
  has_security_24_7?: boolean;
  has_security_system?: boolean;
  has_concierge?: boolean;
}

// types/building.ts
export interface Building {
  // Équipements PRIVÉS (exclusifs à ce bâtiment)
  has_private_pool?: boolean;
  has_private_gym?: boolean;
  has_private_spa?: boolean;
  has_private_garden?: boolean;
  has_private_playground?: boolean;
  has_backup_generator?: boolean;
  has_private_solar_panels?: boolean;
  has_private_cctv?: boolean;

  // Technique bâtiment
  elevator_count?: number;
  parking_type?: 'underground' | 'outdoor' | 'covered';
  energy_certificate?: string;
  has_rooftop_terrace?: boolean;

  // Infrastructure bâtiment
  has_elevator?: boolean;
  has_intercom?: boolean;
  central_vacuum_system?: boolean;
  water_softener_system?: boolean;
  smart_building_system?: boolean;
  package_room?: boolean;
  local_velos?: boolean;
  local_poussettes?: boolean;

  // Nouveaux champs
  surface_totale_batiment?: number;
  hauteur_batiment?: number;
  nombre_places_parking?: number;
  prix_moyen_m2?: number;
  // ... (tous les 32 nouveaux champs)
}
```

---

## 🎯 AVANTAGES DE CETTE SOLUTION

### ✅ Clarté absolue

```typescript
// ✅ CLAIR: On sait immédiatement que c'est partagé
project.has_shared_pool

// ✅ CLAIR: On sait que c'est privé/exclusif
building.has_private_pool

// ❌ ANCIEN: Ambigu
project.has_pool  // Commun ou privé??
building.has_pool // Commun ou privé??
```

### ✅ Flexibilité totale

```typescript
// Projet avec TOUT en commun
project.has_shared_pool = true;
building.has_private_pool = false;

// Villa avec piscine privée UNIQUEMENT
project.has_shared_pool = false;
building.has_private_pool = true;

// Les DEUX (cas complexe)
project.has_shared_pool = true;  // Piscine commune
building.has_private_pool = true; // + Piscine privée villa
```

### ✅ Requêtes SQL expressives

```sql
-- Trouver tous les projets avec piscine commune
SELECT * FROM projects WHERE has_shared_pool = true;

-- Trouver tous les bâtiments avec piscine privée
SELECT * FROM buildings WHERE has_private_pool = true;

-- Afficher TOUS les équipements d'un bâtiment (communs + privés)
SELECT
  b.*,
  p.has_shared_pool,
  p.has_shared_gym,
  p.has_shared_spa
FROM buildings b
JOIN projects p ON b.project_id = p.id
WHERE b.id = 'xxx';
```

---

## 📊 COMPARAISON AVANT/APRÈS

### AVANT (Ambigu)

```
Project: has_pool = true
Building 1: has_pool = true
Building 2: has_pool = false

❓ Questions:
- Le projet a-t-il UNE piscine commune ou plusieurs privées?
- Building 1 a sa propre piscine ou utilise celle du projet?
- Building 2 n'a vraiment pas de piscine ou utilise celle du projet?
```

### APRÈS (Explicite)

```
Project: has_shared_pool = true (Piscine commune 20x10m)
Building 1: has_private_pool = false (Utilise la commune)
Building 2: has_private_pool = true (Piscine privée 8x4m)

✅ Réponses claires:
- Le projet a UNE piscine commune
- Building 1 n'a pas de piscine privée, utilise la commune
- Building 2 a une piscine privée EN PLUS de la commune
```

---

## ✅ CONCLUSION

Cette solution offre :

1. ✅ **Clarté** : Nommage explicite (shared vs private)
2. ✅ **Flexibilité** : Gère tous les cas (commun, privé, les deux)
3. ✅ **Pas de redondance** : Chaque donnée a UNE seule source
4. ✅ **Extensibilité** : Facile d'ajouter de nouveaux équipements
5. ✅ **Performance** : Requêtes SQL simples et rapides

---

**Prochaine étape** : Appliquer les 3 migrations dans l'ordre.
