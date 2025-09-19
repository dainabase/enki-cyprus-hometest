-- Clean up old database tables (keeping backups and new _clean, _enhanced, _final tables)

-- Drop old tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS buildings CASCADE; 
DROP TABLE IF EXISTS properties CASCADE;

-- Verify backup tables still exist (DO NOT DROP)
SELECT 'Backup tables preserved:' as status, count(*) as backup_count 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'backup_%';

-- Verify new production tables still exist (DO NOT DROP)
SELECT 'Production tables:' as status, 
       string_agg(tablename, ', ') as tables
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('projects_clean', 'buildings_enhanced', 'properties_final');