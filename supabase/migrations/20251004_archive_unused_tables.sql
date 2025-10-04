-- ================================================
-- MIGRATION: Archive des tables inutilisées
-- ================================================
-- Date: 4 octobre 2025
-- Auteur: Claude (MCP Audit)
-- Ticket: Phase 2 - Nettoyage base de données
-- ================================================

/*
OBJECTIF:
- Documenter les tables avec 0 lignes (jamais utilisées)
- Ajouter des commentaires d'archivage
- Désactiver les triggers non critiques
- NE PAS SUPPRIMER les tables (gardées pour futur usage)
*/

-- ================================================
-- TABLES À ARCHIVER (0 rows depuis création)
-- ================================================

-- CRM & COMMERCIAL (5 tables vides)
COMMENT ON TABLE leads IS '⚠️ ARCHIVED - Table vide depuis création. CRM non activé. Prête pour usage futur.';
COMMENT ON TABLE lead_activities IS '⚠️ ARCHIVED - Table vide. Dépend de leads non utilisé.';
COMMENT ON TABLE commissions IS '⚠️ ARCHIVED - Table vide. Facturation non activée. Prête pour usage futur.';
COMMENT ON TABLE commission_payments IS '⚠️ ARCHIVED - Table vide. Dépend de commissions non utilisé.';
COMMENT ON TABLE dossiers IS '⚠️ ARCHIVED - Table vide. Feature dossiers PDF non déployée.';

-- MÉDIAS & DOCUMENTS (2 tables vides)
COMMENT ON TABLE building_images IS '⚠️ ARCHIVED - Table vide. Utiliser project_images à la place.';
COMMENT ON TABLE project_documents IS '⚠️ ARCHIVED - Table vide. Upload documents non activé.';

-- DRAFTS AUTO-SAVE (7 tables vides)
COMMENT ON TABLE property_drafts IS '⚠️ ARCHIVED - Table vide. Auto-save properties non utilisé.';
COMMENT ON TABLE building_drafts IS '⚠️ ARCHIVED - Table vide. Auto-save buildings non utilisé.';
COMMENT ON TABLE developer_drafts IS '⚠️ ARCHIVED - Table vide. Auto-save developers non utilisé.';
COMMENT ON TABLE contact_drafts IS '⚠️ ARCHIVED - Table vide. Auto-save contact form non utilisé.';
COMMENT ON TABLE registration_drafts IS '⚠️ ARCHIVED - Table vide. Auto-save registration non utilisé.';
COMMENT ON TABLE lexaia_drafts IS '⚠️ ARCHIVED - Table vide. Feature Lexaia IA non déployée.';
COMMENT ON TABLE search_drafts IS '⚠️ ARCHIVED - Table vide. Auto-save search non utilisé.';

-- ADMIN & ANALYTICS (2 tables vides)
COMMENT ON TABLE admin_audit_log IS '⚠️ ARCHIVED - Table vide. Audit logs non activés.';
COMMENT ON TABLE favorites IS '⚠️ ARCHIVED - Table vide. Feature favoris non utilisée.';

-- ================================================
-- TABLES ACTIVES (À GARDER SANS CHANGEMENT)
-- ================================================

-- ✅ Tables principales avec données
COMMENT ON TABLE developers IS '✅ ACTIVE - 22 developers. Table racine hiérarchie.';
COMMENT ON TABLE projects IS '✅ ACTIVE - 4 projets. 219 colonnes. Hiérarchie niveau 1.';
COMMENT ON TABLE buildings IS '✅ ACTIVE - 4 bâtiments. 99 colonnes. Hiérarchie niveau 2.';
COMMENT ON TABLE properties IS '✅ ACTIVE - 1 propriété. 225 colonnes. Hiérarchie niveau 3 (feuille).';

-- ✅ Tables référentiels complets
COMMENT ON TABLE amenities IS '✅ ACTIVE - 31 équipements. Référentiel complet.';
COMMENT ON TABLE nearby_amenities IS '✅ ACTIVE - 49 commodités. Référentiel complet.';
COMMENT ON TABLE project_amenities IS '✅ ACTIVE - 21 associations projets-équipements.';
COMMENT ON TABLE project_nearby_amenities IS '✅ ACTIVE - 14 associations projets-commodités.';

