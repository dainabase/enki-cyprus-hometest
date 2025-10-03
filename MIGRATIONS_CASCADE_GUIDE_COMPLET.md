# 🚀 GUIDE COMPLET : MIGRATIONS CASCADE ENKI REALITY
**Date**: 2025-10-03
**Version**: 1.0.0

---

## 📋 RÉSUMÉ EXÉCUTIF

Ce guide documente les **7 migrations SQL** créées pour implémenter l'architecture CASCADE complète d'Enki Reality Cyprus.

### **Objectif global**
Transformer la base de données actuelle (héritages manuels) en architecture CASCADE automatique où :
- ✅ Les properties **héritent** automatiquement de developer, project, building
- ✅ Les calculs financiers sont **automatiques** (TVA, commission, Golden Visa)
- ✅ Les compteurs **remontent** automatiquement (total_units, occupancy)
- ✅ Les équipements sont **agrégés** via fonction SQL
- ✅ La distinction **shared vs private** est claire

---

## 📦 LES 7 MIGRATIONS CRÉÉES

| # | Fichier | Phase | Description | Priorité |
|---|---------|-------|-------------|----------|
| 1 | `20251003_phase0_fix_golden_visa_trigger.sql` | Phase 0 | Corriger trigger Golden Visa cassé | 🔴 URGENT |
| 2 | `20251003_phase0_verify_vat_constraint.sql` | Phase 0 | Vérifier contrainte VAT (0,5,19) | 🔴 URGENT |
| 3 | `20251003_phase1_cascade_inheritance.sql` | Phase 1 | Héritages automatiques (commission, VAT, energy) | ⚡ HAUTE |
| 4 | `20251003_phase1_cascade_calculations.sql` | Phase 1 | Calculs auto (prix TTC, commission, m²) | ⚡ HAUTE |
| 5 | `20251003_phase1_cascade_aggregates.sql` | Phase 1 | Compteurs agrégés (remontée) | ⚡ HAUTE |
| 6 | `20251003_phase1_cascade_amenities_function.sql` | Phase 1 | Fonction amenities complète | 🟢 MOYENNE |
| 7 | `20251003_phase2_rename_shared_private.sql` | Phase 2 | Renommage shared/private | 🟡 OPTIONNELLE |

---

## 🎯 ARCHITECTURE FINALE

### **Hiérarchie à 4 niveaux avec CASCADE**

```
┌─────────────────────────────────────────────────────────┐
│                     DEVELOPERS                           │
│  commission_rate: 7%                                     │
│  ↓ CASCADE HÉRITAGE AUTOMATIQUE                         │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                      PROJECTS                            │
│  vat_rate: 5% (résidentiel)                             │
│  amenities: ["pool", "gym", "spa"] (COMMUNS)           │
│  ↓ CASCADE HÉRITAGE AUTOMATIQUE                         │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                     BUILDINGS                            │
│  energy_rating: A                                        │
│  has_private_pool_building: true (PRIVÉ villa)          │
│  ↓ CASCADE HÉRITAGE AUTOMATIQUE                         │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                    PROPERTIES                            │
│  HÉRITE AUTOMATIQUEMENT :                               │
│    - commission_rate: 7% (de DEVELOPER)                 │
│    - vat_rate: 5% (de PROJECT)                          │
│    - energy_rating: A (de BUILDING)                     │
│                                                          │
│  CALCULE AUTOMATIQUEMENT :                              │
│    - vat_amount: 25,000€                                │
│    - price_including_vat: 525,000€                      │
│    - commission_amount: 36,750€                         │
│    - price_per_sqm: 2,000€/m²                           │
│    - golden_visa_eligible: true                         │
│                                                          │
│  AGRÈGE AMENITIES :                                     │
│    - Jacuzzi (property private)                         │
│    - Piscine privée (building private)                  │
│    - Piscine commune (project shared)                   │
│    - Gym commun (project shared)                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📖 DÉTAIL DES MIGRATIONS

### **PHASE 0 : CORRECTIONS URGENTES** 🔴

#### **Migration 1 : Fix Golden Visa Trigger**
**Fichier** : `20251003_phase0_fix_golden_visa_trigger.sql`

**Problème corrigé** :
```sql
-- ❌ ANCIEN TRIGGER (CASSÉ)
CREATE TRIGGER trg_set_golden_visa_flag
  ON public.projects  -- ❌ Mauvaise table
  UPDATE OF price     -- ❌ Colonne inexistante
