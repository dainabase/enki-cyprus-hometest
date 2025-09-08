-- Import des 14 développeurs restants
-- Partie 2/2 de l'import des développeurs chypriotes

-- 8. Imperio Properties
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Imperio Properties',
    2003,
    'Fondée le 10 octobre 2003, Imperio Properties s''est concentrée sur des projets résidentiels et commerciaux durables et innovants depuis sa création, avec l''objectif de créer des propriétés méritantes.',
    'Développement de propriétés résidentielles et commerciales durables ; initiatives communautaires comme le parrainage d''événements.',
    'Silicon Park ; Imperio Portside ; Imperio Skyline ; Sunset Gardens ; Imperio House ; The Icon ; environ 50 projets.',
    'Limassol',
    ARRAY['8 Ayiou Prokopiou Street, Engomi, Nicosia 2406', 'Imperio House, 5 Kedron, Mesa Geitonia, 4004 Limassol']::TEXT[],
    'https://www.imperioproperties.com/',
    ARRAY['+357 22 458777', '+357 25 581005']::TEXT[],
    'info@imperio-properties.com',
    'sales@imperio-properties.com',
    'Loué pour la modernité et la durabilité ; prix comme Best Residential Apartment Cyprus 2009.',
    'Stable avec un focus éco aidant la résilience ; pas de problèmes majeurs.',
    8.0,
    'Innovation forte, mais histoire plus courte que les pairs.',
    50,
    22,
    3.00,
    'active'
);

-- 9. INEX Group
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    years_experience, commission_rate, status
) VALUES (
    'INEX Group',
    2010,
    'Fondé vers 2010, INEX Group est un pionnier de l''immobilier écologique avec 15 ans d''expérience, se concentrant sur le développement intelligent pour les projets résidentiels et commerciaux.',
    'Développement à grande échelle incluant construction, architecture, design, ingénierie, planification ; accent sur les projets centrés sur l''humain et écologiques.',
    'Développements résidentiels/commerciaux uniques ; projets spécifiques non détaillés, mais accent sur l''amélioration des standards de vie.',
    'Paphos',
    ARRAY['58 Leoforos Ellados, Paphos 8020', '10 Apostolou Pavlou Avenue, Paphos 8046']::TEXT[],
    'https://inex-development.com/',
    ARRAY['+357 777 888 33']::TEXT[],
    'info@inex-development.com',
    'sales@inex-development.com, info@inex-group.com',
    'Positif mais clairsemé ; perspectives du PDG sur les défis du marché notées.',
    'Semble stable ; pas de signaux d''alarme, non financé mais compétitif.',
    7.0,
    'Bonne intention et focus éco, mais données limitées et présence plus récente empêchent un score plus élevé.',
    15,
    3.00,
    'active'
);

-- 10. Island Blue
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Island Blue',
    1985,
    'Établie vers 1985, Island Blue est un développeur primé à Paphos avec plus de 40 ans de croissance continue, se concentrant sur les développements luxueux haut de gamme.',
    'Développement d''appartements et de villas de luxe à Paphos et Limassol ; s''adresse aux acheteurs et investisseurs.',
    'IBC Tower (commercial, Paphos) ; Avalon Gardens 2 (studios, appartements, villas, Emba) ; Sapphire (Kato Paphos) ; 26+ projets.',
    'Paphos',
    ARRAY['Gladstonos 24, Poullet Court, Office No. 3, Pafos 8046, Cyprus']::TEXT[],
    'https://www.islandbluecyprus.com/',
    ARRAY['+357 26 222565', '+357 80 003377']::TEXT[],
    'info@islandbluecyprus.com',
    'sales@islandbluecyprus.com',
    'Notes élevées (4,8/5) ; 5 International Property Awards ; réputation d''entreprise exceptionnelle.',
    'Stable de niveau intermédiaire avec succès constant.',
    8.0,
    'Fort dans le luxe de niche ; l''échelle limite mais les prix augmentent.',
    26,
    40,
    3.00,
    'active'
);

-- 11. Karma Group (Karma Developers)
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Karma Group (Karma Developers)',
    1985,
    'Fondé en 1985, Karma Group a développé 4 000+ propriétés dans l''est de Chypre, s''étendant avec une approche centrée sur les personnes.',
    'Développement résidentiel ; focus sur l''est de Chypre mais noté dans les contextes de Paphos.',
    'Setai Residences ; 4 000+ propriétés.',
    'Paphos',
    ARRAY['16 Kennedy Avenue, Kapparis, Paralimni 5290, Cyprus']::TEXT[],
    'https://karma.cy/',
    ARRAY['+357 23 730777', '+357 80 030303']::TEXT[],
    'info@karmadevelopers.com.cy',
    'sales@karmadevelopers.com.cy',
    'Retours positifs solides ; valeur intemporelle soulignée.',
    'Fondations solides avec long historique.',
    8.0,
    'Héritage bon, mais focus régional limite l''attrait plus large.',
    4000,
    40,
    3.00,
    'active'
);

