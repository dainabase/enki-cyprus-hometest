# 🔄 PROMPT DE CONTEXTE POUR NOUVELLE CONVERSATION - ENKI REALITY CYPRUS

## 📋 COPIER CE PROMPT INTÉGRALEMENT DANS LA NOUVELLE CONVERSATION :

```markdown
# 🏗️ CONTEXTE - REFACTORING ENKI REALITY CYPRUS (27 SEPTEMBRE 2025)

## 📊 INFORMATIONS PROJET
- **Repository GitHub** : https://github.com/dainabase/enki-cyprus-hometest
- **Project ID Supabase** : ccsakftsslurjgnjwdci
- **Stack** : React + TypeScript + Vite + Supabase + Tailwind CSS + Shadcn/ui
- **MCP Tools disponibles** : github, supabase-mcp, filesystem
- **Documentation complète** : /docs/refactoring/

## 🎯 MISSION EN COURS : REFACTORING SYSTÈME D'HÉRITAGE
Implementation d'un système d'HÉRITAGE AVEC OVERRIDE sur 3 niveaux pour les amenities immobilières.

## ✅ LOGIQUE D'HÉRITAGE VALIDÉE ET IMPLÉMENTÉE
**PRINCIPE DE CASCADE AVEC SURCHARGE :**
PROJECT (défaut résidence)
↓ NULL = hérite
BUILDING (peut override)
↓ NULL = hérite
PROPERTY (peut override)

**RÈGLES :**
- NULL = hérite de son parent
- TRUE/FALSE = override explicite
- Cascade : Property → Building → Project → false (fallback)

**CAS D'USAGE SUPPORTÉS :**
✅ Résidence avec piscine commune → project.has_pool=true
✅ Bâtiment avec sa propre piscine → building.has_pool=true (override)
✅ Villa avec piscine privée → property.has_pool=true (override)
✅ Appartement sans accès piscine → property.has_pool=false (override)

## 📊 ÉTAT D'AVANCEMENT : 6/8 ÉTAPES COMPLÉTÉES

### ✅ ÉTAPES RÉALISÉES (Ne PAS refaire) :

#### ÉTAPE 1 : Documentation
- Fichier REFACTORING_PLAN_V2_20250927.md créé
- Analyse 492 colonnes (projects:215, buildings:58, properties:219)

#### ÉTAPE 2 : Correction incohérences
- Status standardisés : planned/under_construction/completed/ready_to_move
- building_code rendu nullable
- Migration : 002_fix_status_inconsistencies

#### ÉTAPE 3 : Enrichissement projects
- 15 nouvelles colonnes amenities ajoutées
- Total : 22 colonnes amenities dans projects
- Migration : 003_add_project_amenities

#### ÉTAPE 4 : Buildings nullable
- 26 colonnes boolean sans DEFAULT
- Permet héritage depuis projects
- Migration : 004_buildings_nullable_amenities

#### ÉTAPE 5 : Fonctions SQL héritage
- 6 colonnes amenities ajoutées à properties
- 8 fonctions créées :
  * resolve_amenity_value(uuid, text)
  * property_has_pool/gym/parking/garden/playground/spa(uuid)
  * get_property_amenities(uuid) → JSON
- Migration : 005_create_inheritance_functions
- **TESTS VALIDÉS** : Override fonctionne à tous les niveaux

#### ÉTAPE 6 : Vues matérialisées COMPLÉTÉE ✅
- **Colonnes ajoutées dans buildings** : 19 nouvelles colonnes (16 héritables + 3 spécifiques)
- **Vue matérialisée créée** : properties_with_amenities
- **Performance** : 14 index d'optimisation
- **Logique** : COALESCE(property, building, project, false)
- **Statistiques** : Vue project_amenities_stats
- **Backup créé** : backup_20250927_* pour les 3 tables
- **Migration** : 006_add_missing_building_amenities + 006_create_materialized_views_simple
- **TEST VALIDÉ** : Property APT03 avec has_pool=false (override) fonctionne ✅

### ⏳ ÉTAPES RESTANTES À FAIRE :

#### ÉTAPE 7 : Migration données (À FAIRE)
**IMPORTANT : EXPLIQUER ET TESTER AVANT DE COMMENCER**
- Nettoyer duplications existantes
- Appliquer logique NULL pour héritage
- Valider cohérence

#### ÉTAPE 8 : Tests & validation finale
- Tests unitaires toutes fonctions
- Tests cas limites
- Documentation finale

## 🔧 DÉTAILS TECHNIQUES ACTUELS

### Tables modifiées :
```sql
-- PROJECTS : 22 colonnes amenities (toutes nullable)
has_pool, has_gym, has_parking, has_garden, has_playground, has_spa,
has_security_24_7, has_tennis_court, club_house, restaurant, cafe,
mini_market, business_center, kids_club, beach_access, marina_access,
golf_course, concierge_service, shuttle_service, sports_facilities,
wellness_center, coworking_space