```

**Solution** :
```sql
-- ✅ NOUVEAU TRIGGER (CORRECT)
CREATE TRIGGER trigger_calculate_golden_visa
  ON public.properties  -- ✅ Bonne table
  UPDATE OF price_including_vat  -- ✅ Bonne colonne
```

**Impact** :
- ✅ Golden Visa maintenant calculé correctement (≥300k€)
- ✅ Backfill de toutes les properties existantes

---

#### **Migration 2 : Verify VAT Constraint**
**Fichier** : `20251003_phase0_verify_vat_constraint.sql`

**Problème corrigé** :
```sql
-- Conflit entre contraintes
CHECK (vat_rate IN (5, 19))     -- Ancienne
CHECK (vat_rate IN (0, 5, 19))  -- Nouvelle
```

**Solution** :
```sql
-- ✅ UNE SEULE contrainte propre
ALTER TABLE projects
  ADD CONSTRAINT projects_vat_rate_valid
  CHECK (vat_rate IS NULL OR vat_rate IN (0, 5, 19));
```

**Taux VAT Chypre** :
- **0%** : Terrains, certains cas Golden Visa
- **5%** : Résidentiel première main
- **19%** : Commercial, hôtellerie, seconde main

---

### **PHASE 1 : CASCADE AUTOMATIQUE** ⚡

#### **Migration 3 : Héritage CASCADE (Type 1)**
**Fichier** : `20251003_phase1_cascade_inheritance.sql`

**3 Triggers créés** :

**1. Héritage commission_rate** (DEVELOPER → PROPERTY)
```sql
-- Trigger automatique
NEW.commission_rate := (
  SELECT commission_rate FROM developers WHERE id = NEW.developer_id
)
```

**2. Héritage vat_rate** (PROJECT → PROPERTY)
```sql
-- Trigger automatique
NEW.vat_rate := (
  SELECT vat_rate FROM projects WHERE id = NEW.project_id
)
```

**3. Héritage energy_rating** (BUILDING → PROPERTY)
```sql
-- Trigger automatique
NEW.energy_rating := (
  SELECT energy_rating FROM buildings WHERE id = NEW.building_id
)
```

**Exemple concret** :
```sql
-- Créer developer avec 7% commission
INSERT INTO developers (name, commission_rate) VALUES ('Dev Inc', 7.0);

-- Créer project avec 5% VAT
INSERT INTO projects (developer_id, vat_rate) VALUES (..., 5.0);

-- Créer building avec énergie A
INSERT INTO buildings (project_id, energy_rating) VALUES (..., 'A');

-- Créer property (HÉRITAGE AUTOMATIQUE)
INSERT INTO properties (
  developer_id, project_id, building_id,
  price_excluding_vat
) VALUES (..., ..., ..., 500000);

-- Résultat automatique :
-- commission_rate = 7.0 (hérité de developer)
-- vat_rate = 5.0 (hérité de project)
-- energy_rating = 'A' (hérité de building)
```

---

#### **Migration 4 : Calculs Automatiques (Type 2)**
**Fichier** : `20251003_phase1_cascade_calculations.sql`

**Trigger créé** : `trigger_calculate_property_financials`

**5 Calculs automatiques** :

```sql
-- 1. Montant TVA
vat_amount = price_excluding_vat × vat_rate / 100

-- 2. Prix TTC
price_including_vat = price_excluding_vat + vat_amount

-- 3. Montant commission
commission_amount = price_including_vat × commission_rate / 100

