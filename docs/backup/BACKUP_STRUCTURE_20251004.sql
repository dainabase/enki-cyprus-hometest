-- ================================================
-- BACKUP SUPABASE - ENKI REALITY CYPRUS
-- ================================================
-- Date: 4 octobre 2025
-- Project ID: ccsakftsslurjgnjwdci
-- Auditeur: Claude (MCP Supabase)
-- ================================================

-- ================================================
-- STATISTIQUES GÉNÉRALES
-- ================================================
-- Total tables schema public: 42
-- Total migrations appliquées: 196
-- Total developers: 22
-- Total projects: 4
-- Total buildings: 4
-- Total properties: 1
-- Total leads: 0
-- Total commissions: 0
-- Total analytics_events: 18,471

-- ================================================
-- PROJETS ACTUELS (PRODUCTION DATA)
-- ================================================
-- 1. Azure Marina Paradise (Germasogeia) - azure-marina-paradise-limassol
-- 2. Mountain View Villas (Limassol Hills) - mountain-view-villas-limassol
-- 3. Skyline Tower (Nicosia) - skyline-tower-nicosia
-- 4. Marina Bay Residences (Limassol) - marina-bay-residences-limassol

-- ================================================
-- STRUCTURE DES TABLES PRINCIPALES
-- ================================================

-- TABLE: developers (31 colonnes, 22 rows)
-- Hiérarchie: RACINE
-- Relations: -> projects, -> properties
-- RLS: Activé ✅

-- TABLE: projects (219 colonnes, 4 rows) ⚠️ TRÈS LARGE
-- Hiérarchie: Niveau 1
-- Relations: developers -> projects -> buildings
-- RLS: Activé ✅
-- Champs critiques:
--   - id (uuid, PK)
--   - developer_id (uuid, FK -> developers)
--   - title, city, region, cyprus_zone
--   - price_from, price_to, golden_visa_eligible
--   - total_units, units_available, units_sold
--   - status, construction_phase
--   - 200+ autres champs (amenities, photos, legal, SEO, etc.)

-- TABLE: buildings (99 colonnes, 4 rows)
-- Hiérarchie: Niveau 2
-- Relations: projects -> buildings -> properties
-- RLS: Activé ✅
-- Champs critiques:
--   - id (uuid, PK)
--   - project_id (uuid, FK -> projects)
--   - building_code, building_name
--   - total_floors, total_units
--   - construction_status, expected_completion
--   - Équipements héritables (has_pool, has_gym, has_spa, etc.)

-- TABLE: properties (225 colonnes, 1 row) ⚠️ LA PLUS LARGE
-- Hiérarchie: Niveau 3 (FEUILLE)
-- Relations: projects -> buildings -> properties
-- RLS: Activé ✅
-- Champs critiques:
--   - id (uuid, PK)
--   - project_id (uuid, FK -> projects)
--   - building_id (uuid, FK -> buildings)
--   - developer_id (uuid, FK -> developers)
--   - property_code (unique), unit_number
--   - property_type, property_status
--   - bedrooms_count, bathrooms_count
--   - internal_area, covered_verandas
--   - price_excluding_vat, vat_rate, price_including_vat
--   - golden_visa_eligible, commission_rate
--   - 200+ autres champs (amenities, finitions, legal, etc.)

-- ================================================
-- TABLES CRM & COMMERCIAL
-- ================================================

-- TABLE: leads (20 colonnes, 0 rows) ❌ VIDE
-- Usage: Gestion prospects CRM
-- Champs: first_name, last_name, email, phone, budget, urgency, status, score

-- TABLE: lead_activities (6 colonnes, 0 rows) ❌ VIDE
-- Usage: Historique activités leads

-- TABLE: pipeline_stages (7 colonnes, 6 rows) ✅ CONFIGURÉ
-- Usage: Étapes du pipeline de vente

-- TABLE: commissions (9 colonnes, 0 rows) ❌ VIDE
-- Usage: Calcul commissions ventes

-- TABLE: commission_payments (9 colonnes, 0 rows) ❌ VIDE
-- Usage: Suivi paiements commissions

-- TABLE: promoters (7 colonnes, 5 rows) ✅ DONNÉES
-- Usage: Gestion commerciaux/promoteurs

-- ================================================
-- TABLES MÉDIAS & DOCUMENTS
-- ================================================

-- TABLE: project_images (7 colonnes, 10 rows) ✅ UTILISÉ
-- Usage: Galeries photos projets

-- TABLE: building_images (7 colonnes, 0 rows) ❌ VIDE
-- Usage: Galeries photos bâtiments

-- TABLE: project_documents (12 colonnes, 0 rows) ❌ VIDE
-- Usage: Documents légaux/descriptifs

-- TABLE: project_ai_imports (11 colonnes, 4 rows) ✅ UTILISÉ
-- Usage: Imports IA de documents

-- ================================================
-- TABLES ÉQUIPEMENTS & RÉFÉRENTIELS
-- ================================================

-- TABLE: amenities (10 colonnes, 31 rows) ✅ COMPLET
-- Usage: Référentiel équipements intérieurs
-- Catégories: essential, recreation, wellness, security, business, lifestyle, connectivity, outdoor

