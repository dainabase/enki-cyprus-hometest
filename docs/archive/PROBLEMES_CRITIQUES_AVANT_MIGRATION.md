# 🚨 PROBLÈMES CRITIQUES TROUVÉS - À RÉSOUDRE AVANT MIGRATION
**Date**: 2025-10-03
**Gravité**: BLOQUANT

---

## ⚠️ RÉSUMÉ EXÉCUTIF

J'ai trouvé **7 problèmes critiques** qui rendent les migrations CASCADE **DANGEREUSES** dans l'état actuel.

**RECOMMANDATION** : ❌ **NE PAS APPLIQUER LES MIGRATIONS MAINTENANT**

---

## 🚨 PROBLÈME #1 : INCOHÉRENCE PRICE vs PRICE_EXCLUDING_VAT

### **Dans votre document CASCADE** :
```sql
properties.price_excluding_vat  -- Prix HT
properties.vat_rate             -- Taux TVA
properties.vat_amount           -- Montant TVA (calculé)
properties.price_including_vat  -- Prix TTC (calculé)
```

### **Dans la VRAIE base de données** (migration 20250920062524) :

#### **PROJECTS** :
```sql
-- Ligne 141 : CHECK constraint avec (5, 19)
vat_rate DECIMAL(5,2) DEFAULT 5.0 CHECK (vat_rate IN (5, 19))

-- ❌ MAIS pas de price_excluding_vat !
price_from DECIMAL(15,2)   -- Prix minimum
price_to DECIMAL(15,2)     -- Prix maximum
price_per_m2 DECIMAL(10,2) -- Prix/m²
```

#### **PROPERTIES** :
```sql
-- Lignes 414-418 : Tous les champs prix EXISTENT
price_excluding_vat DECIMAL(15,2) NOT NULL
vat_rate DECIMAL(5,2) DEFAULT 5.0
vat_amount DECIMAL(15,2)
price_including_vat DECIMAL(15,2)
price_per_sqm DECIMAL(10,2)
```

### **Impact** :
- ✅ PROPERTIES : Tout est correct
- ❌ PROJECTS : Pas de `price_excluding_vat` (uniquement `price_from`/`price_to`)
- ⚠️ Golden Visa trigger cherche `price` au lieu de `price_including_vat`

**Solution** : Corriger le trigger Golden Visa

---

## 🚨 PROBLÈME #2 : GOLDEN VISA SUR LE MAUVAIS NIVEAU

### **Dans votre document CASCADE** :
```sql
-- Golden Visa calculé au niveau PROPERTY
properties.golden_visa_eligible BOOLEAN
```

### **Dans la VRAIE base** :

#### **PROJECTS** :
```sql
-- Ligne 135 : Golden Visa sur PROJECT !
golden_visa_eligible BOOLEAN DEFAULT false
```

#### **PROPERTIES** :
```sql
-- Ligne 425 : Golden Visa sur PROPERTY aussi
golden_visa_eligible BOOLEAN DEFAULT false
```

#### **TRIGGER ACTUEL** :
```sql
-- 20250907193845 : Trigger sur PROJECTS.price
CREATE TRIGGER trg_set_golden_visa_flag
BEFORE INSERT OR UPDATE OF price ON public.projects  -- ❌ Niveau PROJECT
FOR EACH ROW
EXECUTE FUNCTION public.set_golden_visa_flag();
```

