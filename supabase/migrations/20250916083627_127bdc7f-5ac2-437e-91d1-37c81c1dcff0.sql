-- Étape 2: Migrer les données existantes vers les nouvelles valeurs

-- Corriger le statut du projet
UPDATE projects 
SET status = CASE 
  WHEN status = 'under_construction' THEN 'en_construction'
  WHEN status = 'available' THEN 'disponible'  
  WHEN status = 'delivered' THEN 'livre'
  WHEN status = 'sold' THEN 'vendu'
  WHEN status = 'pre_launch' THEN 'disponible'
  ELSE 'en_construction'  -- valeur par défaut sécurisée
END
WHERE status IS NOT NULL;

-- Vérifier et corriger le statut commercial si nécessaire
UPDATE projects 
SET statut_commercial = CASE 
  WHEN statut_commercial = 'dernieres_opportunites' THEN 'derniere_opportunite_vendue'
  WHEN statut_commercial = 'vendu' THEN 'derniere_opportunite_vendue'
  ELSE statut_commercial  -- garder les valeurs déjà correctes
END
WHERE statut_commercial IS NOT NULL;

-- Le statut travaux semble déjà correct selon mes vérifications
-- Mais au cas où, on s'assure de la cohérence
UPDATE projects 
SET statut_travaux = CASE 
  WHEN statut_travaux = 'pret_a_emmenager' THEN 'pret_a_emmenager'  
  ELSE statut_travaux  -- garder les valeurs déjà correctes
END
WHERE statut_travaux IS NOT NULL;