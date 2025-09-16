-- Corriger les contraintes selon vos demandes exactes

-- 1. Supprimer les contraintes existantes
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_statut_commercial_check;

-- 2. Recréer le statut du projet SANS "vendu" et AVEC "pret_a_emmenager"
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('disponible', 'en_construction', 'livre', 'pret_a_emmenager'));

-- 3. Corriger le statut commercial avec la vraie valeur "derniere_opportunite" (pas "derniere_opportunite_vendue")
ALTER TABLE projects ADD CONSTRAINT projects_statut_commercial_check
CHECK (statut_commercial IS NULL OR statut_commercial IN ('pre_lancement', 'lancement_commercial', 'en_commercialisation', 'derniere_opportunite'));