### **Problème** :
- ❌ Le trigger est sur `projects.price` (qui n'existe pas !)
- ❌ Devrait être sur `properties.price_including_vat`
- ❌ Golden Visa est calculé par PROPERTY (≥300k€), pas par PROJECT

**Solution** : Refaire le trigger sur `properties.price_including_vat`

---

## 🚨 PROBLÈME #3 : VAT_RATE CONSTRAINT INCOMPLET

### **Dans migration 20251003_fix_vat_rate_constraint.sql** :
```sql
-- Vous avez créé une migration pour ajouter 0% VAT
ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_vat_rate_check;

ALTER TABLE projects
ADD CONSTRAINT projects_vat_rate_check
CHECK (vat_rate IN (0, 5, 19));
```

### **Dans la migration principale 20250920062524** :
```sql
-- Ligne 141 : Ancienne contrainte (5, 19) EXISTE TOUJOURS
vat_rate DECIMAL(5,2) DEFAULT 5.0 CHECK (vat_rate IN (5, 19))
```

### **Problème** :
- ⚠️ La migration de fix n'est peut-être pas appliquée
- ⚠️ Si appliquée, il y a une contrainte inline + une contrainte nommée
- ⚠️ Risque de conflit

**Solution** : Vérifier que la contrainte (0, 5, 19) est bien active

---

## 🚨 PROBLÈME #4 : REDONDANCES ÉQUIPEMENTS MASSIVES

### **Dans la VRAIE base** :

#### **PROJECTS** (ligne 101-109) :
```sql
amenities JSONB DEFAULT '[]'
lifestyle_amenities JSONB DEFAULT '[]'
community_features JSONB DEFAULT '[]'
wellness_features JSONB DEFAULT '[]'
seasonal_features JSONB DEFAULT '[]'
smart_home_features JSONB DEFAULT '[]'
accessibility_features JSONB DEFAULT '[]'
```

#### **BUILDINGS** (ligne 244-249) :
```sql
-- ❌ DOUBLONS avec PROJECTS
has_pool BOOLEAN DEFAULT false
has_gym BOOLEAN DEFAULT false
has_spa BOOLEAN DEFAULT false
has_playground BOOLEAN DEFAULT false
has_garden BOOLEAN DEFAULT false
```

#### **PROPERTIES** (ligne 335-398) :
```sql
-- ❌ TRIPLONS !!
has_private_pool BOOLEAN DEFAULT false
has_jacuzzi BOOLEAN DEFAULT false
has_sauna BOOLEAN DEFAULT false
has_solar_panels BOOLEAN DEFAULT false  -- ❌ Aussi dans buildings !
```

### **TypeScript buildings.ts** (ligne 21-60) :
```typescript
// ❌ ENCORE PLUS DE DOUBLONS
has_pool?: boolean;           // buildings L21 + properties L335
has_gym?: boolean;            // buildings L22 + properties (implicite)
has_spa?: boolean;            // buildings L23 + properties L389
has_tennis_court?: boolean;   // buildings L48 (devrait être projects uniquement)
restaurant?: boolean;         // buildings L41 (devrait être projects uniquement)
cafe?: boolean;              // buildings L42 (devrait être projects uniquement)
```

### **Problème** :
- ❌ `has_pool` existe dans PROJECTS (JSONB), BUILDINGS (BOOLEAN), PROPERTIES (has_private_pool)
- ❌ Impossibilité de savoir si c'est une piscine commune ou privée
- ❌ TypeScript ne correspond pas à SQL

**Solution** : Architecture shared/private OBLIGATOIRE

---

## 🚨 PROBLÈME #5 : COMMISSION_RATE EXISTE DÉJÀ

### **Dans votre document CASCADE** :
```sql
-- Commission héritée de DEVELOPER
properties.commission_rate  -- Hérité automatiquement
```

### **Dans la VRAIE base** :

#### **DEVELOPERS** (ligne 42) :
```sql
commission_rate DECIMAL(5,2) DEFAULT 5.0
```

#### **PROPERTIES** (ligne 430-433) :
```sql
-- ✅ Déjà présent !
commission_rate DECIMAL(5,2) DEFAULT 5.0
commission_amount DECIMAL(10,2)
referral_commission DECIMAL(10,2)
referral_commission_rate DECIMAL(5,2)
```

### **Problème** :
- ✅ Le champ existe déjà (BIEN)
- ❌ Mais DEFAULT 5.0 (peut override l'héritage)
- ❌ Pas de trigger pour hériter de `developers.commission_rate`

**Solution** : Trigger OK, mais attention au DEFAULT

---

## 🚨 PROBLÈME #6 : ENERGY_RATING EXISTE PARTOUT

### **Dans la VRAIE base** :

#### **BUILDINGS** (ligne 232-233) :
```sql
energy_rating VARCHAR(2) CHECK (energy_rating IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'))
energy_certificate TEXT
```

#### **PROPERTIES** (ligne 449) :
```sql
-- ❌ DOUBLON
energy_rating VARCHAR(2)
```

### **Problème** :
- ⚠️ `energy_rating` existe dans BUILDINGS (source)
- ⚠️ `energy_rating` existe dans PROPERTIES (devrait hériter)
- ⚠️ Pas de trigger pour hériter
- ⚠️ Risque de valeurs différentes

**Solution** : Trigger OK, mais vérifier cohérence données existantes

---

## 🚨 PROBLÈME #7 : NOMS DE COLONNES INCOHÉRENTS

### **Dans SQL** :
```sql
properties.property_status   -- Status de vente
properties.is_available      -- Disponibilité
```

### **Dans TypeScript** :
```typescript
sale_status?: string;           // ❌ Différent de property_status
property_status?: string;       // ✅ Correspond
availability_status?: string;   // ❌ Différent de is_available
```

### **Problème** :
- ⚠️ TypeScript utilise `sale_status` mais SQL utilise `property_status`
- ⚠️ TypeScript utilise `availability_status` mais SQL utilise `is_available`
- ⚠️ Le code frontend va crash

**Solution** : Synchroniser TypeScript ↔ SQL

---

## 📊 TABLEAU RÉCAPITULATIF DES PROBLÈMES

| # | Problème | Niveau Gravité | Bloquant Migration ? |
|---|----------|----------------|----------------------|
| **#1** | `projects.price` n'existe pas | 🔴 CRITIQUE | ✅ OUI |
| **#2** | Golden Visa trigger incorrect | 🔴 CRITIQUE | ✅ OUI |
| **#3** | VAT constraint (0,5,19) non confirmée | 🟡 MOYEN | ⚠️ À VÉRIFIER |
| **#4** | Redondances équipements massives | 🔴 CRITIQUE | ✅ OUI |
| **#5** | `commission_rate` DEFAULT peut override | 🟡 MOYEN | ❌ Non (mais risque) |
| **#6** | `energy_rating` dupliqué | 🟡 MOYEN | ❌ Non (mais risque) |
| **#7** | Noms TypeScript ≠ SQL | 🟠 ÉLEVÉ | ❌ Non (mais casse code) |

---

## ✅ PLAN D'ACTION CORRECT

### **Phase 0 : URGENT - CORRIGER LES BLOQUANTS** (Maintenant)

#### **0.1. Corriger le trigger Golden Visa**
```sql
-- Supprimer l'ancien trigger (sur projects.price qui n'existe pas)
DROP TRIGGER IF EXISTS trg_set_golden_visa_flag ON public.projects;

-- Créer le bon trigger (sur properties.price_including_vat)
CREATE OR REPLACE FUNCTION public.set_golden_visa_property()
RETURNS TRIGGER AS $$
BEGIN
  -- Golden Visa si prix TTC >= 300,000€
  IF NEW.price_including_vat IS NOT NULL AND NEW.price_including_vat >= 300000 THEN
    NEW.golden_visa_eligible := true;
  ELSE
    NEW.golden_visa_eligible := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_golden_visa_property
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION public.set_golden_visa_property();
```

#### **0.2. Vérifier la contrainte VAT**
```sql
-- Vérifier quelle contrainte est active
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.projects'::regclass
  AND conname LIKE '%vat%';

-- Si contrainte (5,19), appliquer la migration fix_vat_rate
```

#### **0.3. Décider architecture équipements**

**Option A : Renommer maintenant (RECOMMANDÉ)**
```sql
-- PROJECTS
ALTER TABLE projects RENAME COLUMN amenities TO shared_amenities;

-- BUILDINGS
ALTER TABLE buildings RENAME COLUMN has_pool TO has_private_pool;
ALTER TABLE buildings RENAME COLUMN has_gym TO has_private_gym;
...

-- PROPERTIES (déjà correct)
-- has_private_pool, has_jacuzzi (OK)
```

**Option B : Utiliser JSONB uniquement**
```sql
-- Garder projects.amenities JSONB
-- Supprimer buildings.has_pool, has_gym, etc.
-- Tout mettre dans buildings.building_amenities JSONB
```

**Option C : Faire les migrations CASCADE d'abord, renommer après**
- ⚠️ RISQUE : Confusion lors du développement

---

### **Phase 1 : Migrations CASCADE (Après corrections)**

#### **Migration 1 : Héritage automatique**
```sql
-- Trigger 1: commission_rate (DEVELOPER → PROPERTY)
-- Trigger 2: vat_rate (PROJECT → PROPERTY)
-- Trigger 3: energy_rating (BUILDING → PROPERTY)
```

**⚠️ ATTENTION** :
- Vérifier que `properties.commission_rate DEFAULT 5.0` ne cause pas de problème
- Peut-être retirer le DEFAULT et forcer l'héritage

#### **Migration 2 : Calculs automatiques**
```sql
-- Trigger 4: calculate_property_financials
--   - vat_amount
--   - price_including_vat
--   - commission_amount
--   - price_per_sqm
--   - golden_visa_eligible (recalculé ici aussi)
```

#### **Migration 3 : Compteurs agrégés**
```sql
-- Trigger 5: update_project_statistics
-- Trigger 6: update_building_statistics
```

#### **Migration 4 : Fonction amenities**
```sql
-- Fonction: get_property_complete_amenities()
```

---

### **Phase 2 : Renommage équipements (Après CASCADE)**

**Si Option A choisie** :
```sql
-- Migration shared/private
-- (Voir ARCHITECTURE_EQUIPEMENTS_SOLUTION.md)
```

---

### **Phase 3 : Synchronisation TypeScript**

```typescript
// src/types/property.ts
export interface Property {
  // ❌ Supprimer
  // sale_status?: string;
  // availability_status?: string;

  // ✅ Ajouter (correspondance SQL)
  property_status?: 'available' | 'reserved' | 'sold' | 'rented';
  is_available?: boolean;
}
```

---

## 🎯 CE QU'IL FAUT FAIRE MAINTENANT

### **OPTION 1 : Corriger les bloquants d'abord** (RECOMMANDÉ)
1. ✅ Corriger trigger Golden Visa (properties au lieu de projects)
2. ✅ Vérifier contrainte VAT (0,5,19)
3. ✅ Décider architecture équipements (shared/private ou JSONB)
4. ✅ PUIS faire les migrations CASCADE
5. ✅ PUIS synchroniser TypeScript

**Avantages** :
- ✅ Évite les erreurs critiques
- ✅ Base solide pour CASCADE
- ✅ Résultat propre et cohérent

**Inconvénients** :
- ⏱️ Plus long (3-4 migrations au lieu de 1)

---

### **OPTION 2 : Faire CASCADE maintenant, corriger après** (RISQUÉ)
1. ⚠️ Faire les 3 migrations CASCADE
2. ⚠️ Accepter les erreurs Golden Visa
3. ⚠️ Accepter la confusion équipements
4. ⚠️ Corriger plus tard

**Avantages** :
- ⏱️ Plus rapide à court terme

**Inconvénients** :
- ❌ Risque d'erreurs SQL
- ❌ Golden Visa mal calculé
- ❌ Confusion équipements
- ❌ Plus difficile à déboguer

---

## ❓ QUESTIONS POUR VOUS

1. **Golden Visa** : Confirmez-vous que c'est au niveau PROPERTY (≥300k€) et non PROJECT ?

2. **VAT 0%** : Confirmez-vous que certains projets sont à TVA 0% (terrains ?) ?

3. **Équipements** : Quelle option préférez-vous ?
   - **Option A** : Renommer (shared vs private) ← **RECOMMANDÉ**
   - **Option B** : Tout dans JSONB
   - **Option C** : Faire CASCADE d'abord, renommer après

4. **Commission DEFAULT** : Voulez-vous garder `DEFAULT 5.0` ou forcer l'héritage ?

5. **TypeScript** : Voulez-vous que je corrige aussi les types TypeScript maintenant ?

---

## ✅ CONCLUSION

**Votre architecture CASCADE est EXCELLENTE** en théorie.

**Mais** :
- ❌ 7 problèmes critiques empêchent l'implémentation immédiate
- ❌ Risque de perte de données si on force maintenant
- ✅ Avec corrections (Phase 0), migrations CASCADE sont sûres

**Recommandation finale** : ⏸️ **PAUSE**

1. Répondez aux 5 questions ci-dessus
2. Je crée les migrations de correction (Phase 0)
3. On vérifie que tout fonctionne
4. PUIS on applique CASCADE (Phase 1)

**Est-ce que vous êtes d'accord avec cette approche prudente ?**
