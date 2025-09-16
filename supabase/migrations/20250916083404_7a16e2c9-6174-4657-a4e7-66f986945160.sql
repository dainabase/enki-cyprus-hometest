-- Étape 1: Migrer les données existantes vers les nouvelles valeurs

-- Corriger le statut du projet
UPDATE projects 
SET status = CASE 
  WHEN status = 'under_construction' THEN 'en_construction'
  WHEN status = 'available' THEN 'disponible'  
  WHEN status = 'delivered' THEN 'livre'
  WHEN status = 'sold' THEN 'vendu'
  ELSE 'en_construction'  -- valeur par défaut
END
WHERE status IS NOT NULL;

-- Corriger le statut commercial  
UPDATE projects 
SET statut_commercial = CASE 
  WHEN statut_commercial = 'pre_lancement' THEN 'pre_lancement'  -- déjà correct
  WHEN statut_commercial = 'en_commercialisation' THEN 'en_commercialisation'  -- déjà correct
  WHEN statut_commercial = 'lancement_commercial' THEN 'lancement_commercial'
  WHEN statut_commercial = 'dernieres_opportunites' THEN 'derniere_opportunite_vendue'
  WHEN statut_commercial = 'vendu' THEN 'derniere_opportunite_vendue'
  ELSE statut_commercial
END
WHERE statut_commercial IS NOT NULL;

-- Corriger le statut travaux
UPDATE projects 
SET statut_travaux = CASE 
  WHEN statut_travaux = 'achevement' THEN 'achevement'  -- déjà correct
  WHEN statut_travaux = 'travaux_en_cours' THEN 'travaux_en_cours'  -- déjà correct
  WHEN statut_travaux = 'preparation_chantier' THEN 'preparation_chantier'
  WHEN statut_travaux = 'pret_a_emmenager' THEN 'pret_a_emmenager'
  ELSE statut_travaux
END
WHERE statut_travaux IS NOT NULL;