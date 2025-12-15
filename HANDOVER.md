# 🤝 HANDOVER LÉONCE - ENKI REALITY

> **Date** : 15 Décembre 2025  
> **De** : Jean-Marie Delaunay  
> **Pour** : Léonce  

---

## 🚀 DÉMARRAGE RAPIDE

```bash
# 1. Cloner le repo
git clone https://github.com/dainabase/enki-cyprus-hometest.git
cd enki-cyprus-hometest

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec les clés Supabase (voir section Configuration)

# 4. Lancer le serveur de dev
npm run dev
```

---

## 📋 INFORMATIONS ESSENTIELLES

### Accès Supabase
| Élément | Valeur |
|---------|--------|
| **Project ID** | `ccsakftsslurjgnjwdci` |
| **URL** | `https://ccsakftsslurjgnjwdci.supabase.co` |
| **Dashboard** | [Ouvrir Supabase](https://supabase.com/dashboard/project/ccsakftsslurjgnjwdci) |

### Accès GitHub
| Élément | Valeur |
|---------|--------|
| **Repo** | `dainabase/enki-cyprus-hometest` |
| **URL** | https://github.com/dainabase/enki-cyprus-hometest |
| **Branche principale** | `main` |

---

## 🏗️ ARCHITECTURE DU PROJET

### Stack Technique
- **Frontend** : React 19 + TypeScript + Vite
- **Styling** : Tailwind CSS + Shadcn/ui
- **Animations** : Framer Motion
- **State** : React Query + Zustand
- **Database** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth

### Structure des Dossiers
```
enki-cyprus-hometest/
├── src/
│   ├── components/       # Composants React
│   │   ├── admin/        # Panel d'administration
│   │   ├── chat/         # Agent IA conversationnel
│   │   ├── expansion/    # Inline Expansion (properties)
│   │   ├── hero/         # Section Hero + Trust Bar
│   │   ├── layout/       # Header, Footer, Navigation
│   │   ├── lexaia/       # Outils fiscaux Exaia
│   │   └── projects/     # Cartes et grilles projets
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitaires et config Supabase
│   ├── pages/            # Pages de l'application
│   └── types/            # Types TypeScript
├── docs/                 # Documentation organisée
│   ├── architecture/     # Docs techniques
│   ├── guides/           # Guides utilisateur/dev
│   ├── audits/           # Rapports d'audit
│   ├── design-system/    # Design System ENKI
│   └── archive/          # Fichiers historiques
├── supabase/
│   └── migrations/       # 213 migrations SQL
└── public/               # Assets statiques
```

### Hiérarchie des Données
```
developers (32 colonnes)
    └── projects (213 colonnes)
        └── buildings (97 colonnes)
            └── properties (223 colonnes)
```

---

## 🎨 DESIGN SYSTEM ENKI

### Couleurs Principales
```css
/* Ocean Blue - Couleur principale */
--ocean-50: #e6f4f9
--ocean-500: #0891B2
--ocean-600: #0E7490
--ocean-900: #164E63

/* Cyprus Terra - Accent */
--terra-500: #D97706
--terra-600: #B45309
```

### Animations Standards
```typescript
// Easing pour toutes les animations
ease: [0.25, 0.46, 0.45, 0.94]

// Durées
fast: 0.2s
normal: 0.3s
slow: 0.5s
```

### Règles UI
- ❌ **JAMAIS d'emojis** dans l'interface
- ✅ Mobile-first obligatoire
- ✅ Glassmorphism pour les overlays
- ✅ Animations subtiles et professionnelles

---

## 🗄️ BASE DE DONNÉES

### Tables Principales
| Table | Colonnes | Description |
|-------|----------|-------------|
| `developers` | 32 | Promoteurs immobiliers |
| `projects` | 213 | Programmes immobiliers |
| `buildings` | 97 | Bâtiments par projet |
| `properties` | 223 | Unités individuelles |
| `leads` | ~50 | Prospects CRM |
| `commissions` | ~20 | Calcul commissions |

### Triggers Automatiques
- **Golden Visa** : Détection automatique si prix ≥ €300,000
- **Commissions** : Calcul auto sur vente
- **Cascade** : Mise à jour automatique des agrégations

### Projet Test
- **Nom** : Azure Marina Paradise
- **ID** : Chercher dans `projects` table
- **Contient** : Données complètes pour tester

---

## 📁 DOCUMENTATION

| Dossier | Contenu |
|---------|---------|
| `docs/architecture/` | Architecture technique, API, migrations |
| `docs/guides/` | Guides d'installation, déploiement, utilisation |
| `docs/audits/` | Rapports d'audit et analyses |
| `docs/design-system/` | Design System ENKI complet |
| `docs/archive/` | Fichiers historiques (référence) |

### Fichiers Clés à Lire
1. `docs/guides/DEPLOYMENT_GUIDE.md` - Déploiement
2. `docs/design-system/ENKI_DESIGN_SYSTEM_COMPLETE.md` - Design System
3. `docs/architecture/API_DOCUMENTATION.md` - API Supabase
4. `docs/audits/AUDIT_COMPLET_10_ETAPES.md` - État du projet

---

## ⚠️ POINTS D'ATTENTION

### Ne Pas Modifier
- 🚫 Configuration Google Maps (API key harmonisée)
- 🚫 Triggers SQL existants
- 🚫 Structure des tables principales

### À Tester Après Changements
- ✅ Cascade updates (projet → buildings → properties)
- ✅ Calcul Golden Visa
- ✅ Formulaires admin (tous les champs)
- ✅ Upload d'images

### Variables d'Environnement Requises
```env
VITE_SUPABASE_URL=https://ccsakftsslurjgnjwdci.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

---

## 🔧 COMMANDES UTILES

```bash
# Développement
npm run dev           # Serveur local
npm run build         # Build production
npm run preview       # Preview du build

# Base de données
# Utiliser Supabase Dashboard pour :
# - Voir/éditer les données
# - Exécuter des requêtes SQL
# - Gérer les migrations
```

---

## 📞 CONTACT

Pour toute question sur le projet :
- **Jean-Marie** : [coordonnées à ajouter]

---

## ✅ CHECKLIST PREMIÈRE INSTALLATION

- [ ] Cloner le repo
- [ ] `npm install`
- [ ] Configurer `.env` avec clés Supabase
- [ ] `npm run dev`
- [ ] Vérifier l'accès au dashboard admin `/admin`
- [ ] Tester la création d'un projet
- [ ] Vérifier les animations sur la page Projects

---

**Bon courage Léonce ! 🚀**
