# 🏗️ CONTEXTE PROJET - ENKI REALITY ADMIN PANEL

## 📋 RÉSUMÉ DU PROJET

Tu vas travailler sur **Enki Reality**, un panel d'administration immobilier pour Chypre développé avec React + TypeScript + Supabase.

Le projet est **100% fonctionnel** et contient une application web complète pour gérer des projets immobiliers avec une hiérarchie Developer → Project → Building → Property.

---

## 🎯 OBJECTIF DU PROJET

Panel d'administration pour promoteurs immobiliers à Chypre permettant de :
- Gérer un catalogue de projets immobiliers multi-niveaux
- Suivre les leads et opportunités commerciales via un CRM
- Calculer automatiquement les commissions
- Supporter le programme Golden Visa Cyprus (≥€300,000)
- Offrir une interface multilingue (8 langues)
- Fournir des analytics et prédictions de vente

---

## 🏛️ ARCHITECTURE DATABASE (SUPABASE)

### Structure hiérarchique principale

```
developers (22 lignes)
  ↓
projects (4 lignes, 219 colonnes)
  ↓
buildings (4 lignes, 99 colonnes)
  ↓
properties (1 ligne, 225 colonnes)
```

### Tables actives (7/30)

| Table | Lignes | Usage |
|-------|--------|-------|
| **nearby_amenities** | 49 | Points d'intérêt (plages, écoles, hôpitaux) |
| **amenities** | 31 | Équipements projets (piscine, gym, parking) |
| **developers** | 22 | Promoteurs immobiliers |
| **projects** | 4 | Projets immobiliers principaux |
| **buildings** | 4 | Bâtiments dans les projets |
| **properties** | 1 | Propriétés individuelles (appartements, villas) |
| **ab_tests** | 1 | Tests A/B pour l'interface |

### Tables vides (23/30) - NON UTILISÉES

Ces tables existent mais ne contiennent aucune donnée :
- Gestion utilisateurs : `users`, `profiles`, `commissions`
- Médias : `project_photos`, `building_photos`, `property_photos`, `documents`
- Traçabilité : `audit_logs`, `activity_logs`, `search_history`, `user_favorites`, `user_searches`
- Communication : `notifications`, `email_logs`
- Contenu : `blog_posts`, `blog_categories`, `testimonials`
- Configuration : `settings`, `feature_flags`, `equipment_categories`
- Temporaires : `temp_imports`, `test_data`, `migrations_backup`

### Table manquante

- `leads` : Mentionnée dans le code mais n'existe pas en base

**⚠️ IMPORTANT** : Le taux d'utilisation database est seulement de **23%** (7 tables sur 30 utilisées).

---

## 📁 STRUCTURE PROJET

```
/tmp/cc-agent/57946996/project/
├── src/
│   ├── pages/
│   │   ├── admin/              # 32 pages admin (Dashboard, Projects, Buildings, etc.)
│   │   ├── Home.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── Search.tsx
│   ├── components/             # 228 composants React
│   │   ├── admin/             # Composants admin spécifiques
│   │   ├── ui/                # Composants UI Shadcn
│   │   ├── layout/            # Layout (Navbar, Footer)
│   │   ├── search/            # Recherche avancée
│   │   └── project-page/      # Pages projets publics
│   ├── lib/
│   │   ├── supabase.ts        # Client Supabase
│   │   ├── analytics.ts       # Google Analytics
│   │   └── utils.ts           # Utilitaires
│   ├── hooks/                 # 20+ hooks personnalisés
│   ├── locales/               # 8 fichiers JSON (en, fr, el, ru, es, it, de, nl)
│   ├── types/                 # Types TypeScript
│   └── integrations/supabase/ # Types générés Supabase
├── supabase/
│   ├── migrations/            # 213 migrations SQL
│   └── functions/             # Edge functions
├── public/                    # Assets statiques
└── docs/                      # 15+ fichiers documentation
```

---

## 🛠️ STACK TECHNIQUE

### Frontend
- **React 18.3** + **TypeScript 5.8**
- **Vite 5.4** (build tool)
- **Tailwind CSS 3.4** + **Shadcn/ui** (composants)
- **React Query** (gestion état serveur)
- **React Hook Form** + **Zod** (formulaires + validation)
- **Framer Motion** (animations)
- **i18next** (internationalisation)

### Backend & Database
- **Supabase** (PostgreSQL 15)
  - Auth (authentification)
  - Storage (images/documents)
  - Row Level Security (RLS)
  - Database Functions & Triggers
  - Edge Functions (serverless)

### UI/UX
- **Responsive design** (mobile/tablet/desktop)
- **Dark/Light mode** support
- **8 langues** : EN, FR, EL, RU, ES, IT, DE, NL
- **Toast notifications** (Sonner)
- **Loading states** partout

### Analytics & Charts
- **Recharts** (graphiques)
- **Google Analytics 4**
- **Sentry** (monitoring erreurs - configuré mais optionnel)