-- 12. Korantina Homes
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    years_experience, commission_rate, status
) VALUES (
    'Korantina Homes',
    1990,
    'Établie en 1990, Korantina Homes est devenue un développeur prestigieux d''immobilier résidentiel de luxe et de resorts, complétant des projets de haute qualité et en expansion en construction.',
    'Conception et création de résidences et resorts de luxe sur mesure ; sélection d''emplacements pour bord de mer, ville ou intimité.',
    'Cap St Georges Hotel & Resort ; Soho Resort ; résidences opulentes.',
    'Paphos',
    ARRAY['32 Trikomou Street, Pegeia, Pafos 8560, Cyprus']::TEXT[],
    'https://korantinahomes.com/',
    ARRAY['+357 80 007030', '+357 26 623536']::TEXT[],
    'info@korantinahomes.com',
    'sales@korantinahomes.com',
    'Réputation internationale primée ; engagement envers des projets uniques. Une controverse liée aux investisseurs.',
    'Forte avec reconnaissance internationale.',
    8.0,
    'Excellence tempérée par des problèmes isolés.',
    35,
    3.00,
    'active'
);

-- 13. Kuutio Homes
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Kuutio Homes',
    2015,
    'Enregistrée en 2015, Kuutio Homes se concentre sur les propriétés de luxe sur mesure à Paphos, avec 34+ projets utilisant des matériaux naturels et l''efficacité énergétique.',
    'Livraison de maisons de luxe uniques et durables ; gestion professionnelle.',
    'Villas et appartements uniques ; 34+ projets, primés.',
    'Paphos',
    ARRAY['34 Nikolaou I. Nikolaidi Ave, 8010 Paphos, Cyprus']::TEXT[],
    'https://kuutiohomes.com/',
    ARRAY['+357 70 071313']::TEXT[],
    'info@kuutiohomes.com',
    'sales@kuutiohomes.com',
    'Accent positif sur l''art ; primé internationalement.',
    'Innovateur stable.',
    8.0,
    'Excellence de niche ; bon pour les besoins personnalisés.',
    34,
    10,
    3.00,
    'active'
);

-- 14. Lemon Maria Developers
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    years_experience, commission_rate, status
) VALUES (
    'Lemon Maria Developers',
    1993,
    'Fondée en 1993, spécialisée dans les propriétés premium à Paphos.',
    'Développement de propriétés résidentielles de luxe.',
    'Ester Villas.',
    'Paphos',
    ARRAY['21 Neophytou Nicolaide Avenue, Paphos 8011, Cyprus']::TEXT[],
    'https://lemonmaria.com/',
    ARRAY['+357 26 942143', '+357 80 006030']::TEXT[],
    'info@lemonmaria.com',
    'Crédible avec retours positifs.',
    'Établie de niveau intermédiaire.',
    7.0,
    'Solide mais portée limitée.',
    32,
    3.00,
    'active'
);

-- 15. Leptos Estates
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Leptos Estates',
    1960,
    'Plus de 60 ans, avec 325+ projets ; leader à Chypre et en Grèce.',
    'Développements résidentiels et éco-développements à grande échelle.',
    'Neapolis Smart EcoCity ; 325+ projets.',
    'Les deux',
    ARRAY['136 Lord Byron Avenue, Neapolis, Limassol', '111 Apostolos Pavlos Avenue, CY-8046, P.O. Box 60146, CY-8129 Paphos', '104 Amathountos Avenue, Shop 5, 4532 Agios Tychona']::TEXT[],
    'https://www.leptosestates.com/',
    ARRAY['+357 26 880100', '+357 25 873233']::TEXT[],
    'info@leptosestates.com',
    'sales@leptosestates.com',
    'Mixte sur les délais mais prix solides.',
    'Excellente avec vaste banque foncière.',
    9.0,
    'L''échelle et l''histoire dominent ; avis mineurs notés.',
    325,
    65,
    3.00,
    'active'
);

-- 16. Medousa Developers
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Medousa Developers',
    2001,
    'Fondée en 2001 par Christakis Loizou, commençant comme une modeste entreprise de construction, maintenant plus de 20 ans dans le développement durable avec 10+ projets.',
    'Construction commerciale et résidentielle ; accent sur la durabilité.',
    'Infinity Residences ; Elite Residences ; Panorama Apartments ; Cypress Park ; ~10 projets.',
    'Paphos',
    ARRAY['Chiou Street 7, Paphos 8027, Cyprus']::TEXT[],
    'https://medousadevelopers.com/',
    ARRAY['+357 26 910910', '+357 80 009944']::TEXT[],
    'info@medousadevelopers.com',
    'sales@medousadevelopers.com',
    'Prix pour les éco-développements ; position positive dans l''industrie.',
    'Entrepreneur de classe A fiable.',
    8.0,
    'Durabilité forte ; bon pour les investisseurs verts.',
    10,
    24,
    3.00,
    'active'
);