-- ✅ Tables analytics actives
COMMENT ON TABLE analytics_events IS '✅ ACTIVE - 18,471 événements. Tracking très actif.';
COMMENT ON TABLE analytics_rate_limits IS '✅ ACTIVE - 9,300 entrées. Rate limiting actif.';

-- ✅ Tables support utilisées
COMMENT ON TABLE profiles IS '✅ ACTIVE - 1 profile admin. Auth système.';
COMMENT ON TABLE notification_preferences IS '✅ ACTIVE - 1 configuration. Préférences user.';
COMMENT ON TABLE checklists IS '✅ ACTIVE - 1 checklist. Feature utilisée.';
COMMENT ON TABLE project_images IS '✅ ACTIVE - 10 images. Galeries actives.';
COMMENT ON TABLE project_drafts IS '✅ ACTIVE - 25 brouillons. Auto-save fonctionnel.';
COMMENT ON TABLE promoters IS '✅ ACTIVE - 5 commerciaux. Gestion promoteurs.';
COMMENT ON TABLE pipeline_stages IS '✅ ACTIVE - 6 étapes. Pipeline configuré.';
COMMENT ON TABLE project_ai_imports IS '✅ ACTIVE - 4 imports. IA document extraction utilisée.';

-- ⚠️ Tables peu utilisées (à surveiller)
COMMENT ON TABLE ab_tests IS '⚠️ WATCH - 1 test A/B. Feature peu utilisée.';
COMMENT ON TABLE ab_test_assignments IS '⚠️ WATCH - 28 assignations. Feature peu utilisée.';

-- ================================================
-- DÉSACTIVATION TRIGGERS NON CRITIQUES
-- ================================================

-- Note: Les triggers sont laissés actifs car ils ne consomment pas
-- de ressources sur des tables vides. Ils seront prêts si les tables
-- sont réactivées dans le futur.

-- ================================================
-- STATISTIQUES POST-ARCHIVAGE
-- ================================================

DO $$
DECLARE
    active_tables INT;
    archived_tables INT;
    watch_tables INT;
BEGIN
    -- Compter tables actives (commentaire contient 'ACTIVE')
    SELECT COUNT(*) INTO active_tables
    FROM pg_tables t
    JOIN pg_description d ON d.objoid = (t.schemaname||'.'||t.tablename)::regclass
    WHERE t.schemaname = 'public' 
    AND d.description LIKE '%ACTIVE%';
    
    -- Compter tables archivées (commentaire contient 'ARCHIVED')
    SELECT COUNT(*) INTO archived_tables
    FROM pg_tables t
    JOIN pg_description d ON d.objoid = (t.schemaname||'.'||t.tablename)::regclass
    WHERE t.schemaname = 'public' 
    AND d.description LIKE '%ARCHIVED%';
    
    -- Compter tables à surveiller (commentaire contient 'WATCH')
    SELECT COUNT(*) INTO watch_tables
    FROM pg_tables t
    JOIN pg_description d ON d.objoid = (t.schemaname||'.'||t.tablename)::regclass
    WHERE t.schemaname = 'public' 
    AND d.description LIKE '%WATCH%';
    
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'STATISTIQUES POST-ARCHIVAGE';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Tables actives (✅): %', active_tables;
    RAISE NOTICE 'Tables archivées (⚠️): %', archived_tables;
    RAISE NOTICE 'Tables à surveiller (⚠️): %', watch_tables;
    RAISE NOTICE '==============================================';
END $$;

-- ================================================
-- RECOMMANDATIONS FUTURES
-- ================================================

/*
POUR RÉACTIVER UNE TABLE ARCHIVÉE:

1. Supprimer le commentaire ARCHIVED:
   COMMENT ON TABLE nom_table IS 'Description normale';

2. Vérifier que les triggers sont actifs:
   SELECT * FROM pg_trigger WHERE tgrelid = 'nom_table'::regclass;

3. Tester l'insertion de données:
   INSERT INTO nom_table (...) VALUES (...);

4. Mettre à jour le statut dans MIGRATIONS_INVENTORY.md
*/

-- ================================================
-- FIN DE LA MIGRATION D'ARCHIVAGE
-- ================================================
