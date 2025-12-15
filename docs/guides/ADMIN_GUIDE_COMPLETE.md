# 🏛️ GUIDE ADMINISTRATEUR COMPLET - ENKI REALITY

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Gestion des Développeurs](#gestion-des-développeurs)
3. [Gestion des Projets](#gestion-des-projets)
4. [Gestion des Bâtiments](#gestion-des-bâtiments)
5. [Gestion des Unités](#gestion-des-unités)
6. [CRM & Leads](#crm--leads)
7. [Pipeline de Ventes](#pipeline-de-ventes)
8. [Commissions](#commissions)
9. [Analytics & Reporting](#analytics--reporting)
10. [Configuration & Sécurité](#configuration--sécurité)

---

## 🎯 Vue d'Ensemble

### Dashboard Principal (`/admin`)
**Accès rapide à toutes les métriques clés :**
- **Statistiques temps réel** : Projets, Unités, Leads, Commissions
- **Graphiques d'évolution** : Ventes par mois, zones populaires
- **Raccourcis** vers les sections les plus utilisées
- **Notifications** : Nouvelles demandes, alertes système

### Structure de Navigation
```
🏠 Dashboard
├── 🏗️ Développeurs (5 vues)
├── 🏢 Projets (5 vues + tri avancé)
├── 🏘️ Bâtiments
├── 🏠 Unités
├── 👥 Leads & CRM
├── 📊 Pipeline
├── 💰 Commissions
├── 📈 Analytics
├── 🔮 Prédictions
├── 🎯 Segmentation
├── 🏆 Performance
├── 📋 Rapports
└── ⚙️ Configuration
```

---

## 🏗️ Gestion des Développeurs

### Page : `/admin/developers`

#### 🔄 **5 Modes d'Affichage**
1. **Cartes** : Vue visuelle avec logos et informations clés
2. **Liste** : Vue compacte et lisible
3. **Tableau** : Vue structurée pour gestion en masse
4. **Compact** : Vue condensée pour aperçu rapide
5. **Détaillé** : Vue complète avec tous les détails

#### ✨ **Fonctionnalités Clés**
- **Création/Modification** : Formulaire complet avec validation
- **Sélection multiple** : Opérations en masse (suppression, export)
- **Tri avancé** : Par nom, statut, commission, projets
- **Filtres** : Statut, zone principale, taux de commission
- **Upload de logo** : Gestion automatique via Supabase Storage

#### 📊 **Champs Développeur**
```typescript
interface Developer {
  // Identité
  name: string;                    // Nom de l'entreprise *
  logo?: string;                   // URL du logo
  website?: string;                // Site web
  
  // Localisation
  main_city?: string;              // Ville principale
  addresses?: string[];            // Adresses multiples
  
  // Contact
  email_primary?: string;          // Email principal
  email_sales?: string;            // Email commercial
  email_marketing?: string;        // Email marketing
  phone_numbers?: string[];        // Téléphones multiples
  
  // Business
  commission_rate: number;         // Taux commission (défaut: 3%)
  payment_terms?: string;          // Conditions de paiement
  status: 'active' | 'inactive';   // Statut
  
  // Historique
  founded_year?: number;           // Année de création
  years_experience?: number;       // Années d'expérience
  total_projects?: number;         // Nombre total de projets
  
  // Évaluation
  rating_score?: number;           // Note (1-5)
  rating_justification?: string;   // Justification de la note
  reputation_reviews?: string;     // Avis et réputation
  financial_stability?: string;    // Stabilité financière
  
  // Descriptions
  history?: string;                // Historique de l'entreprise
  main_activities?: string;        // Activités principales
  key_projects?: string;           // Projets phares
}
```

#### 🎛️ **Actions Disponibles**
- ✅ **Créer** nouveau développeur
- ✏️ **Modifier** développeur existant
- 🗑️ **Supprimer** (avec confirmation)
- 📤 **Export** des données sélectionnées
- 🔍 **Recherche** par nom ou ville

---

## 🏢 Gestion des Projets

### Page : `/admin/projects`

#### 🔄 **5 Modes d'Affichage**
1. **Cartes** : Vue attractive avec images et prix
2. **Liste** : Vue ordonnée par développeur/ville
3. **Tableau** : Groupé par développeur (vue classique)
4. **Compact** : Vue ultra-condensée
5. **Détaillé** : Vue exhaustive avec toutes les specs

#### 🎯 **Tri Intelligent**
- **Nom du projet** : Alphabétique
- **Développeur** : Par entreprise
- **Ville** : Géographique
- **Quartier** : Par zone locale
- **Prix** : Du moins au plus cher
- **Statut** : Par phase du projet
- **Zone Chypre** : Par région
- **Date livraison** : Chronologique
- **Date création** : Plus récents en premier

#### 📝 **Formulaire Projet Complet (7 Étapes)**

##### **Étape 1 : Informations de Base**
```typescript
interface ProjectBasics {
  title: string;                          // Nom du projet *
  project_code?: string;                  // Code interne
  developer_id: string;                   // Développeur associé *
  property_category: 'residential' | 'commercial' | 'mixed' | 'industrial';
  property_sub_type: SubType[];           // Types multiples
  project_phase: 'off-plan' | 'under-construction' | 'completed' | 'ready-to-move';
  launch_date?: string;                   // Date de lancement
  completion_date_new?: string;           // Date de livraison
  exclusive_commercialization: boolean;   // 🆕 Exclusivité Enki Reality
  description: string;                    // Description courte *
  detailed_description?: string;          // Description complète
}
```

##### **Étape 2 : Localisation**
```typescript
interface ProjectLocation {
  full_address?: string;                  // Adresse complète
  city: string;                          // Ville *
  region?: string;                       // Région/District
  neighborhood?: string;                 // Quartier
  neighborhood_description?: string;      // Description du quartier
  cyprus_zone: 'limassol' | 'paphos' | 'larnaca' | 'nicosia' | 'famagusta';
  
  // Coordonnées GPS
  gps_latitude?: number;                 // Latitude
  gps_longitude?: number;                // Longitude
  
  // Proximités (en km)
  proximity_sea_km?: number;             // Distance mer
  proximity_airport_km?: number;         // Distance aéroport
  proximity_city_center_km?: number;     // Distance centre-ville
  proximity_highway_km?: number;         // Distance autoroute
  
  // 🆕 Commodités de proximité
  nearby_amenities: NearbyAmenity[];     // École, transport, santé, etc.
}
```

##### **Étape 3 : Spécifications**
```typescript
interface ProjectSpecs {
  land_area_m2?: number;                 // Surface terrain
  built_area_m2?: number;                // Surface construite
  total_units_new?: number;              // Nombre total d'unités
  units_available_new?: number;          // Unités disponibles
  bedrooms_range?: string;               // "1-3" chambres
  bathrooms_range?: string;              // "1-2" salles de bain
  floors_total?: number;                 // Nombre d'étages
  parking_spaces?: number;               // Places de parking
  storage_spaces?: number;               // Espaces de stockage
  smart_home_features?: object;          // Domotique
}
```

##### **Étape 4 : Prix & Investissement**
```typescript
interface ProjectPricing {
  price: number;                         // Prix de base *
  price_from_new?: number;               // Prix à partir de
  price_to?: number;                     // Prix jusqu'à
  price_per_m2?: number;                 // Prix au m²
  vat_rate_new: number;                  // Taux TVA (défaut: 5%)
  vat_included: boolean;                 // TVA incluse
  golden_visa_eligible_new: boolean;     // Éligible Golden Visa (auto si ≥300k€)
  roi_estimate_percent?: number;         // ROI estimé %
  rental_yield_percent?: number;         // Rendement locatif %
  financing_available: boolean;          // Financement dispo
  financing_options?: object;            // Options de financement
  payment_plan?: object;                 // Plan de paiement
  incentives?: string[];                 // Incitations
}
```

##### **Étape 5 : Médias**
```typescript
interface ProjectMedia {
  photos: CategorizedPhoto[];            // 🆕 Photos catégorisées
  virtual_tour_url_new?: string;         // Visite virtuelle
  project_presentation_url?: string;     // Présentation projet
  youtube_tour_url?: string;             // YouTube
  vimeo_tour_url?: string;               // Vimeo
  photo_gallery_urls?: string[];         // Galerie photos
  video_tour_urls?: string[];            // Vidéos de visite
  floor_plan_urls?: string[];            // Plans d'étage
  drone_footage_urls?: string[];         // Vidéos drone
  model_3d_urls?: string[];              // Modèles 3D
}

interface CategorizedPhoto {
  url: string;
  category: 'hero' | 'exterior_1' | 'exterior_2' | 'interior_1' | 'interior_2' 
          | 'panoramic_view' | 'sea_view' | 'mountain_view' | 'amenities' 
          | 'plans' | 'kitchen' | 'bedroom' | 'bathroom' | 'balcony' | 'garden';
  isPrimary?: boolean;
  caption?: string;
}
```

##### **Étape 6 : Prestations**
```typescript
interface ProjectAmenities {
  features: string[];                    // Caractéristiques générales
  amenities: string[];                   // Prestations internes
  // Géré via AmenitiesSelector avec prestations prédéfinies
}
```

##### **Étape 7 : Marketing & SEO**
```typescript
interface ProjectMarketing {
  project_narrative?: string;            // Récit du projet
  meta_title_new?: string;               // Titre SEO
  meta_description_new?: string;         // Description SEO
  meta_keywords?: string[];              // Mots-clés SEO
  marketing_highlights?: string[];       // Points forts marketing
  target_audience?: string[];            // Audience cible
  featured_new: boolean;                 // Projet mis en avant
  status: 'available' | 'under_construction' | 'delivered' | 'sold';
}
```

#### 🆕 **Nouvelles Fonctionnalités**

##### **Upload d'Images Catégorisées**
- **15 catégories** prédéfinies : Hero, Extérieur 1&2, Intérieur 1&2, etc.
- **Vignettes intelligentes** : Icônes et libellés adaptés
- **Alignement fixe** : Hauteur des icônes standardisée
- **Gestion drag & drop** : Upload simple et rapide

##### **Commodités de Proximité (8 Catégories)**
- 🎓 **Éducation** : Écoles, universités, crèches
- 🚌 **Transport** : Bus, autoroute, aéroport, marina
- 🏥 **Santé** : Hôpitaux, pharmacies, centres médicaux
- 🛒 **Shopping** : Supermarchés, centres commerciaux
- 🎭 **Loisirs** : Plages, parcs, cinémas, golf
- 🏛️ **Services** : Banques, poste, police, stations-service
- 🍽️ **Restauration** : Restaurants, cafés, tavernes
- 🌳 **Nature** : Montagnes, forêts, sentiers

Pour chaque commodité :
- **Distance** en km
- **Temps à pied** en minutes
- **Temps en voiture** en minutes
- **Quantité** (ex: 3 écoles)
- **Détails** (ex: "Lycée International de Paphos")

##### **Exclusivité Enki Reality**
- Switch simple "Exclusivité Enki Reality"
- Marque les projets commercialisés en exclusivité
- Affichage spécial dans les listes

#### 🎛️ **Actions & Filtres**
- **Filtres** : Développeur, zone, statut, Golden Visa
- **Tri multiple** : 9 critères de tri
- **Export** : Données sélectionnées en CSV
- **Sélection multiple** : Opérations en masse
- **Navigation directe** : Vers édition avancée ou tableau

---

## 🏘️ Gestion des Bâtiments

### Page : `/admin/buildings`

#### 📊 **Structure Hiérarchique**
```
Développeur
└── Projet
    └── Bâtiment(s)
        └── Unité(s)
```

#### 🏗️ **Champs Bâtiment**
```typescript
interface Building {
  name: string;                          // Nom du bâtiment *
  project_id: string;                    // Projet parent *
  building_type: 'residential' | 'commercial' | 'mixed' | 'parking';
  total_floors: number;                  // Nombre d'étages (défaut: 1)
  total_units: number;                   // Nombre d'unités (défaut: 1)
  construction_status: 'planned' | 'foundation' | 'structure' 
                     | 'finishing' | 'completed';
  energy_rating?: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
}
```

#### 🎨 **Interface & Navigation**
- **Fil d'Ariane** : Développeur > Projet > Bâtiment
- **Création rapide** : Depuis la page projet
- **Vue groupée** : Par projet
- **Upload d'images** : Photos spécifiques au bâtiment

---

## 🏠 Gestion des Unités

### Page : `/admin/units`

#### 🏡 **Unités Individuelles**
Gestion fine des appartements, villas, bureaux au sein des bâtiments.

#### 📋 **Champs Unité**
```typescript
interface Unit {
  // Identification
  unit_number: string;                   // Numéro d'unité *
  building_id: string;                   // Bâtiment parent *
  
  // Caractéristiques
  unit_type: 'studio' | 'apartment' | 'penthouse' | 'villa' | 'office';
  floor_number?: number;                 // Étage
  bedrooms: number;                      // Chambres
  bathrooms: number;                     // Salles de bain
  area_sqm: number;                      // Surface m²
  balcony_sqm?: number;                  // Surface balcon/terrasse
  
  // Financier
  price: number;                         // Prix de vente *
  price_per_sqm?: number;                // Prix au m² (auto-calculé)
  maintenance_fee?: number;              // Charges mensuelles
  
  // Statut
  availability_status: 'available' | 'reserved' | 'sold';
  reservation_date?: string;             // Date de réservation
  sale_date?: string;                    // Date de vente
  
  // Spécificités
  view_type?: 'sea' | 'mountain' | 'city' | 'garden' | 'pool';
  orientation?: 'north' | 'south' | 'east' | 'west' | 'southeast' | 'southwest';
  parking_included: boolean;             // Parking inclus
  storage_included: boolean;             // Débarras inclus
  furnished?: boolean;                   // Meublé
  
  // Médias
  unit_images?: string[];                // Photos spécifiques
  floor_plan_url?: string;               // Plan de l'unité
  virtual_tour_url?: string;             // Visite virtuelle
}
```

#### 🎯 **Fonctionnalités Avancées**
- **Calcul automatique** : Prix au m², marges
- **Statuts de vente** : Suivi complet du processus
- **Filtrage avancé** : Par statut, type, vue, étage
- **Export détaillé** : Listes de prix, disponibilités
- **Intégration CRM** : Lien direct avec les leads

---

## 👥 CRM & Leads

### Page : `/admin/leads`

#### 🎯 **Scoring Automatique**
Les leads sont scorés automatiquement selon :
- **Budget** : 0-3 points (≥300k€ = 3pts, ≥200k€ = 2pts, ≥100k€ = 1pt)
- **Urgence** : 0-2 points (immédiat = 2pts, 3-6 mois = 1pt)
- **Score total** : 0-5 étoiles

#### 📊 **Champs Lead Complets**
```typescript
interface Lead {
  // Identité
  first_name: string;                    // Prénom *
  last_name: string;                     // Nom *
  email: string;                         // Email *
  phone?: string;                        // Téléphone
  
  // Statut & Suivi
  status: 'new' | 'contacted' | 'qualified' | 'proposal' 
        | 'negotiation' | 'closed' | 'lost';
  source?: string;                       // Source (site web, référence, etc.)
  assigned_to?: string;                  // Commercial assigné
  score: number;                         // Score automatique 0-5
  
  // Recherche Immobilière
  property_type?: string;                // Type recherché
  zones?: string[];                      // Zones d'intérêt
  budget_min?: number;                   // Budget minimum
  budget_max?: number;                   // Budget maximum
  urgency?: 'immediate' | '3_months' | '6_months' | '1_year' | 'no_rush';
  golden_visa_interest: boolean;         // Intérêt Golden Visa
  
  // Suivi
  notes?: string;                        // Notes internes
  last_contact_date?: string;            // Dernier contact
  status_changed_at: string;             // Changement de statut
}
```

#### 🎛️ **Fonctionnalités CRM**
- **Assignation automatique** : Répartition par zone/type
- **Historique complet** : Toutes les interactions
- **Rappels** : Notifications de suivi
- **Import en masse** : CSV avec mapping automatique
- **Intégration email** : Templates personnalisés

---

## 📊 Pipeline de Ventes

### Page : `/admin/pipeline`

#### 🎯 **Kanban Interactif**
**7 Étapes Standards :**
1. **Nouveau** : Lead entrant
2. **Contacté** : Premier contact établi
3. **Qualifié** : Budget et besoin confirmés
4. **Proposition** : Offre présentée
5. **Négociation** : Discussion prix/conditions
6. **Fermé** : Vente conclue
7. **Perdu** : Opportunité échouée

#### 📈 **Métriques Temps Réel**
- **Taux de conversion** par étape
- **Temps moyen** par phase
- **Valeur du pipeline** en cours
- **Prévisions** de ventes mensuelles

#### 🎛️ **Actions Pipeline**
- **Drag & Drop** : Déplacement entre étapes
- **Ajout rapide** de notes à chaque mouvement
- **Programmation** de relances automatiques
- **Vue par commercial** : Pipeline individuel

---

## 💰 Commissions

### Page : `/admin/commissions`

#### 🤖 **Calcul Automatique**
Les commissions sont générées automatiquement :
- **Trigger** : Changement statut projet vers "sold"
- **Taux** : Depuis le profil développeur (défaut 3%)
- **Montant** : Prix vente × taux commission
- **Échéance** : +30 jours par défaut

#### 💳 **Gestion des Paiements**
```typescript
interface Commission {
  project_id: string;                    // Projet vendu
  promoter_id: string;                   // Commercial/Promoteur
  amount: number;                        // Montant commission
  status: 'pending' | 'processing' | 'paid' | 'disputed';
  date: string;                          // Date de vente
  
  // Paiements
  payments?: CommissionPayment[];        // Paiements partiels
}

interface CommissionPayment {
  amount: number;                        // Montant payé
  payment_date: string;                  // Date paiement
  payment_method: string;                // Méthode (virement, chèque...)
  reference?: string;                    // Référence bancaire
  notes?: string;                        // Notes
  created_by: string;                    // Qui a enregistré
}
```

#### 📊 **Reporting Commissions**
- **Tableau de bord** : Commissions en attente/payées
- **Export comptable** : Compatible Excel/compta
- **Historique** : Par commercial, période, projet
- **Notifications** : Échéances à venir

---

## 📈 Analytics & Reporting

### Pages : `/admin/analytics`, `/admin/reports`

#### 📊 **Analytics Visuels**
- **Évolution des ventes** : Graphiques temporels
- **Performance par zone** : Heatmap Chypre
- **Analyse de rentabilité** : ROI par projet
- **Comparaisons** : Année N vs N-1

#### 📋 **Exports Personnalisés**
- **Filtres avancés** : Dates, zones, statuts, développeurs
- **Colonnes sélectionnables** : Données sur mesure
- **Formats** : CSV, Excel, PDF
- **Planification** : Exports automatiques email

#### 🔮 **Prédictions & Segmentation**
- **Modèles prédictifs** : Ventes futures
- **Segmentation clients** : Profils automatiques
- **Recommandations** : Prix, timing, ciblage
- **Alertes** : Opportunités détectées

---

## ⚙️ Configuration & Sécurité

### Authentification & Rôles

#### 👤 **Système de Rôles**
```typescript
type UserRole = 'admin' | 'sales' | 'user';

interface RolePermissions {
  admin: {
    read: ['*'];                         // Tout lire
    write: ['*'];                        // Tout modifier
    delete: ['*'];                       // Tout supprimer
  };
  sales: {
    read: ['projects', 'leads', 'commissions'];
    write: ['leads', 'pipeline'];       // Leads et pipeline seulement
    delete: [];                          // Aucune suppression
  };
  user: {
    read: ['projects'];                  // Consultation publique
    write: [];
    delete: [];
  };
}
```

#### 🔒 **Sécurité RLS (Row Level Security)**
Toutes les tables sensibles utilisent RLS :
```sql
-- Exemple pour la table projects
CREATE POLICY "Admins can manage all projects" 
ON projects FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Public can view projects" 
ON projects FOR SELECT 
USING (true);
```

#### 🛡️ **Audit Trail**
```typescript
interface AdminAuditLog {
  admin_user_id: string;                 // Qui
  action: string;                        // Quoi (CREATE, UPDATE, DELETE)
  resource_type: string;                 // Sur quoi (projects, developers...)
  resource_id?: string;                  // ID de la ressource
  details: object;                       // Détails de l'action
  ip_address?: string;                   // IP source
  user_agent?: string;                   // Navigateur
  created_at: string;                    // Quand
}
```

### Configuration Système

#### 🗃️ **Storage Buckets**
```typescript
interface StorageBuckets {
  media: {
    public: true;                        // Images publiques projets
    maxSize: '10MB';
    formats: ['jpg', 'png', 'webp'];
  };
  projects: {
    public: true;                        // Documents projets
    maxSize: '50MB';
    formats: ['pdf', 'doc', 'xls'];
  };
  buildings: {
    public: true;                        // Plans bâtiments
    maxSize: '20MB';
    formats: ['pdf', 'dwg', 'jpg'];
  };
  properties: {
    public: true;                        // Photos unités
    maxSize: '10MB';
    formats: ['jpg', 'png', 'webp'];
  };
}
```

#### 🔧 **Variables d'Environnement**
```bash
# Supabase
SUPABASE_URL=https://ccsakftsslurjgnjwdci.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# APIs Externes
XAI_API_KEY=******************              # Grok pour recherche
SENDGRID_API_KEY=SG.*******************     # Emails
```

---

## 🚀 Nouveautés Récemment Ajoutées

### ✨ **Fonctionnalités 2024**

#### **Gestion des Développeurs** 
- ✅ 5 vues d'affichage (Cartes, Liste, Tableau, Compact, Détaillé)
- ✅ Sélection multiple et opérations en masse
- ✅ Tri par nom, statut, commission, nombre de projets
- ✅ Upload de logos avec Supabase Storage
- ✅ Champs étendus : réputation, stabilité financière, historique

#### **Gestion des Projets**
- ✅ 5 vues d'affichage identiques aux développeurs
- ✅ Tri intelligent par 9 critères (ville, quartier, prix, etc.)
- ✅ Formulaire en 7 étapes avec validation progressive
- ✅ Upload d'images catégorisées (15 catégories)
- ✅ Commodités de proximité (45+ types, 8 catégories)
- ✅ Switch "Exclusivité Enki Reality"
- ✅ Suppression du mode debug

#### **Commodités de Proximité**
- ✅ 8 catégories : Éducation, Transport, Santé, Shopping, Loisirs, Services, Restauration, Nature
- ✅ 45+ commodités prédéfinies avec support multilingue (EN/EL/RU)
- ✅ Distances configurables : km, minutes à pied, minutes en voiture
- ✅ Quantités et détails personnalisés
- ✅ Interface intuitive par catégorie avec icônes

#### **Upload d'Images Avancé**
- ✅ 15 catégories prédéfinies : Hero, Extérieur 1&2, Intérieur 1&2, Vue panoramique, Vue mer, Vue montagne, Prestations, Plans, Cuisine, Chambre, Salle de bain, Balcons/Terrasses, Jardin
- ✅ Vignettes avec icônes alignées et texte adaptatif (1-2 lignes)
- ✅ Drag & drop intuitif
- ✅ Prévisualisation instantanée

#### **Base de Données**
- ✅ Table `nearby_amenities` avec 45+ commodités
- ✅ Table `project_nearby_amenities` pour les relations
- ✅ Champ `exclusive_commercialization` ajouté aux projets
- ✅ Support multilingue intégré
- ✅ Index optimisés pour les recherches

---

## 📱 Responsive & Performance

### 🎨 **Design System**
- **Couleurs sémantiques** : Variables CSS pour cohérence
- **Composants réutilisables** : Shadcn/ui personnalisés
- **Responsive** : Mobile-first, grilles adaptatives
- **Dark mode** : Support automatique

### ⚡ **Optimisations**
- **Lazy loading** : Pages admin chargées à la demande
- **Pagination** : 25 items par page par défaut
- **Cache intelligent** : React Query pour les données
- **Images optimisées** : WebP, compression automatique

---

## 🎯 Prochaines Évolutions

### 🔮 **Roadmap**
- [ ] **API REST complète** : Intégrations tierces
- [ ] **Mobile app** : Version native iOS/Android
- [ ] **IA avancée** : Recommandations personnalisées
- [ ] **Blockchain** : Tokenisation des biens
- [ ] **VR/AR** : Visites immersives
- [ ] **IoT** : Capteurs bâtiments connectés

---

## 📞 Support & Contact

### 🆘 **Assistance Technique**
- **Documentation** : Cette page + API_DOCUMENTATION.md
- **Page de tests** : `/admin/tests` pour diagnostics
- **Logs système** : Console développeur pour débogage
- **Audit trail** : Historique des actions administratives

### 🎓 **Formation**
- **Guide utilisateur** : USER_GUIDE.md
- **Vidéos tutoriels** : À venir
- **Sessions live** : Formation équipe sur demande

---

*Dernière mise à jour : Décembre 2024*  
*Version admin : 2.0*  
*Enki Reality - Votre partenaire immobilier à Chypre 🏝️*