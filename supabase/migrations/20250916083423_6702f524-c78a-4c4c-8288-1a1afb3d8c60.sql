-- Étape 1: Supprimer complètement toutes les contraintes CHECK existantes sur les statuts
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_statut_commercial_check;  
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_statut_travaux_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_furniture_status_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_project_status_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_reservation_status_check;