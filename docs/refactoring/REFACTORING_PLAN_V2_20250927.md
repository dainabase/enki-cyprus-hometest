# 📊 DOCUMENTATION REFACTORING BUILDINGS/PROJECTS - ÉTAT ACTUEL
**Date**: 27 Septembre 2025  
**Repository**: enki-cyprus-hometest  
**Project ID Supabase**: ccsakftsslurjgnjwdci
**Version**: 2.0.0 - Avec logique d'héritage/override

## 🎯 OBJECTIF DU REFACTORING
Implémenter un système d'héritage à 3 niveaux avec possibilité d'override pour gérer les installations et équipements dans une résidence immobilière mixte.

## 📐 LOGIQUE D'HÉRITAGE VALIDÉE

### Principe de cascade avec surcharge
```
PROJET (Valeurs par défaut pour TOUTE la résidence)
    ↓ peut être surchargé par
BÂTIMENT (Valeurs spécifiques à CE bâtiment) 
    ↓ peut être surchargé par
PROPRIÉTÉ (Valeurs spécifiques à CETTE unité)
```

### Règles d'héritage
- **NULL** = hérite de la valeur du parent
- **Valeur définie** = override la valeur du parent
- Si pas de contre-indication → la condition générale projet s'applique

## 📊 ÉTAT ACTUEL DES TABLES

### TABLE PROJECTS (215 colonnes)
#### Champs d'installations existants
- `has_pool` BOOLEAN DEFAULT false
- `has_gym` BOOLEAN DEFAULT false
- `has_spa` BOOLEAN DEFAULT false
- `has_playground` BOOLEAN DEFAULT false
- `has_garden` BOOLEAN DEFAULT false
- `has_parking` BOOLEAN DEFAULT false
- `parking_type` TEXT
- `has_security_system` BOOLEAN DEFAULT false
- `has_cctv` BOOLEAN DEFAULT false
- `has_concierge` BOOLEAN DEFAULT false
- `has_generator` BOOLEAN DEFAULT false
- `has_solar_panels` BOOLEAN DEFAULT false
- `security_features` JSONB DEFAULT '{}'
- `wellness_facilities` JSONB DEFAULT '{}'
- `outdoor_facilities` JSONB DEFAULT '{}'

### TABLE BUILDINGS (58 colonnes)
#### Champs d'installations existants (DUPLICATIONS avec projects)
- `has_pool` BOOLEAN DEFAULT false
- `has_gym` BOOLEAN DEFAULT false
- `has_spa` BOOLEAN DEFAULT false
- `has_playground` BOOLEAN DEFAULT false
- `has_garden` BOOLEAN DEFAULT false
- `has_parking` BOOLEAN DEFAULT false
- `parking_type` TEXT
- `has_generator` BOOLEAN DEFAULT false
- `has_security_system` BOOLEAN DEFAULT false
- `has_cctv` BOOLEAN DEFAULT false
- `has_concierge` BOOLEAN DEFAULT false
- `has_solar_panels` BOOLEAN DEFAULT false
- `security_features` JSONB DEFAULT '{}'
- `wellness_facilities` JSONB DEFAULT '{}'
- `outdoor_facilities` JSONB DEFAULT '{}'

#### Problème actuel
- `building_code` TEXT NOT NULL (mais frontend le traite comme optionnel)
- `construction_status` utilise 'planning' (DB) vs 'planned' (Frontend)

### TABLE PROPERTIES (219 colonnes)
#### Champs privés existants
- `has_private_pool` BOOLEAN DEFAULT false
- `pool_type` TEXT (pour piscine privée)
- `pool_size` TEXT
- `has_private_garden` BOOLEAN DEFAULT false
- `private_garden_area` NUMERIC
- `has_bbq_area` BOOLEAN DEFAULT false
- `has_outdoor_kitchen` BOOLEAN DEFAULT false
- `has_jacuzzi` BOOLEAN DEFAULT false
- `has_sauna` BOOLEAN DEFAULT false
- `has_home_cinema` BOOLEAN DEFAULT false
- `has_wine_cellar` BOOLEAN DEFAULT false
- `has_private_elevator` BOOLEAN DEFAULT false

## 🔄 PLAN DE REFACTORING VALIDÉ

### PHASE 1 : Préparation (Étapes 1-2)
- ✅ **Étape 1** : Documentation et backup (EN COURS)
- ⏳ **Étape 2** : Correction des incohérences

### PHASE 2 : Ajout des champs (Étapes 3-4)
- ⏳ **Étape 3** : Enrichir PROJECTS avec valeurs par défaut
- ⏳ **Étape 4** : Ajuster BUILDINGS pour override (NULL autorisé)

### PHASE 3 : Logique cascade (Étapes 5-6)
- ⏳ **Étape 5** : Créer les fonctions d'héritage
- ⏳ **Étape 6** : Créer les vues matérialisées

### PHASE 4 : Migration et validation (Étapes 7-8)
- ⏳ **Étape 7** : Migration des données existantes
- ⏳ **Étape 8** : Validation et tests

## 📦 CHANGEMENTS PLANIFIÉS

### 1. PROJECTS - Nouveaux champs à ajouter
```sql
-- Services et commodités de la résidence
club_house BOOLEAN DEFAULT false
restaurant BOOLEAN DEFAULT false  
cafe BOOLEAN DEFAULT false
mini_market BOOLEAN DEFAULT false
business_center BOOLEAN DEFAULT false
has_management BOOLEAN DEFAULT false
has_maintenance BOOLEAN DEFAULT false
security_level TEXT DEFAULT 'basic'
```