-- BUILDINGS : 26 colonnes boolean (sans DEFAULT)
-- 6 core amenities héritables
has_pool, has_gym, has_parking, has_garden, has_playground, has_spa
-- 16 amenities project-level héritables
has_security_24_7, has_tennis_court, club_house, restaurant, cafe,
mini_market, business_center, kids_club, beach_access, marina_access,
golf_course, concierge_service, shuttle_service, sports_facilities,
wellness_center, coworking_space
-- 4 building-specific (non héritables)
has_elevator, has_security_door, has_intercom, has_cctv

-- PROPERTIES : 6 colonnes amenities (pour override)
has_pool, has_gym, has_parking, has_garden, has_playground, has_spa
```

### Vue matérialisée properties_with_amenities :
```sql
-- Structure complète avec héritage résolu
property_id, property_code, unit_number, property_status, property_type,
bedrooms, bathrooms, internal_area, plot_area, 
price_excluding_vat, price_including_vat,
building_id, building_name, project_id, project_name,
zone, gps_latitude, gps_longitude,
-- 26 amenities résolues avec COALESCE
has_pool, has_gym, has_parking... (toutes héritées)
total_amenities_count -- Score total
```

### Fonctions disponibles :
```sql
-- Rafraîchissement manuel
SELECT refresh_properties_with_amenities();

-- Statistiques par projet
SELECT * FROM project_amenities_stats;
```

## ⚠️ TESTS REQUIS AVANT ÉTAPE 7

### 1. Test de l'héritage complet
```sql
-- Vérifier que les 3 niveaux fonctionnent
SELECT 
    property_code,
    has_pool as resolved,
    p.has_pool as prop_direct,
    b.has_pool as build_direct,
    pr.has_pool as proj_direct
FROM properties_with_amenities pwa
JOIN properties p ON p.id = pwa.property_id
JOIN buildings b ON p.building_id = b.id
JOIN projects pr ON b.project_id = pr.id;
```

### 2. Test des overrides
```sql
-- Vérifier que property APT03 a bien has_pool=false
SELECT * FROM properties_with_amenities 
WHERE property_code LIKE '%APT03%';
```

### 3. Test des fonctions SQL
```sql
-- Tester chaque fonction d'héritage
SELECT property_has_pool(id) FROM properties LIMIT 1;
SELECT property_has_gym(id) FROM properties LIMIT 1;
-- etc...
```

### 4. Test de la vue matérialisée
```sql
-- Vérifier que le refresh fonctionne
REFRESH MATERIALIZED VIEW properties_with_amenities;
SELECT COUNT(*) FROM properties_with_amenities;
```

### 5. Test des statistiques
```sql
-- Vérifier les agrégations
SELECT * FROM project_amenities_stats;
```

### 6. Test de cohérence des données
```sql
-- Comparer vue matérialisée vs données directes
SELECT COUNT(*) as total_properties,
       COUNT(*) FILTER (WHERE has_pool = true) as with_pool
