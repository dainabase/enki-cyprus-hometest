# 🚀 CHECKLIST DÉPLOIEMENT - MIGRATIONS CASCADE
**Date**: 2025-10-03

---

## ⚠️ ÉTAT ACTUEL

**Base Supabase** : ❌ VIDE (tables pas encore créées)

**Action requise** : Créer les tables de base PUIS appliquer migrations CASCADE

---

## 📋 ÉTAPES D'EXÉCUTION

### **1️⃣ CRÉER LES TABLES DE BASE** (OBLIGATOIRE)

**Migration** : `supabase/migrations/20250920062524_d4c3ebee-da2e-4ccd-b34e-c3e97894c655.sql`

**Via Supabase Dashboard** :
1. Aller sur https://supabase.com/dashboard
2. SQL Editor
3. Copier-coller le contenu du fichier
4. Run

**Vérification** :
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('developers', 'projects', 'buildings', 'properties');
-- Devrait retourner 4 lignes
```

---

### **2️⃣ APPLIQUER PHASE 0** (Corrections urgentes)

#### **Migration 0.1 : Fix Golden Visa**
**Fichier** : `20251003_phase0_fix_golden_visa_trigger.sql`
- ✅ Corrige trigger Golden Visa cassé
- ✅ Place trigger sur `properties.price_including_vat`

#### **Migration 0.2 : Verify VAT**
**Fichier** : `20251003_phase0_verify_vat_constraint.sql`
- ✅ Vérifie contrainte VAT (0, 5, 19)

---

### **3️⃣ APPLIQUER PHASE 1** (CASCADE automatique)

#### **Migration 1.1 : Inheritance**
**Fichier** : `20251003_phase1_cascade_inheritance.sql`
- ✅ Héritage commission_rate (DEVELOPER → PROPERTY)
- ✅ Héritage vat_rate (PROJECT → PROPERTY)
- ✅ Héritage energy_rating (BUILDING → PROPERTY)

#### **Migration 1.2 : Calculations**
**Fichier** : `20251003_phase1_cascade_calculations.sql`
- ✅ Calcul auto vat_amount, price_including_vat, commission_amount, price_per_sqm, golden_visa

#### **Migration 1.3 : Aggregates**
**Fichier** : `20251003_phase1_cascade_aggregates.sql`
- ✅ Compteurs remontants (total_units, units_available, taux_occupation)

#### **Migration 1.4 : Amenities**
**Fichier** : `20251003_phase1_cascade_amenities_function.sql`
- ✅ Fonction `get_property_complete_amenities(uuid)`

---

### **4️⃣ TESTER CASCADE**

```sql
-- Créer developer
INSERT INTO developers (name, commission_rate) VALUES ('Test Dev', 7.0) RETURNING id;

-- Créer project
INSERT INTO projects (developer_id, title, city, vat_rate)
VALUES ('<dev_id>', 'Test Project', 'Limassol', 5.0) RETURNING id;

-- Créer building
INSERT INTO buildings (project_id, building_name, building_code, total_floors, energy_rating)
VALUES ('<proj_id>', 'Test Building', 'A', 3, 'A') RETURNING id;

-- Créer property (VÉRIFIER CASCADE)
INSERT INTO properties (
  developer_id, project_id, building_id,
  property_code, unit_number, property_type, internal_area,
  price_excluding_vat, property_status
) VALUES (
  '<dev_id>', '<proj_id>', '<bld_id>',
  'TEST-001', '101', 'apartment', 120,
  500000, 'available'
) RETURNING *;

-- VÉRIFIER résultats
SELECT
  property_code,
  commission_rate,    -- Attendu: 7.0
  vat_rate,           -- Attendu: 5.0
  vat_amount,         -- Attendu: 25,000
  price_including_vat, -- Attendu: 525,000
  commission_amount,  -- Attendu: 36,750
  golden_visa_eligible -- Attendu: true
FROM properties WHERE property_code = 'TEST-001';
```

---

## ✅ RÉSULTATS ATTENDUS

| Champ | Valeur attendue | Calculé par |
|-------|-----------------|-------------|
| `commission_rate` | 7.0 | ✅ Héritage (dev) |
| `vat_rate` | 5.0 | ✅ Héritage (project) |
| `energy_rating` | A | ✅ Héritage (building) |
| `vat_amount` | 25,000€ | ✅ Calcul auto |
| `price_including_vat` | 525,000€ | ✅ Calcul auto |
| `commission_amount` | 36,750€ | ✅ Calcul auto |
| `price_per_sqm` | 4,166.67€ | ✅ Calcul auto |
| `golden_visa_eligible` | true | ✅ Calcul auto |

---

## 📊 ORDRE EXACT

1. ✅ Migration base (20250920062524)
2. ✅ Phase 0.1 (fix_golden_visa_trigger)
3. ✅ Phase 0.2 (verify_vat_constraint)
4. ✅ Phase 1.1 (cascade_inheritance)
5. ✅ Phase 1.2 (cascade_calculations)
6. ✅ Phase 1.3 (cascade_aggregates)
7. ✅ Phase 1.4 (cascade_amenities_function)
8. 🟡 Phase 2 (rename_shared_private) - OPTIONNEL

---

## 🎯 TEMPS ESTIMÉ

- Étape 1 : 2 min
- Étape 2-3 : 5 min
- Étape 4 : 5 min
- **Total** : ~12 min

---

## ✅ CHECKLIST

- [ ] Tables créées (migration base)
- [ ] Phase 0 appliquée
- [ ] Phase 1 appliquée
- [ ] Tests réussis
- [ ] Prêt production

**Documentation** : `MIGRATIONS_CASCADE_GUIDE_COMPLET.md`