---

## 📊 FONCTIONNALITÉS PRINCIPALES

### ✅ CRUD Complet
- Developers (promoteurs)
- Projects (projets immobiliers)
- Buildings (bâtiments)
- Properties (propriétés individuelles)

### 🎯 CRM & Sales
- Pipeline Kanban (drag & drop)
- Lead scoring automatique
- Segmentation clients (6 segments)
- Assignation commerciaux

### 💰 Finance
- Calcul automatique commissions
- Taux variables par développeur
- Golden Visa Cyprus (≥€300,000)
- Tracking paiements

### 📊 Analytics
- Dashboard KPIs temps réel
- Graphiques Recharts
- Filtres période
- Export CSV
- Prédictions tendances

### 📸 Gestion Média
- Upload images Supabase Storage
- Compression automatique
- Gallerie optimisée
- RLS policies sécurisées

### 🔐 Sécurité
- Supabase Auth
- Row Level Security (RLS)
- Protected routes
- Roles : admin, sales, user

---

## 🌍 BUSINESS CONTEXT

### Marché immobilier Cyprus

**Zones géographiques supportées :**
- Limassol (hub commercial)
- Paphos (tourisme & résidentiel)
- Larnaca (aéroport)
- Nicosia (capitale)
- Famagusta (zone émergente)

**Types de propriétés :**
- Appartements (studio, 1-2-3-4+ chambres)
- Villas (2-3-4-5+ chambres)
- Penthouses
- Maisonettes
- Bureaux
- Commerces

**Golden Visa Cyprus :**
- Investissement minimum : €300,000
- Détection automatique dans l'app
- Badge spécial sur les propriétés éligibles
- Filtres dédiés

---

## 🔧 CONFIGURATION ENVIRONNEMENT

### Variables .env
```env
# Supabase Production
VITE_SUPABASE_URL=https://ccsakftsslurjgnjwdci.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Maps (si nécessaire)
VITE_GOOGLE_MAPS_API_KEY=...

# Analytics (optionnel)
VITE_GA_TRACKING_ID=...
VITE_SENTRY_DSN=...
```

### Scripts disponibles
```bash
npm run dev          # Développement (port 5173)
npm run build        # Build production
npm run preview      # Preview build
npm run lint         # ESLint
```

---

## 📈 MÉTRIQUES PROJET

| Métrique | Valeur |
|----------|--------|
| **Pages admin** | 32 |
| **Composants React** | 228 |
| **Migrations SQL** | 213 |
| **Hooks personnalisés** | 20+ |
| **Langues** | 8 |
| **Tables DB actives** | 7/30 (23%) |
| **Lignes de code** | ~50,000+ |

---

## 🎨 DESIGN SYSTEM

### Couleurs principales
- Primary : Blue (immobilier professionnel)
- Secondary : Cyan (moderne)
- Accent : Orange/Gold (Golden Visa)
- Neutral : Gray scale

### Composants UI (Shadcn/ui)
Tous les composants Shadcn sont installés :
- Forms : Input, Select, Checkbox, Radio, Switch, Textarea
- Overlay : Dialog, Sheet, Popover, Tooltip, Dropdown
- Navigation : Tabs, Accordion, Breadcrumb, Pagination
- Feedback : Toast, Alert, Progress, Spinner
- Data : Table, Card, Badge, Avatar
- Layout : Separator, Scroll Area, Resizable

---

## 🚨 PROBLÈMES CONNUS & LIMITATIONS

### Database
1. **23 tables vides** : Beaucoup de tables créées mais jamais utilisées (photos, logs, blog, etc.)
2. **Table `leads` manquante** : Référencée dans le code mais n'existe pas
3. **Sur-normalisation** : Certaines tables pourraient être fusionnées
4. **213 migrations** : Historique très lourd, nécessite un audit/nettoyage

### Code
1. **Fichiers backup** : Plusieurs fichiers `.backup`, `.old` non supprimés
2. **Documentation éparpillée** : 15+ fichiers MD avec informations redondantes
3. **Composants dupliqués** : Plusieurs versions alternatives de Hero, Tabs, etc.
4. **Types complexes** : property.ts contient 225 colonnes

### Performance
1. **Build warnings** : Classes Tailwind ambiguës (`duration-[2500ms]`)
2. **Bundle size** : Certains chunks volumineux (AdminProjectForm: 620kb)
3. **213 migrations** : Temps de setup base de données long

---

## ✅ CE QUI FONCTIONNE BIEN

1. **Architecture solide** : Hiérarchie 4 niveaux claire
2. **Supabase intégration** : RLS, Auth, Storage bien configurés
3. **UI moderne** : Shadcn/ui + Tailwind propre et responsive
4. **Multilingue** : 8 langues complètes et fonctionnelles
5. **TypeScript strict** : Typage fort partout
6. **React Query** : Cache intelligent et gestion état serveur
7. **Build réussit** : Compilation Vite sans erreurs