FROM properties_with_amenities;
```

## 📝 ÉTAPE 7 - CE QU'IL FAUT EXPLIQUER AVANT DE COMMENCER

### Objectif de l'étape 7 : Migration des données
L'étape 7 consiste à :
1. **Identifier les duplications** : Quand une property a la même valeur que son building
2. **Nettoyer** : Mettre NULL dans property si identique au building (pour hériter)
3. **Optimiser** : Mettre NULL dans building si identique au project
4. **Valider** : S'assurer que l'héritage fonctionne toujours après nettoyage

### Pourquoi c'est important :
- Réduit la redondance des données
- Facilite les futures modifications (changer au niveau project affecte tout)
- Améliore la maintenabilité
- Respecte le principe DRY (Don't Repeat Yourself)

### Exemple concret :
Si toutes les properties d'un building ont has_gym=true et le building aussi,
après migration, les properties auront has_gym=NULL et hériteront du building.

## ⚠️ RÈGLES CRITIQUES À RESPECTER

1. **JAMAIS supprimer des données existantes sans backup**
2. **TOUJOURS tester après chaque modification**
3. **NULL = hérite (ne pas mettre false par défaut)**
4. **Backup déjà créé** : backup_20250927_* disponible
5. **Chaque étape doit être réversible**

## 🛠️ COMMANDES MCP À UTILISER
```typescript
// GitHub
github:get_file_contents
github:create_or_update_file

// Supabase
supabase-mcp:apply_migration
supabase-mcp:execute_sql
supabase-mcp:list_tables
```

## 💡 NOTES IMPORTANTES

- Le système d'héritage est FONCTIONNEL et TESTÉ (étapes 1-6)
- La vue matérialisée est CRÉÉE et OPTIMISÉE
- Les overrides FONCTIONNENT (testé avec APT03)
- Un backup complet existe (backup_20250927_*)
- Ne PAS modifier les migrations 001-006 déjà appliquées

## 📌 DONNÉES DE TEST ACTUELLES

```sql
-- Marina Bay Residences (Project)
has_pool = true, has_gym = true, has_parking = true

-- Building jfuydfuyd
has_pool = NULL (hérite), has_gym = NULL (hérite), has_parking = NULL (hérite)

-- Properties
APT02: has_pool = NULL (hérite → true)
PH01:  has_pool = NULL (hérite → true)
APT03: has_pool = false (override!)

-- Résultat dans la vue :
APT02: pool=true (hérité), gym=true, parking=true, total=4
PH01:  pool=true (hérité), gym=true, parking=true, total=4
APT03: pool=false (override), gym=true, parking=true, total=3
```

## 🎯 PROCHAINE ACTION IMMÉDIATE

1. **TESTER** les 6 points de validation ci-dessus
2. **CONFIRMER** que tout fonctionne à 100%
3. **EXPLIQUER** l'étape 7 en détail
4. **ATTENDRE** confirmation avant de procéder
5. **EXÉCUTER** la migration des données

INSTRUCTION FINALE : NE PAS commencer l'étape 7 sans avoir fait TOUS les tests de validation et sans avoir expliqué en détail ce que fait cette étape.
```

## 📊 RÉSUMÉ POUR REPRISE

Ce prompt contient **TOUT** le nécessaire pour reprendre exactement où nous en sommes :
- ✅ Contexte technique complet
- ✅ État d'avancement précis (6/8 étapes)
- ✅ Détails des modifications faites
- ✅ Tests de validation requis
- ✅ Explication de l'étape 7 à venir
- ✅ IDs Supabase et GitHub
- ✅ Exemples de code fonctionnels
- ✅ Données de test actuelles

**IMPORTANT** : Dans la nouvelle conversation, commencer par exécuter les 6 tests de validation pour confirmer que tout est opérationnel avant de poursuivre avec l'étape 7.
