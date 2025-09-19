-- PHASE 1: SAUVEGARDE COMPLÈTE DES DONNÉES EXISTANTES
-- Création des tables de backup avec horodatage pour sécurité

-- 1.1 Sauvegarde complète de la table projects
CREATE TABLE backup_projects_20250119 AS 
SELECT * FROM projects;

-- 1.2 Sauvegarde complète de la table developers  
CREATE TABLE backup_developers_20250119 AS 
SELECT * FROM developers;

-- 1.3 Sauvegarde complète de la table buildings
CREATE TABLE backup_buildings_20250119 AS 
SELECT * FROM buildings;

-- 1.4 Sauvegarde de properties et properties_test
CREATE TABLE backup_properties_20250119 AS 
SELECT * FROM properties;

CREATE TABLE backup_properties_test_20250119 AS 
SELECT * FROM properties_test;

-- 1.5 Rapport de sauvegarde avec count de chaque table
CREATE TABLE migration_report_20250119 (
    table_name TEXT,
    row_count INTEGER,
    backup_created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO migration_report_20250119 (table_name, row_count)
VALUES 
    ('backup_projects_20250119', (SELECT COUNT(*) FROM backup_projects_20250119)),
    ('backup_developers_20250119', (SELECT COUNT(*) FROM backup_developers_20250119)),
    ('backup_buildings_20250119', (SELECT COUNT(*) FROM backup_buildings_20250119)),
    ('backup_properties_20250119', (SELECT COUNT(*) FROM backup_properties_20250119)),
    ('backup_properties_test_20250119', (SELECT COUNT(*) FROM backup_properties_test_20250119));