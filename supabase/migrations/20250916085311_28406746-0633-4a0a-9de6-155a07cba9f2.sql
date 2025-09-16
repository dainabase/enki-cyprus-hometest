-- RECRÉER SEULEMENT LES BONNES CONTRAINTES - Version finale et propre

-- 1. Statut du projet : disponible, en_construction, livre, pret_a_emmenager
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('disponible', 'en_construction', 'livre', 'pret_a_emmenager'));

-- 2. Statut commercial : pre_lancement, lancement_commercial, en_commercialisation, derniere_opportunite
ALTER TABLE projects ADD CONSTRAINT projects_statut_commercial_check
CHECK (statut_commercial IS NULL OR statut_commercial IN ('pre_lancement', 'lancement_commercial', 'en_commercialisation', 'derniere_opportunite'));

-- 3. Statut travaux : preparation_chantier, travaux_en_cours, achevement, pret_a_emmenager
ALTER TABLE projects ADD CONSTRAINT projects_statut_travaux_check  
CHECK (statut_travaux IS NULL OR statut_travaux IN ('preparation_chantier', 'travaux_en_cours', 'achevement', 'pret_a_emmenager'));