-- 4. Prix au m²
price_per_sqm = price_excluding_vat / internal_area

-- 5. Golden Visa
golden_visa_eligible = (price_including_vat >= 300000)
```

**Exemple concret** :
```sql
-- Insérer property avec juste le prix HT
INSERT INTO properties (
  price_excluding_vat: 500000,
  vat_rate: 5,           -- Hérité de project
  commission_rate: 7,    -- Hérité de developer
  internal_area: 250
) VALUES (...);

-- Résultat AUTOMATIQUE :
-- vat_amount = 25,000€         (500k × 5%)
-- price_including_vat = 525,000€
-- commission_amount = 36,750€  (525k × 7%)
-- price_per_sqm = 2,000€/m²    (500k / 250)
-- golden_visa_eligible = true  (525k >= 300k)
```

---

#### **Migration 5 : Compteurs Agrégés (Type 4)**
**Fichier** : `20251003_phase1_cascade_aggregates.sql`

**2 Triggers créés** :

**1. Mise à jour compteurs PROJECTS** (remontée)
```sql
-- Automatique après INSERT/UPDATE/DELETE property
projects.total_units = COUNT(properties)
projects.units_available = COUNT(WHERE status = 'available')
projects.units_sold = COUNT(WHERE status = 'sold')
projects.price_from = MIN(price_excluding_vat)
projects.price_to = MAX(price_excluding_vat)
```

**2. Mise à jour compteurs BUILDINGS** (remontée)
```sql
-- Automatique après INSERT/UPDATE/DELETE property
buildings.total_units = COUNT(properties)
buildings.units_available = COUNT(WHERE status = 'available')
buildings.taux_occupation = (total - available) / total * 100
```

**Exemple concret** :
```sql
-- État initial
project.total_units = 0
project.units_available = 0

-- Ajouter une property
INSERT INTO properties (project_id, property_status) VALUES (..., 'available');

-- Résultat AUTOMATIQUE :
project.total_units = 1        -- ✅ Incrémenté auto
project.units_available = 1    -- ✅ Incrémenté auto

-- Vendre la property
UPDATE properties SET property_status = 'sold' WHERE id = ...;

-- Résultat AUTOMATIQUE :
project.units_available = 0    -- ✅ Décrémenté auto
project.units_sold = 1         -- ✅ Incrémenté auto
```

---

#### **Migration 6 : Fonction Amenities (Type 3)**
**Fichier** : `20251003_phase1_cascade_amenities_function.sql`

**2 Fonctions créées** :

**1. Fonction complète** : `get_property_complete_amenities(property_id)`

Retourne JSON hiérarchique :
```json
{
  "property_private": {
    "has_jacuzzi": true,
    "has_sauna": false,
    "has_private_terrace": true
  },
  "building_private": {
    "has_private_pool_building": true,
    "has_private_gym_building": false
  },
  "building_technical": {
    "elevator_count": 2,
    "energy_rating": "A",
    "parking_type": "underground"
  },
  "project_shared": {
    "amenities": ["pool", "gym", "spa", "tennis"],
    "lifestyle_amenities": ["golf", "private_beach"]
  },
  "highlights": [
    "Jacuzzi privé",
    "Piscine privée",
    "Piscine commune",
    "Gym commun",
    "Spa & Hammam",
    "Court de tennis",
    "Golf",
    "Plage privée",
    "Vue mer",
    "Certification A+"
  ]
}
```

**2. Fonction simplifiée** : `get_property_highlights(property_id)`

Retourne array TEXT[] :
```sql
SELECT get_property_highlights('uuid');
-- Retourne : ['Piscine privée', 'Vue mer', 'Gym commun', ...]
```

**Usage dans le code** :
```typescript
// Frontend React
const amenities = await supabase
  .rpc('get_property_complete_amenities', { p_property_id: propertyId });