---

## 🎯 RECOMMANDATIONS FUTURES

### Court terme
1. **Créer la table `leads`** manquante
2. **Archiver les 23 tables vides** non utilisées
3. **Nettoyer les fichiers backup** (.backup, .old)
4. **Consolider la documentation** (trop de fichiers MD)

### Moyen terme
1. **Optimiser les migrations** : Consolider les 213 fichiers
2. **Réduire les bundle sizes** : Code splitting plus agressif
3. **Implémenter les tables vides** : photos, logs, notifications OU les supprimer
4. **Ajouter tests E2E** : Cypress configuré mais pas de tests

### Long terme
1. **Mobile app** : React Native version
2. **WhatsApp integration** : Communication clients
3. **Virtual tours 3D** : Visite immersive
4. **Document generation** : Contrats PDF automatiques

---

## 🔑 POINTS D'ATTENTION

### Sécurité
- ✅ RLS activé sur toutes les tables
- ✅ Auth Supabase fonctionnelle
- ✅ Protected routes implémentées
- ⚠️ Vérifier les policies RLS des 23 tables vides

### Performance
- ✅ React Query cache
- ✅ Lazy loading composants
- ✅ Image optimization
- ⚠️ Chunks volumineux à surveiller

### Maintenabilité
- ✅ TypeScript strict
- ✅ Structure claire
- ⚠️ Trop de fichiers documentation
- ⚠️ Composants dupliqués à nettoyer

---

## 📝 DERNIERS TRAVAUX EFFECTUÉS (Oct 2025)

### Audit Database
- ✅ Scan complet des 30 tables Supabase
- ✅ Identification 7 tables actives vs 23 vides
- ✅ Détection table `leads` manquante
- ✅ Analyse taux utilisation : 23%

### Build & Validation
- ✅ Build Vite réussi sans erreurs
- ✅ Compilation TypeScript OK
- ✅ Bundle optimisé généré

---

## 🚀 STATUT ACTUEL

**VERSION :** 1.0.0 Production Ready
**STATUT :** ✅ Fonctionnel et déployable
**DERNIÈRE MISE À JOUR :** Octobre 2025
**ENVIRONNEMENT :** Supabase Production connecté

---

## 💬 INSTRUCTIONS POUR TOI (CLAUDE)

Lorsque tu travailles sur ce projet :

1. **Database** : Utilise TOUJOURS Supabase, jamais d'autre DB
2. **Migrations** : Utilise le tool `mcp__supabase__apply_migration`
3. **Build** : TOUJOURS run `npm run build` après modifications
4. **Tables vides** : Demande avant de les remplir ou supprimer
5. **Types** : Respecte les types existants (très stricts)
6. **i18n** : Mets à jour les 8 fichiers de langues si tu changes du texte
7. **Documentation** : Ne crée PAS de nouveaux fichiers MD sauf si explicitement demandé
8. **Backup files** : Ne crée PAS de fichiers .backup ou .old

### Fichiers importants à connaître
- `src/lib/supabase.ts` : Client Supabase
- `src/types/project.types.ts` : Types principaux
- `src/integrations/supabase/types.ts` : Types générés Supabase
- `supabase/migrations/` : Historique 213 migrations
- `.env` : Variables environnement (déjà configuré)

### Ce qu'il NE faut PAS faire
- ❌ Créer de nouvelles tables sans validation
- ❌ Supprimer des migrations existantes
- ❌ Changer les types Supabase générés
- ❌ Ajouter des emojis dans le code
- ❌ Utiliser des couleurs violettes (règle design)

---

## 🎓 CONTEXTE MÉTIER

Ce projet est destiné à des **promoteurs immobiliers à Chypre** qui :
- Gèrent plusieurs projets simultanément
- Ont une équipe commerciale (agents)
- Visent des clients internationaux (multilingue)
- Proposent des investissements Golden Visa (≥€300k)
- Ont besoin d'un CRM + analytics + gestion catalogue

L'utilisateur principal est un **admin immobilier** qui doit pouvoir :
- Créer/éditer des projets en quelques clics
- Suivre son pipeline de vente
- Calculer ses commissions automatiquement
- Exporter des rapports pour sa direction
- Gérer son équipe commerciale

---

## ✅ PRÊT À DÉMARRER

Tu as maintenant toutes les informations pour comprendre :
- ✅ L'architecture complète du projet
- ✅ La structure database Supabase (7 tables actives, 23 vides)
- ✅ Le stack technique utilisé
- ✅ Les fonctionnalités implémentées
- ✅ Les problèmes connus
- ✅ Les recommandations futures

**Le projet fonctionne et build sans erreurs.**

Si on te demande de faire des modifications, vérifie toujours :
1. Que la table Supabase existe (ou crée-la)
2. Que les types TypeScript sont à jour
3. Que le build passe (`npm run build`)
4. Que les 8 langues sont mises à jour si nécessaire

---

**BON TRAVAIL ! 🚀**
