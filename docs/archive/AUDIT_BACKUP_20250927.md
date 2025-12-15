# 📊 AUDIT COMPLET ET BACKUP - REFACTORING BUILDINGS/PROJECTS
**Date**: 27 Septembre 2025  
**Repository**: enki-cyprus-hometest  
**Project ID**: ccsakftsslurjgnjwdci

## 🎯 OBJECTIF
Ce document constitue le backup complet de l'état actuel avant le refactoring de la structure buildings/projects.

## 📋 ÉTAT ACTUEL DES TABLES

### 1. TABLE BUILDINGS (35 champs actuels)

#### ✅ Champs essentiels à conserver (21)
```sql
-- Identité
id UUID PRIMARY KEY
project_id UUID REFERENCES projects(id)
building_code TEXT NOT NULL
building_name TEXT
display_order INTEGER DEFAULT 0

-- Caractéristiques
building_type TEXT DEFAULT 'residential'
building_class TEXT CHECK ('A', 'B', 'C')
total_floors INTEGER NOT NULL
total_units INTEGER DEFAULT 0
units_available INTEGER DEFAULT 0
construction_year INTEGER

-- Statuts
construction_status TEXT DEFAULT 'planning'
expected_completion DATE
actual_completion DATE

-- Certifications
energy_rating VARCHAR(2)
energy_certificate TEXT

-- Équipements bâtiment
elevator_count INTEGER DEFAULT 0
has_generator BOOLEAN
has_security_system BOOLEAN
has_cctv BOOLEAN
has_concierge BOOLEAN
has_solar_panels BOOLEAN
```

#### 🔄 Champs à migrer vers PROJECTS (15)
```sql
-- Espaces communs (à déplacer dans projects)
has_pool BOOLEAN DEFAULT false
has_gym BOOLEAN DEFAULT false  
has_spa BOOLEAN DEFAULT false
has_playground BOOLEAN DEFAULT false
has_garden BOOLEAN DEFAULT false

-- Parking (peut être au niveau projet)
has_parking BOOLEAN DEFAULT false
parking_type TEXT

-- Métadonnées
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
created_by UUID
```

### 2. TABLE PROJECTS (85+ champs actuels)
Structure déjà complète avec sections :
- Identité & Localisation
- Descriptions & Marketing
- Dimensions & Unités
- Prestations communes
- Statuts & Construction
- Financier & Garanties
- Légal & Permits
- Médias & SEO
- IA & Analytics

### 3. INCOHÉRENCES IDENTIFIÉES

#### Frontend vs Database
```typescript
// Frontend (building.ts)
construction_status: 'planned' | 'construction' | 'delivered'

// Database
construction_status: 'planning' | 'construction' | 'delivered'
```

#### Champ building_code
- Database: NOT NULL avec contrainte UNIQUE(project_id, building_code)
- Frontend: Optional (building_code?: string)

## 🔧 PLAN DE MIGRATION DÉTAILLÉ

### PHASE 1 : Préparation (Étapes 1-2)

#### Étape 1 : Audit et backup ✅ COMPLÉTÉ
- Documentation de l'état actuel
- Identification des incohérences
- Plan de migration établi

#### Étape 2 : Correction des incohérences
```sql
-- Corriger enum construction_status
ALTER TYPE construction_status_enum RENAME VALUE 'planning' TO 'planned';

-- Rendre building_code optionnel ou l'imposer dans le frontend
ALTER TABLE buildings ALTER COLUMN building_code DROP NOT NULL;
```

### PHASE 2 : Ajout sécurisé (Étapes 3-5)

#### Étape 3 : Ajouter colonnes dans PROJECTS
```sql
-- Migration pour ajouter les champs d'installations communes
ALTER TABLE projects ADD COLUMN IF NOT EXISTS building_has_pool BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS building_has_gym BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS building_has_spa BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS building_has_playground BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS building_has_garden BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS building_has_parking BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS building_parking_type TEXT;
```

### PHASE 3 : Migration données (Étapes 6-7)

#### Étape 6 : Script de copie
```sql
-- Copier les données existantes
UPDATE projects p SET
  building_has_pool = (
    SELECT bool_or(has_pool) FROM buildings b WHERE b.project_id = p.id
  ),
  building_has_gym = (
    SELECT bool_or(has_gym) FROM buildings b WHERE b.project_id = p.id
  ),
  -- etc...
```

### PHASE 4 : Nettoyage progressif (Étapes 8-10)

#### Étape 8-9 : Marquage obsolète
- Ajouter commentaires DEPRECATED dans le code
- Retirer progressivement de l'UI

#### Étape 10 : Suppression finale
```sql
-- Après validation complète
ALTER TABLE buildings 
DROP COLUMN IF EXISTS has_pool,
DROP COLUMN IF EXISTS has_gym,
-- etc...
```

## 📁 FICHIERS CRITIQUES À SURVEILLER

### Frontend - TypeScript
```
src/types/building.ts
src/types/building.project.ts  
src/schemas/projectSchema.ts
src/lib/api/buildings.ts
src/components/admin/buildings/BuildingForm.tsx
src/components/admin/projects/BuildingSection.tsx
src/components/admin/projects/BuildingModal.tsx
```

### Database - Migrations
```
supabase/migrations/20250920062524_d4c3ebee-da2e-4ccd-b34e-c3e97894c655.sql
supabase/migrations/20250926_fix_construction_year_buildings.sql
supabase/migrations/20250118_fix_buildings_construction_year.sql
```

## ✅ CHECKLIST DE VALIDATION

Avant CHAQUE modification :
- [ ] Backup de la base de données effectué
- [ ] Tests de création/modification projet OK
- [ ] Tests de création/modification bâtiment OK  
- [ ] Pas d'erreur console
- [ ] Formulaire projet complet et fonctionnel
- [ ] Section SEO intacte
- [ ] Section localisation complète
- [ ] Uploads media fonctionnels
- [ ] Multilingue préservé

## 🚨 ALERTES CRITIQUES

### NE JAMAIS
- ❌ Supprimer des sections du formulaire projet
- ❌ Modifier la structure SEO existante
- ❌ Toucher à la localisation sans validation
- ❌ Retirer des fonctionnalités existantes
- ❌ Faire des changements massifs d'un coup

### TOUJOURS
- ✅ Tester après chaque modification
- ✅ Garder la compatibilité arrière
- ✅ Documenter les changements
- ✅ Valider avec l'équipe avant suppression

## 📊 MÉTRIQUES ACTUELLES

| Métrique | Valeur |
|----------|--------|
| Tables principales | 4 (developers, projects, buildings, properties) |
| Champs table buildings | 35 |
| Champs table projects | 85+ |
| Champs table properties | 130+ |
| Triggers actifs | 10 |
| Indexes | 6 |
| Policies RLS | 8 |

## 🔄 PROCHAIN PAS

Étape 2 : Corriger les incohérences existantes
- Aligner construction_status enum
- Résoudre building_code NULL/NOT NULL
- Synchroniser types TypeScript avec DB

---

**Document créé par** : Assistant Architecte Technique  
**Pour** : Équipe Enki Reality Cyprus  
**Version** : 1.0.0