### 2. BUILDINGS - Modifications
```sql
-- Permettre NULL pour l'héritage
ALTER COLUMN has_pool DROP NOT NULL -- NULL = hérite du projet
ALTER COLUMN has_gym DROP NOT NULL
ALTER COLUMN has_spa DROP NOT NULL
ALTER COLUMN has_playground DROP NOT NULL
ALTER COLUMN has_garden DROP NOT NULL
ALTER COLUMN has_parking DROP NOT NULL
ALTER COLUMN parking_type DROP NOT NULL

-- Ajouter champs spécifiques bâtiment
building_category TEXT -- 'residential', 'commercial', 'mixed', 'villa_complex'
has_private_entrance BOOLEAN
has_lobby BOOLEAN
security_level TEXT -- peut override celui du projet
```

### 3. PROPERTIES - Ajustements
```sql
-- Ajouter pour clarifier le type
is_standalone_villa BOOLEAN DEFAULT false
is_semi_detached BOOLEAN DEFAULT false
is_townhouse BOOLEAN DEFAULT false
property_category TEXT -- 'residential', 'commercial', 'office', 'retail'
```

## 🔗 FONCTIONS D'HÉRITAGE À CRÉER

### Exemple : Résolution de l'accès piscine
```sql
CREATE OR REPLACE FUNCTION property_has_pool(p_property_id UUID) 
RETURNS BOOLEAN AS $$
DECLARE
    v_has_private_pool BOOLEAN;
    v_building_pool BOOLEAN;
    v_project_pool BOOLEAN;
BEGIN
    -- 1. Vérifier piscine privée de la propriété
    SELECT has_private_pool INTO v_has_private_pool
    FROM properties WHERE id = p_property_id;
    
    IF v_has_private_pool IS TRUE THEN
        RETURN TRUE;
    END IF;
    
    -- 2. Vérifier override du bâtiment
    SELECT b.has_pool INTO v_building_pool
    FROM properties p
    JOIN buildings b ON b.id = p.building_id
    WHERE p.id = p_property_id;
    
    IF v_building_pool IS NOT NULL THEN
        RETURN v_building_pool;
    END IF;
    
    -- 3. Utiliser valeur du projet (défaut)
    SELECT proj.has_pool INTO v_project_pool
    FROM properties p
    JOIN projects proj ON proj.id = p.project_id  
    WHERE p.id = p_property_id;
    
    RETURN COALESCE(v_project_pool, FALSE);
END;
$$ LANGUAGE plpgsql;
```

## 📋 CAS D'USAGE À SUPPORTER

### Exemple 1 : Résidence standard
- **PROJET** : `has_pool = true` (piscine commune)
- **Bâtiment A** : `has_pool = NULL` (utilise piscine commune)
- **Bâtiment B** : `has_pool = NULL` (utilise piscine commune)
- **Appartements** : accèdent à la piscine commune

### Exemple 2 : Résidence mixte avec villas
- **PROJET** : `has_pool = true`, `has_gym = true` (installations communes)
- **Bâtiment résidentiel** : `has_pool = NULL` (utilise commune)
- **Complexe de villas** : `has_pool = true` (leur propre piscine)
- **Villa individuelle** : `has_private_pool = true` (piscine privée)

### Exemple 3 : Projet mixte commercial/résidentiel
- **PROJET** : `has_parking = true`, `parking_type = 'mixed'`
- **Bâtiment commercial** : `has_parking = true`, `parking_type = 'underground'` 
- **Bâtiment résidentiel** : `has_parking = NULL` (utilise projet)
- **Bureau** : `parking_spaces = 2` (places assignées)
- **Appartement** : `parking_spaces = 1` (place assignée)

## 🚨 POINTS D'ATTENTION

### Incohérences à corriger
1. **construction_status** : 'planning' (DB) vs 'planned' (Frontend)
2. **building_code** : NOT NULL (DB) vs optionnel (Frontend)
3. **Duplications** : mêmes champs dans projects ET buildings

### Règles de migration
- ❌ **JAMAIS** supprimer de données existantes
- ✅ **TOUJOURS** permettre la réversibilité
- ✅ **TESTER** après chaque modification
- ✅ **VALIDER** avec l'équipe avant passage à l'étape suivante

## 📁 FICHIERS IMPACTÉS

### Frontend - TypeScript
- `src/types/building.ts`
- `src/types/building.project.ts`  
- `src/schemas/projectSchema.ts`
- `src/lib/api/buildings.ts`
- `src/components/admin/buildings/BuildingForm.tsx`
- `src/components/admin/projects/BuildingSection.tsx`

### Backend - Supabase
- Tables : projects, buildings, properties
- Nouvelles fonctions : property_has_pool, etc.
- Nouvelles vues : properties_with_amenities

## ✅ CRITÈRES DE SUCCÈS

1. **Flexibilité** : Support de tous les cas de figure (résidences, villas, mixte)
2. **Performance** : Pas de dégradation des temps de réponse
3. **Intégrité** : Aucune perte de données
4. **Maintenabilité** : Code plus simple et logique claire
5. **Compatibilité** : Frontend continue de fonctionner sans modification majeure

## 🔄 PROCHAINE ÉTAPE

**Étape 2** : Correction des incohérences
- Corriger enum construction_status
- Résoudre building_code nullable
- Aligner types Frontend/Backend

---

**Document créé par** : Assistant IA Claude  
**Pour** : Équipe Enki Reality Cyprus  
**Status** : En cours - Étape 1/8 complétée