console.log(amenities.highlights);
// ['Jacuzzi privé', 'Piscine privée', 'Gym commun', ...]
```

---

### **PHASE 2 : CLARIFICATION** 🟡

#### **Migration 7 : Renommage Shared/Private (OPTIONNELLE)**
**Fichier** : `20251003_phase2_rename_shared_private.sql`

**Problème** :
```sql
-- ❌ CONFUSION ACTUELLE
projects.amenities (JSONB) → ["pool"]      -- Piscine commune ?
buildings.has_pool (BOOLEAN) → true        -- Piscine privée ?
properties.has_private_pool (BOOLEAN) → true  -- Piscine dans l'unité ?
```

**Solution** :
```sql
-- ✅ CLARTÉ ABSOLUE
projects.amenities → ["pool"]              -- Piscine COMMUNE (partagée)
buildings.has_private_pool_building → true -- Piscine PRIVÉE building (villa)
properties.has_private_pool → true         -- Piscine DANS l'unité (rare)
```

**Renommages effectués** :
| Ancien nom | Nouveau nom | Signification |
|------------|-------------|---------------|
| `buildings.has_pool` | `has_private_pool_building` | Piscine privée villa |
| `buildings.has_gym` | `has_private_gym_building` | Gym privé penthouse |
| `buildings.has_spa` | `has_private_spa_building` | Spa privé building |
| `buildings.has_playground` | `has_private_playground_building` | Aire jeu privée |
| `buildings.has_garden` | `has_private_garden_building` | Jardin privé |

**Note** : Cette migration est **OPTIONNELLE**. Elle améliore la clarté mais n'affecte pas les triggers CASCADE.

---

## 🚀 ORDRE D'EXÉCUTION DES MIGRATIONS

### **Scénario 1 : Exécution complète (RECOMMANDÉ)**

```bash
# Phase 0 : Corrections urgentes
psql < 20251003_phase0_fix_golden_visa_trigger.sql
psql < 20251003_phase0_verify_vat_constraint.sql

# Phase 1 : CASCADE automatique
psql < 20251003_phase1_cascade_inheritance.sql
psql < 20251003_phase1_cascade_calculations.sql
psql < 20251003_phase1_cascade_aggregates.sql
psql < 20251003_phase1_cascade_amenities_function.sql

# Phase 2 : Renommage (OPTIONNEL)
psql < 20251003_phase2_rename_shared_private.sql
```

### **Scénario 2 : Minimal (sans renommage)**

```bash
# Phases 0 + 1 uniquement
psql < 20251003_phase0_fix_golden_visa_trigger.sql
psql < 20251003_phase0_verify_vat_constraint.sql
psql < 20251003_phase1_cascade_inheritance.sql
psql < 20251003_phase1_cascade_calculations.sql
psql < 20251003_phase1_cascade_aggregates.sql
psql < 20251003_phase1_cascade_amenities_function.sql
```

### **Scénario 3 : Via Supabase CLI**

```bash
# Toutes les migrations
supabase db push

# Ou une par une
supabase db push --file supabase/migrations/20251003_phase0_fix_golden_visa_trigger.sql
```

---

## ✅ VÉRIFICATIONS POST-MIGRATION

### **1. Vérifier Golden Visa**
```sql
-- Compter properties Golden Visa
SELECT COUNT(*) as total_golden_visa
FROM properties
WHERE golden_visa_eligible = true;

-- Vérifier cohérence
SELECT
  property_code,
  price_including_vat,
  golden_visa_eligible,
  CASE
    WHEN price_including_vat >= 300000 AND golden_visa_eligible = false THEN 'ERREUR'
    WHEN price_including_vat < 300000 AND golden_visa_eligible = true THEN 'ERREUR'
    ELSE 'OK'
  END as status
FROM properties
WHERE price_including_vat IS NOT NULL
LIMIT 20;
```

### **2. Vérifier héritages**
```sql
-- Vérifier héritage commission, VAT, energy
SELECT
  p.property_code,
  d.commission_rate as dev_commission,
  p.commission_rate as prop_commission,
  pr.vat_rate as project_vat,
  p.vat_rate as prop_vat,
  b.energy_rating as building_energy,
  p.energy_rating as prop_energy
