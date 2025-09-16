-- NETTOYAGE COMPLET - Supprimer TOUTES les contraintes de statut (anciennes et nouvelles)
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_statut_commercial_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_statut_travaux_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS check_statut_commercial;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS check_statut_travaux;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_furniture_status_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_project_status_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_reservation_status_check;

-- Supprimer aussi toutes les autres contraintes de statut potentielles
DROP CONSTRAINT IF EXISTS projects_construction_phase_check;
DROP CONSTRAINT IF EXISTS projects_title_deed_status_check;
DROP CONSTRAINT IF EXISTS projects_reservation_status_check;