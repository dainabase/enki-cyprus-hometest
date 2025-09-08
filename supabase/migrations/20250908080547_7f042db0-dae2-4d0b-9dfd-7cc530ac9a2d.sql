-- Correction pour l'import des développeurs
-- Ajouter une contrainte unique sur le nom et importer les données

-- Créer un index unique sur le nom des développeurs
CREATE UNIQUE INDEX IF NOT EXISTS idx_developers_name_unique ON developers(name);

-- Import des développeurs chypriotes dans la table developers
-- Date: 2025-01-27
-- Données: 21 développeurs de Paphos et Limassol

-- 1. AGG Luxury Homes Ltd
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales, email_marketing,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'AGG Luxury Homes Ltd',
    1978,
    'Fondée en 1978, AGG Luxury Homes s''est établie comme spécialiste des résidences de luxe modernes à Paphos, mettant l''accent sur le service personnalisé et les constructions de haute qualité. Avec plus de 35 projets réalisés, elle s''adresse aux acheteurs de résidences secondaires en alliant design contemporain et esthétique chypriote.',
    'Développement de propriétés résidentielles de luxe, incluant villas et complexes, avec un accent sur les designs sur mesure et la qualité premium.',
    'Villas d''élite et complexes résidentiels dans les zones privilégiées de Paphos ; plus de 35 projets au total.',
    'Paphos',
    ARRAY['4, 25th March Street, Paphos 8047, Cyprus']::TEXT[],
    'https://www.agcyprus.com/',
    ARRAY['+357 26 813171', '+357 80 006363']::TEXT[],
    'info@agcyprus.com',
    'sales@agcyprus.com, marketing@agcyprus.com',
    'marketing@agcyprus.com',
    'Commentaires très positifs sur des plateformes comme Facebook et home.cy (moyenne de 4,8/5), avec des prix pour les développements de luxe ; quelques notes sur les prix premium.',
    'Établie de longue date sans problèmes signalés ; stable en tant qu''entreprise de taille moyenne sur un marché résilient.',
    8.0,
    'Excellente réputation et qualité de projet, mais l''échelle limitée par rapport aux groupes plus importants tempère légèrement le score ; idéal pour les acheteurs recherchant du luxe sur mesure.',
    35,
    47,
    3.00,
    'active'
);

-- 2. Aristo Developers
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Aristo Developers',
    1980,
    'Établie en 1980, Aristo est devenue pionnière avec plus de 265 projets à travers Chypre et la Grèce, spécialisée dans les complexes de golf, les institutions éducatives et les investissements à grande échelle. Connue pour l''innovation et les soutiens internationaux.',
    'Développement de propriétés résidentielles, commerciales et de villégiature, incluant des terrains de golf et des installations éducatives ; accent sur l''innovation et les investissements à grande échelle.',
    'Venus Rock Golf Resort ; plus de 265 projets, avec 223 propriétés en cours.',
    'Les deux',
    ARRAY['8 April 1st Street, Paralimni 5280, Cyprus', 'Aristo Centre, 8 Apriliou 1st Street, P.O. Box 60269, CY-8101 Paphos']::TEXT[],
    'https://www.aristodevelopers.com/',
    ARRAY['+357 26 841800']::TEXT[],
    'info@aristodevelopers.com',
    'sales@aristodevelopers.com',
    'Très bien considérée avec des prix comme "Best Property Development Team Cyprus 2020" ; retours mitigés sur les délais hors plan mais globalement positifs (ex : "fiable" dans les forums).',
    'Plus de 40 ans de croissance stable ; certifié ISO 9001 ; aucun signal d''alarme financier.',
    9.0,
    'Forte présence sur le marché, prix et échelle ; des préoccupations mineures hors plan empêchent un score parfait, mais un choix de premier plan pour les investisseurs.',
    265,
    45,
    3.00,
    'active'
);

-- 3. Crona Property (Crona Group)
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Crona Property (Crona Group)',
    2007,
    'Fondée en 2007, Crona Group est un consortium avec plus de 20 ans d''expérience, évoluant vers un développeur immobilier à service complet à Chypre, complétant plus de 50 projets et employant 300+ professionnels.',
    'Développement immobilier cycle complet de la conception à l''achèvement, incluant propriétés premium, assistance à l''achat, permis de résidence, location, investissements et maintenance ; détient la licence de construction de premier niveau.',
    'Garden Square (appartements/villas, Limassol) ; Onyx Residence (appartements, Limassol) ; Gateway Offices/Residences (en développement, Limassol) ; Amissos (appartements, Limassol) ; Ariadne (appartements/villas, Limassol) ; Green Hills (appartements, Limassol) ; plus de 50 complétés.',
    'Limassol',
    ARRAY['21 Andrea Kariolou Street, Agios Athanasios, Limassol 4102, Cyprus']::TEXT[],
    'https://www.cronagroup.com/',
    ARRAY['+357 25 280000', '+357 25 055961']::TEXT[],
    'info@cronagroup.com',
    'sales@cronagroup.com, info@cronaproperty.com',
    'Met l''accent sur la qualité, la confiance et l''excellence ; positif comme "fiable" dans les avis ; aucun prix spécifique mentionné, mais position solide auto-déclarée.',
    'Stable en tant que partie d''un groupe plus large ; aucun problème noté, mais moins de transparence que les entreprises plus anciennes.',
    7.0,
    'Opérations solides et volume de projets, mais critiques publiques clairsemées et échelle intermédiaire limitent un score plus élevé ; convient aux acheteurs premium de Limassol.',
    50,
    18,
    3.00,
    'active'
);

