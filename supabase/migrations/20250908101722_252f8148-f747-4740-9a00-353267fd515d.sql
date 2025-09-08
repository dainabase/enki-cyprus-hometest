-- Reclasser les développeurs de "Les deux" dans la bonne zone selon leurs adresses principales

-- Aristo Developers: adresse principale à Paphos (CY-8101 Paphos)
UPDATE developers 
SET main_city = 'Paphos'
WHERE name = 'Aristo Developers';

-- Cybarco: adresses à Limassol ET Paphos, mais siège principal semble être Limassol (Georgiou Gennadiou, Limassol)
UPDATE developers 
SET main_city = 'Limassol'
WHERE name = 'Cybarco (incl. Lanitis Development)';

-- D. Zavos Group: adresse principale à Limassol (Griva Digenis Street, Limassol)
UPDATE developers 
SET main_city = 'Limassol'
WHERE name = 'D. Zavos Group';

-- Leptos Estates: adresses multiples mais siège principal à Limassol (136 Lord Byron Avenue, Neapolis, Limassol)
UPDATE developers 
SET main_city = 'Limassol'
WHERE name = 'Leptos Estates';

-- Pafilia: adresse principale à Paphos (Pafilia House, Marina Court, 8101 Pafos)
UPDATE developers 
SET main_city = 'Paphos'
WHERE name = 'Pafilia';