-- 17. Olias Homes
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Olias Homes',
    2002,
    'Fondée en 2002, spécialisée dans le luxe sur mesure à Paphos avec 55+ projets.',
    'Développement résidentiel de luxe.',
    'Allegra Homes ; ~55 projets.',
    'Paphos',
    ARRAY['56 Eleftheriou Venizelou Street, 8021 Paphos, Cyprus']::TEXT[],
    'https://oliashomes.com/',
    ARRAY['+357 26 222288']::TEXT[],
    'sales@oliashomes.com',
    'sales@oliashomes.com',
    'Positif, orienté détail.',
    'Stable avec historique.',
    8.0,
    'L''exclusivité attire ; solide niveau intermédiaire.',
    55,
    23,
    3.00,
    'active'
);

-- 18. Pafilia
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Pafilia',
    1977,
    'Plus de 45 ans avec un portefeuille de 3 milliards d''euros et 250+ développements.',
    'Développement immobilier à grande échelle ; entreprise familiale.',
    'ONE Tower ; 250+ développements.',
    'Les deux',
    ARRAY['Pafilia House, 33 Nicodemou Mylona Street, Marina Court, P.O. Box 60159, 8101 Pafos', '307-309, 28th October Avenue, 3105 Limassol']::TEXT[],
    'https://www.pafilia.com/',
    ARRAY['+357 26 848800', '+357 25 590880']::TEXT[],
    'info@pafilia.com',
    'sales@pafilia.com, enquiries@pafilia.com',
    'Visionnaire avec multiples prix.',
    'Structure familiale solide.',
    9.0,
    'Excellence dans l''échelle et l''innovation.',
    250,
    48,
    3.00,
    'active'
);

-- 19. P.L. Property Gallery Developers & Constructors
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'P.L. Property Gallery Developers & Constructors',
    2003,
    'Plus de 20 ans sur le marché, avec 55+ projets valant 800M€ et 500 000 m² ; multi-primé, incluant des développements hôteliers.',
    'Développement résidentiel, commercial, hôtelier ; villas, appartements, hôtels.',
    'YOO Limassol ; MIR Residences ; Homer Residences ; Majestic Villas ; Pissouri Forest Park ; Greenwood at Platres ; Petit Palais Hotel ; Platres Arena ; Dream Tower ; 55+ projets.',
    'Limassol',
    ARRAY['Ambelakion 28 Street, Germasogeia, Limassol 4046', '1 Georgiou A'' Street, Monastiraki Center, Offices 3-4, Germasogeia 4040']::TEXT[],
    'https://cypruspropertygallery.com/',
    ARRAY['+357 25 558800', '+357 25 731111', '+357 80 008384']::TEXT[],
    'info@cypruspropertygallery.com',
    'sales@cypruspropertygallery.com, newrequest@cypruspropertygallery.com',
    'Multi-primé (50+ prix) ; témoignages positifs sur le professionnalisme.',
    'Croissance stable avec large portefeuille.',
    8.0,
    'Focus fiable sur la classe moyenne.',
    55,
    22,
    3.00,
    'active'
);

-- 20. Prime Property Group (incl. bbf)
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Prime Property Group (incl. bbf)',
    2003,
    'Depuis 2003, développements holistiques dans plusieurs villes avec 150+ projets.',
    'Développements résidentiels et commerciaux premium.',
    'Appartements Prime ; 150+ au total.',
    'Limassol',
    ARRAY['Ambelakion 28 Street, Potamos Germasogeia, 4046 Limassol, Cyprus']::TEXT[],
    'https://bbf.com/en/',
    ARRAY['+357 25 558111']::TEXT[],
    'info@bbf.com',
    'sales@bbf.com',
    'Statut de pionnier avec retours positifs.',
    'Croissance rapide.',
    8.0,
    'Innovation bonne, mais plus récente que les vétérans.',
    150,
    22,
    3.00,
    'active'
);

-- 21. Quality Group
INSERT INTO developers (
    name, founded_year, history, main_activities, key_projects, main_city,
    addresses, website, phone_numbers, email_primary, email_sales,
    reputation_reviews, financial_stability, rating_score, rating_justification,
    total_projects, years_experience, commission_rate, status
) VALUES (
    'Quality Group',
    1991,
    'Depuis 1991, portefeuille diversifié avec 225+ projets.',
    'Développement résidentiel et commercial ; basé à Larnaca avec des projets à Paphos.',
    'Blue Sky Villas ; Financial Centre ; 225+ projets.',
    'Paphos',
    ARRAY['41 Constantinou Paleologou Avenue, Larnaca 6036', '16 Inomenon Ethnon Str., 6042 Larnaca']::TEXT[],
    'https://qualitygroupcyprus.com/',
    ARRAY['+357 24 821855', '+357 80 007766']::TEXT[],
    'info@qualitygroupcyprus.com',
    'sales@qualitygroupcyprus.com',
    'Leader avec des notes de 4,4/5.',
    'Forte, bien établie.',
    8.0,
    'Polyvalence forte ; bon pour des besoins variés.',
    225,
    34,
    3.00,
    'active'
);