FROM properties p
LEFT JOIN developers d ON p.developer_id = d.id
LEFT JOIN projects pr ON p.project_id = pr.id
LEFT JOIN buildings b ON p.building_id = b.id
LIMIT 10;
```

### **3. Vérifier calculs automatiques**
```sql
-- Vérifier cohérence calculs
SELECT
  property_code,
  price_excluding_vat,
  vat_rate,
  vat_amount,
  price_excluding_vat * vat_rate / 100 as vat_calculated,
  ABS(vat_amount - (price_excluding_vat * vat_rate / 100)) as difference
FROM properties
WHERE price_excluding_vat IS NOT NULL
  AND vat_rate IS NOT NULL
  AND ABS(vat_amount - (price_excluding_vat * vat_rate / 100)) > 0.01
LIMIT 10;
```

### **4. Vérifier compteurs agrégés**
```sql
-- Comparer compteurs vs réalité
SELECT
  p.title,
  p.total_units as stored,
  (SELECT COUNT(*) FROM properties WHERE project_id = p.id) as actual,
  p.total_units - (SELECT COUNT(*) FROM properties WHERE project_id = p.id) as diff
FROM projects p
WHERE p.total_units != (SELECT COUNT(*) FROM properties WHERE project_id = p.id);
```

### **5. Tester fonction amenities**
```sql
-- Test sur une property
SELECT get_property_complete_amenities('uuid-property-test');

-- Test highlights
SELECT get_property_highlights('uuid-property-test');
```

---

## 🔧 MISE À JOUR CODE TYPESCRIPT

### **1. Mettre à jour src/types/building.ts**

```typescript
export interface Building {
  // ❌ SUPPRIMER (après Phase 2)
  // has_pool?: boolean;
  // has_gym?: boolean;
  // has_spa?: boolean;

  // ✅ AJOUTER (après Phase 2)
  has_private_pool_building?: boolean;
  has_private_gym_building?: boolean;
  has_private_spa_building?: boolean;
  has_private_playground_building?: boolean;
  has_private_garden_building?: boolean;

  // Garder inchangé
  energy_rating?: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  elevator_count?: number;
  has_generator?: boolean;
  has_security_system?: boolean;
  has_cctv?: boolean;
  has_concierge?: boolean;
  has_solar_panels?: boolean;
  parking_type?: 'underground' | 'outdoor' | 'covered';
  total_units?: number;
  units_available?: number;
  taux_occupation?: number;
}
```

### **2. Mettre à jour src/types/property.ts**

```typescript
export interface Property {
  // Prix (calculés automatiquement)
  price_excluding_vat: number;
  vat_rate?: number;                // Hérité de project
  vat_amount?: number;              // Calculé auto
  price_including_vat?: number;     // Calculé auto
  price_per_sqm?: number;           // Calculé auto

  // Commission (héritée automatiquement)
  commission_rate?: number;         // Hérité de developer
  commission_amount?: number;       // Calculé auto

  // Golden Visa (calculé automatiquement)
  golden_visa_eligible?: boolean;   // Calculé auto (≥300k€)

  // Energy (hérité automatiquement)
  energy_rating?: string;           // Hérité de building

  // ❌ SUPPRIMER (incohérence avec SQL)
  // sale_status?: string;
  // availability_status?: string;

