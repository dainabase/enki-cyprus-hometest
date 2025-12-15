# Guide d'installation

## Prérequis

- **Node.js** 18+ et npm
- **Compte Supabase** (gratuit)
- **Git** pour cloner le repository

## Étapes d'installation

### 1. Cloner le repository
```bash
git clone [url-du-repo]
cd enki-reality-admin
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Supabase

#### 3.1 Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé API

#### 3.2 Exécuter les migrations SQL
```sql
-- Dans l'éditeur SQL Supabase, exécuter dans l'ordre :
-- 1. Créer les tables principales
-- 2. Activer RLS sur toutes les tables
-- 3. Créer les policies d'accès
-- 4. Créer les fonctions et triggers
-- (Scripts disponibles dans /supabase/migrations/)
```

#### 3.3 Configurer Storage
1. Créer les buckets dans Supabase Storage :
   - `property-images` (public)
   - `documents` (private)
2. Configurer les policies d'accès

### 4. Variables d'environnement
```bash
cp .env.example .env
```

Éditer le fichier `.env` :
```bash
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_APP_ENV=development
```

### 5. Lancer le développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Configuration avancée

### Authentification
Le système utilise Supabase Auth avec :
- Email/password
- RLS (Row Level Security)
- Rôles : admin, sales, user

### Base de données
Tables principales :
- `developers` - Développeurs immobiliers
- `projects` - Projets immobiliers
- `buildings` - Bâtiments
- `properties` - Propriétés individuelles
- `leads` - Prospects
- `commissions` - Commissions

### Storage
Configuration des buckets :
```javascript
// property-images : public, 10MB max
// documents : private, 50MB max
```

## Déploiement

### Production
```bash
npm run build
npm run preview
```

### Variables de production
```bash
VITE_APP_ENV=production
VITE_ENABLE_TESTS=false
```

## Dépannage

### Erreur Supabase connection
- Vérifier l'URL et la clé API
- Vérifier les policies RLS
- Consulter les logs Supabase

### Erreur CORS
- Ajouter le domaine dans Supabase Settings
- Vérifier la configuration des buckets

### Performance lente
- Activer React Query DevTools
- Vérifier les index SQL
- Optimiser les requêtes

## Support

En cas de problème :
1. Vérifier les logs console
2. Consulter la documentation Supabase
3. Utiliser la page `/admin/tests` pour diagnostiquer