-- 4. Cybarco (incl. Lanitis Development)
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Cybarco (incl. Lanitis Development)',
    1945,
    'Cybarco fondée en 1945 dans le cadre du groupe Lanitis (établi fin 1800, dirigé par la famille de quatrième génération) ; un acteur majeur dans les développements de luxe et les infrastructures avec une portée internationale.',
    'Développement immobilier, construction, tourisme, hôtels, transport, loisirs, golf, marina, énergie, commerce, agriculture ; accent sur le service de qualité et la durabilité.',
    'Repères significatifs dans les deux villes ; accent sur l''après-vente et la durabilité ; projets spécifiques non détaillés dans les sources.',
    'Les deux',
    ARRAY['9 Georgiou Gennadiou, Limassol 3041', '21 Arch. Kyprianou Street, Limassol 3036', 'Konia Industrial Area, 8300 Paphos']::TEXT[],
    'https://www.cybarco.com/',
    ARRAY['+357 22 741300', '+357 25 820920', '+357 26 913313']::TEXT[],
    'info@cybarco.com',
    'sales@cybarco.com',
    'Excellents éloges pour la cohérence et l''intégrité ; opérations résilientes après les défis.',
    'Soutenu par un grand groupe avec des finances solides ; longue histoire garantit la stabilité.',
    9.0,
    'Héritage prestigieux et prix ; les notes opérationnelles mineures ne nuisent pas à l''excellence globale.',
    NULL,
    80,
    3.00,
    'active'
);

-- 5. Cyfield Group
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales, email_marketing,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Cyfield Group',
    1990,
    'Fondée en 1990, Cyfield est devenue un leader dans l''immobilier, l''énergie et les infrastructures, complétant plus de 400 projets avec un accent sur la technologie et l''efficacité.',
    'Développement immobilier, énergie, infrastructure ; gratte-ciel modernes et initiatives renouvelables.',
    'Gratte-ciel modernes et projets d''énergie renouvelable ; plus de 400 au total.',
    'Limassol',
    ARRAY['CYFIELD TOWER, 132 Limassol Avenue, Nicosia 2015, Cyprus']::TEXT[],
    'https://www.cyfieldgroup.com/',
    ARRAY['+357 22 427230']::TEXT[],
    'info@cyfieldgroup.com',
    'sales@cyfieldgroup.com',
    'marketing@cyfieldgroup.com',
    'Designs innovants loués, mais quelques critiques sur les liens gouvernementaux et l''éthique dans les forums.',
    'Forte avec diversification ; pas d''échecs majeurs.',
    7.0,
    'Prouesse technique compensée par la controverse ; équilibré pour les acheteurs éthiques.',
    400,
    35,
    3.00,
    'active'
);

-- Continuer avec les 16 autres développeurs...
-- (Je vais les ajouter un par un pour éviter une requête trop longue)

-- 6. D. Zavos Group
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'D. Zavos Group',
    1980,
    'Établi en 1980, se concentre sur les projets résidentiels de luxe avec plus de 165 développements, s''étendant en Grèce.',
    'Développement de propriétés résidentielles haut de gamme ; focus international de luxe.',
    'Achèvements abordables 2024 ; plus de 130-165 projets.',
    'Les deux',
    ARRAY['1 Griva Digenis Street, Limassol 3302', '1 Grivas Dhigenis Avenue, Zavos Kriel Court, P.O. Box 53311, 3035 Limassol']::TEXT[],
    'https://zavos.com/',
    ARRAY['+357 25 818555']::TEXT[],
    'info@zavos.com',
    'sales@zavos.com',
    'Service et valeur solides ; positif sur les réseaux sociaux.',
    'Bilan solide ; orienté croissance.',
    8.0,
    'Fiable avec expansion, mais le marché concurrentiel limite la perfection.',
    165,
    45,
    3.00,
    'active'
);

-- 7. Domenica Group
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales, email_marketing,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Domenica Group',
    1961,
    'Fondée en 1961, une pierre angulaire à Paphos avec 32+ projets autofinancés, mettant l''accent sur la qualité et le risque réduit.',
    'Développement résidentiel dans les zones privilégiées ; modèle d''autofinancement.',
    'Complexes résidentiels ; environ 32 projets.',
    'Paphos',
    ARRAY['12 Demokratias Avenue, Pafos 8045/8066, Cyprus']::TEXT[],
    'https://domenicagroup.com/',
    ARRAY['+357 26 600700', '+357 80 008010']::TEXT[],
    'info@domenicagroup.com',
    'sales@domenicagroup.com',
    'marketing@domenicagroup.com',
    'Très positif, "fiable" dans les forums ; prix pour l''excellence.',
    'L''autofinancement garantit la robustesse.',
    9.0,
    'Longévité et modèle à faible risque brillent ; top pour les chercheurs de stabilité.',
    32,
    64,
    3.00,
    'active'
);