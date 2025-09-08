-- Migration: Supprimer le champ 'type' redondant de la table projects
-- Ce champ est remplacé par property_category et property_sub_type

BEGIN;

-- Supprimer la colonne 'type' qui fait doublon avec property_category/property_sub_type
ALTER TABLE projects 
DROP COLUMN IF EXISTS type;

-- Ajouter un commentaire pour documenter la suppression
COMMENT ON TABLE projects IS 'Table des projets immobiliers - le champ type a été supprimé car redondant avec property_category et property_sub_type';

COMMIT;