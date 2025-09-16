-- Étape 3: Créer les nouvelles contraintes CHECK avec les valeurs exactes spécifiées

-- 1. Statut du projet : disponible, en construction, livré, vendu
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('disponible', 'en_construction', 'livre', 'vendu'));

-- 2. Statut commercial : pré-lancement, lancement commercial, en commercialisation, dernière opportunité vendue  
ALTER TABLE projects ADD CONSTRAINT projects_statut_commercial_check
CHECK (statut_commercial IS NULL OR statut_commercial IN ('pre_lancement', 'lancement_commercial', 'en_commercialisation', 'derniere_opportunite_vendue'));

-- 3. Statut travaux : préparation chantier, travaux en cours, achèvement, prêt à emménager
ALTER TABLE projects ADD CONSTRAINT projects_statut_travaux_check  
CHECK (statut_travaux IS NULL OR statut_travaux IN ('preparation_chantier', 'travaux_en_cours', 'achevement', 'pret_a_emmenager'));