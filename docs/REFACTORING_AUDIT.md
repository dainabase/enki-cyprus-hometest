# 📋 AUDIT COMPLET - REFACTORING BUILDINGS/PROJECTS
# Date: 27 septembre 2025
# Projet: ENKI REALITY CYPRUS

## 🗄️ STRUCTURE ACTUELLE DATABASE SUPABASE

### Table BUILDINGS (58 champs)

#### ✅ Champs essentiels à conserver (21):
- id (UUID, PK, NOT NULL)
- project_id (UUID, FK)
- building_code (TEXT, NOT NULL) ⚠️
- building_name (TEXT)
- display_order (INTEGER)
- building_type (TEXT, default: 'residential')
- building_class (TEXT)
- total_floors (INTEGER, NOT NULL)
- total_units (INTEGER)
- units_available (INTEGER)
- construction_status (TEXT, default: 'planning') ⚠️
- expected_completion (DATE)
- actual_completion (DATE)
- energy_rating (VARCHAR(2))
- energy_certificate (TEXT)
- elevator_count (INTEGER)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
- created_by (UUID)

#### 🔄 Champs à déplacer vers PROJECTS (15):
- has_pool (BOOLEAN)
- has_gym (BOOLEAN)
- has_spa (BOOLEAN)
- has_playground (BOOLEAN)
- has_garden (BOOLEAN)
- has_parking (BOOLEAN)
- parking_type (TEXT)
- has_generator (BOOLEAN)
- has_security_system (BOOLEAN)
- has_cctv (BOOLEAN)
- has_concierge (BOOLEAN)
- has_solar_panels (BOOLEAN)
- security_features (JSONB)
- wellness_facilities (JSONB)
- outdoor_facilities (JSONB)

#### ❌ Champs à supprimer après migration (12):
- pet_washing_station (BOOLEAN)
- car_wash_area (BOOLEAN)
- central_vacuum_system (BOOLEAN)
- water_softener_system (BOOLEAN)
- water_purification_system (BOOLEAN)
- smart_building_system (BOOLEAN)
- intercom_system (BOOLEAN)
- package_room (BOOLEAN)
- bike_storage (BOOLEAN)
- wheelchair_accessible (BOOLEAN)
- disabled_parking_spaces (INTEGER)
- braille_signage (BOOLEAN)

#### 📦 Champs JSONB existants:
- building_amenities (JSONB)
- common_areas (JSONB)
- infrastructure (JSONB)
- floor_plans (JSONB)

### Table PROJECTS (200+ champs)

#### 🔍 Champs dupliqués déjà présents:
- has_pool (BOOLEAN) ✅ Déjà existe!
- has_gym (BOOLEAN) ✅ Déjà existe!
- has_spa (BOOLEAN) ✅ Déjà existe!
- has_playground (BOOLEAN) ✅ Déjà existe!
- has_garden (BOOLEAN) ✅ Déjà existe!
- has_security_system (BOOLEAN) ✅ Déjà existe!
- has_cctv (BOOLEAN) ✅ Déjà existe!
- has_concierge (BOOLEAN) ✅ Déjà existe!
- has_generator (BOOLEAN) ✅ Déjà existe!
- has_solar_panels (BOOLEAN) ✅ Déjà existe!
- has_parking (BOOLEAN) ✅ Déjà existe!
- parking_type (TEXT) ✅ Déjà existe!
- security_features (JSONB) ✅ Déjà existe!
- wellness_facilities (JSONB) ✅ Déjà existe!
- outdoor_facilities (JSONB) ✅ Déjà existe!

## ⚠️ INCOHÉRENCES DÉTECTÉES

### 1. building_code:
- **DATABASE**: NOT NULL
- **FRONTEND**: optional (building_code?)
- **ACTION**: Aligner sur optional ou rendre obligatoire partout

### 2. construction_status:
- **DATABASE**: 'planning' (default)
- **FRONTEND**: 'planned' | 'construction' | 'delivered'
- **ACTION**: Corriger l'enum DB pour utiliser 'planned'

### 3. Champs manquants dans le schema TypeScript:
- building_amenities (JSONB)
- common_areas (JSONB)
- infrastructure (JSONB)
- floor_plans (JSONB)
- typical_floor_plan_url (TEXT)
- model_3d_url (TEXT)
- building_brochure_url (TEXT)
- accessible_elevator (BOOLEAN)
- ramp_access (BOOLEAN)
- wide_doorways (BOOLEAN)

## 📐 STRUCTURE FRONTEND ACTUELLE

### src/types/building.ts
```typescript
export interface Building {
  id: string;
  project_id: string;
  building_name: string;
  building_type: 'apartment_building' | 'villa_complex' | 'mixed_residence' | 'residential';
  building_code?: string; // ⚠️ Optional vs NOT NULL en DB
  total_floors?: number;
  total_units?: number;
  units_available?: number;
  construction_status: 'planned' | 'construction' | 'delivered'; // ⚠️ 'planned' vs 'planning' en DB
  // ... amenities ...
}
```

### src/schemas/projectSchema.ts
- Contient déjà une section `buildings` qui est un array d'objets
- Les champs amenities sont gérés dans cette section
- Structure très complète avec 200+ champs

## 🎯 PLAN D'ACTION EN 10 ÉTAPES

### PHASE 1 : PRÉPARATION (Étapes 1-2)
✅ **Étape 1** : Audit complet et backup (ACTUEL)
⏳ **Étape 2** : Corriger les incohérences existantes

### PHASE 2 : AJOUT SÉCURISÉ (Étapes 3-5)
⏳ **Étape 3** : Ajouter les champs manquants dans PROJECTS (sans supprimer)
⏳ **Étape 4** : Mettre à jour les schemas TypeScript
⏳ **Étape 5** : Enrichir le formulaire sans rien retirer

### PHASE 3 : MIGRATION DONNÉES (Étapes 6-7)
⏳ **Étape 6** : Script de copie des données buildings → projects
⏳ **Étape 7** : Validation et tests complets

### PHASE 4 : NETTOYAGE PROGRESSIF (Étapes 8-10)
⏳ **Étape 8** : Marquer les champs obsolètes
⏳ **Étape 9** : Simplifier le formulaire buildings
⏳ **Étape 10** : Nettoyage final (après validation)

## 📊 STATISTIQUES

- **Tables impactées**: 2 (buildings, projects)
- **Champs à migrer**: 15
- **Champs à supprimer**: 12
- **Incohérences à corriger**: 3
- **Fichiers TypeScript à modifier**: ~10
- **Risque**: FAIBLE si suivi méthodique

## ✅ CHECKLIST DE SÉCURITÉ

Avant chaque modification:
- [ ] Backup de la structure DB
- [ ] Export des données existantes
- [ ] Tests sur environnement de dev
- [ ] Validation frontend fonctionnel
- [ ] Pas d'erreur console
- [ ] Formulaires opérationnels
- [ ] SEO préservé
- [ ] Multilingue intact

## 📝 NOTES IMPORTANTES

1. **NE JAMAIS** supprimer de fonctionnalités existantes
2. **TOUJOURS** tester après chaque modification
3. **PRÉSERVER** toutes les sections du formulaire projet
4. **GARDER** la compatibilité arrière jusqu'à validation finale

---

*Document généré automatiquement le 27/09/2025*
*Dernière mise à jour: Étape 1 - Audit initial*