-- TABLE: nearby_amenities (10 colonnes, 49 rows) ✅ COMPLET
-- Usage: Référentiel commodités environnantes
-- Catégories: education, transport, health, shopping, leisure, services, dining, nature

-- TABLE: project_amenities (7 colonnes, 21 rows) ✅ UTILISÉ
-- Usage: Association projets <-> équipements

-- TABLE: project_nearby_amenities (9 colonnes, 14 rows) ✅ UTILISÉ
-- Usage: Association projets <-> commodités environnantes

-- ================================================
-- TABLES ANALYTICS & TRACKING
-- ================================================

-- TABLE: analytics_events (8 colonnes, 18,471 rows) ✅ TRÈS ACTIF
-- Usage: Tracking événements utilisateurs
-- Données: page_view, property_view, search, contact_form, etc.

-- TABLE: analytics_rate_limits (7 colonnes, 9,300 rows) ✅ ACTIF
-- Usage: Limitation rate tracking

-- TABLE: ab_tests (8 colonnes, 1 row) ⚠️ PEU UTILISÉ
-- Usage: Tests A/B

-- TABLE: ab_test_assignments (6 colonnes, 28 rows) ⚠️ PEU UTILISÉ
-- Usage: Assignations tests A/B

-- ================================================
-- TABLES AUTH & PROFILS
-- ================================================

-- TABLE: profiles (6 colonnes, 1 row) ✅ ADMIN CRÉÉ
-- Usage: Profils utilisateurs
-- Relation: auth.users -> profiles

-- TABLE: notification_preferences (8 colonnes, 1 row) ✅ CONFIGURÉ
-- Usage: Préférences notifications

-- TABLE: favorites (4 colonnes, 0 rows) ❌ VIDE
-- Usage: Favoris utilisateurs

-- TABLE: checklists (6 colonnes, 1 row) ✅ UTILISÉ
-- Usage: Checklists personnalisées

-- TABLE: dossiers (9 colonnes, 0 rows) ❌ VIDE
-- Usage: Dossiers immobiliers compilés

-- ================================================
-- TABLES DRAFTS (AUTO-SAVE)
-- ================================================

-- TABLE: project_drafts (10 colonnes, 25 rows) ✅ UTILISÉ
-- Usage: Sauvegarde auto formulaires projets

-- TABLE: property_drafts (9 colonnes, 0 rows) ❌ VIDE
-- TABLE: building_drafts (9 colonnes, 0 rows) ❌ VIDE
-- TABLE: developer_drafts (10 colonnes, 0 rows) ❌ VIDE
-- TABLE: contact_drafts (7 colonnes, 0 rows) ❌ VIDE
-- TABLE: registration_drafts (7 colonnes, 0 rows) ❌ VIDE
-- TABLE: lexaia_drafts (7 colonnes, 0 rows) ❌ VIDE
-- TABLE: search_drafts (7 colonnes, 0 rows) ❌ VIDE

-- ================================================
-- TABLES ADMIN & AUDIT
-- ================================================

-- TABLE: admin_audit_log (9 colonnes, 0 rows) ❌ VIDE
-- Usage: Logs actions admin

-- ================================================
-- TABLES DESIGN SYSTEM (ENKI)
-- ================================================

-- TABLE: enki_components (5 colonnes, ?) ⚠️ STATUT INCONNU
-- TABLE: enki_theme (14 colonnes, ?) ⚠️ STATUT INCONNU
-- TABLE: design_system_config (17 colonnes, ?) ⚠️ STATUT INCONNU
-- TABLE: component_library (15 colonnes, ?) ⚠️ STATUT INCONNU

-- ================================================
-- RECOMMANDATIONS BACKUP
-- ================================================

-- BACKUP COMPLET RECOMMANDÉ:
-- 1. Exporter via Supabase Dashboard
--    - Aller sur ccsakftsslurjgnjwdci.supabase.co
--    - Database > Backups > Create backup
--    - Télécharger le dump SQL complet

-- 2. Backup automatique via CLI:
--    supabase db dump -f backup_$(date +%Y%m%d).sql

-- 3. Exporter les données critiques:
--    pg_dump -h db.ccsakftsslurjgnjwdci.supabase.co \
--            -U postgres \
--            -d postgres \
--            -t public.developers \
--            -t public.projects \
--            -t public.buildings \
--            -t public.properties \
--            > enki_data_backup.sql

-- ================================================
-- NOTES IMPORTANTES
-- ================================================

-- ⚠️ TABLES TRÈS LARGES:
-- - properties: 225 colonnes (risque de dépassement limite PostgreSQL)
-- - projects: 219 colonnes (risque de dépassement limite PostgreSQL)
-- Considérer une normalisation future si >250 colonnes

-- ✅ TABLES ACTIVES ET SAINES:
-- - developers (22 entrées)
-- - amenities + nearby_amenities (référentiels complets)
-- - analytics_events (tracking actif)
-- - project_drafts (auto-save fonctionnel)

-- ❌ TABLES À ARCHIVER (0 rows):
-- - leads, lead_activities, commissions, commission_payments
-- - building_images, project_documents
-- - dossiers, admin_audit_log
-- - 7 tables *_drafts vides

-- ================================================
-- FIN DU BACKUP DOCUMENTATION
-- ================================================