  // ✅ AJOUTER (correspondance SQL)
  property_status?: 'available' | 'reserved' | 'sold' | 'rented';
  is_available?: boolean;
}
```

### **3. Utiliser la fonction amenities**

```typescript
// Dans un composant React
const PropertyDetails = ({ propertyId }: { propertyId: string }) => {
  const [amenities, setAmenities] = useState<any>(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      const { data, error } = await supabase
        .rpc('get_property_complete_amenities', {
          p_property_id: propertyId
        });

      if (!error) {
        setAmenities(data);
      }
    };

    fetchAmenities();
  }, [propertyId]);

  return (
    <div>
      <h3>Highlights</h3>
      <ul>
        {amenities?.highlights?.map((h: string) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <h3>Équipements privés</h3>
      {amenities?.property_private?.has_jacuzzi && <p>Jacuzzi</p>}
      {amenities?.building_private?.has_private_pool_building && <p>Piscine privée</p>}

      <h3>Équipements communs</h3>
      {amenities?.project_shared?.amenities?.includes('pool') && <p>Piscine commune</p>}
      {amenities?.project_shared?.amenities?.includes('gym') && <p>Gym commun</p>}
    </div>
  );
};
```

---

## 🐛 DÉPANNAGE

### **Erreur : "column does not exist"**

**Cause** : Migration Phase 2 (renommage) appliquée mais code TypeScript pas mis à jour

**Solution** :
```typescript
// Rechercher dans le code
grep -r "has_pool" src/
grep -r "has_gym" src/

// Remplacer par
has_private_pool_building
has_private_gym_building
```

### **Erreur : "constraint violation vat_rate"**

**Cause** : Données avec vat_rate invalide (ni 0, ni 5, ni 19)

**Solution** :
```sql
-- Trouver les valeurs invalides
SELECT DISTINCT vat_rate
FROM properties
WHERE vat_rate IS NOT NULL
  AND vat_rate NOT IN (0, 5, 19);

-- Corriger
UPDATE properties
SET vat_rate = 5
WHERE vat_rate NOT IN (0, 5, 19);
```

### **Erreur : "golden_visa_eligible always false"**

**Cause** : Trigger Phase 0 pas appliqué

**Solution** :
```sql
-- Forcer recalcul manuel
UPDATE properties
SET golden_visa_eligible = (price_including_vat >= 300000)
WHERE price_including_vat IS NOT NULL;
```

### **Compteurs PROJECT incorrects**

**Cause** : Trigger Phase 1.3 pas appliqué

**Solution** :
```sql
-- Forcer recalcul manuel
UPDATE projects p
SET
  total_units = (SELECT COUNT(*) FROM properties WHERE project_id = p.id),
  units_available = (SELECT COUNT(*) FROM properties WHERE project_id = p.id AND property_status = 'available');
```

---

## 📊 RÉSUMÉ IMPACT

| Aspect | Avant | Après |
|--------|-------|-------|
| **Héritage commission** | ❌ Manuel | ✅ Automatique (trigger) |
| **Héritage VAT** | ❌ Manuel | ✅ Automatique (trigger) |
| **Héritage energy** | ❌ Manuel | ✅ Automatique (trigger) |
| **Calcul prix TTC** | ❌ Manuel | ✅ Automatique (trigger) |
| **Calcul commission** | ❌ Manuel | ✅ Automatique (trigger) |
| **Golden Visa** | ⚠️ Cassé | ✅ Automatique (trigger) |
| **Compteurs total_units** | ⚠️ Partiel | ✅ Automatique (trigger) |
| **Fonction amenities** | ❌ Manquante | ✅ Créée (fonction SQL) |
| **Équipements shared/private** | ❌ Confus | ✅ Clair (renommé) |

---

## ✅ CONCLUSION

**Architecture CASCADE complète implémentée** avec :
- ✅ 6 triggers automatiques
- ✅ 2 fonctions SQL utiles
- ✅ Backfill de toutes les données existantes
- ✅ Protection contre erreurs (IF EXISTS, COALESCE)
- ✅ Documentation exhaustive

**Prochaines étapes** :
1. Appliquer les migrations (ordre Phase 0 → 1 → 2)
2. Tester avec `npm run build`
3. Mettre à jour TypeScript si Phase 2 appliquée
4. Vérifier les requêtes SQL de vérification
5. Déployer en production

**Félicitations ! Votre base de données est maintenant CASCADE-ready ! 🚀**
