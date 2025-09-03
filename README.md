# ENKI-REALTY - Plateforme Immobilière Premium à Chypre

Une Single Page Application (SPA) moderne et élégante pour la découverte et l'acquisition de propriétés d'exception à Chypre.

## 🌟 Fonctionnalités

### Pages Principales
- **Accueil** : Hero section avec intégration future Google Maps, propriétés en vedette
- **Recherche** : Filtres avancés par type, budget, localisation et équipements
- **Projets** : Galerie complète des propriétés avec système de catégories
- **À Propos** : Présentation d'ENKI-REALTY et partenaires développeurs top 10
- **Contact** : Formulaire de contact avancé et informations de localisation

### Composants Réutilisables
- **Navbar** : Navigation responsive avec logo ENKI-REALTY et bouton connexion
- **Footer** : Liens utiles, réseaux sociaux, mentions légales et RGPD
- **Hero** : Section d'accueil avec image de Chypre et CTA
- **PropertyCard** : Cards animées pour les propriétés avec hover effects

## 🎨 Design & UX

### Thème Visual
- **Couleurs** : Palette neutre (blancs/gris) avec accents bleus méditerranéens
- **Typographie** : Police Inter moderne et lisible
- **Images** : Visuels générés représentant les paysages de Chypre
- **Responsive** : Design mobile-first avec breakpoints optimisés

### Animations
- **Framer Motion** : Transitions fluides et animations d'apparition
- **Hover Effects** : Interactions sur les cards et boutons
- **Stagger Animations** : Apparition progressive des grilles de propriétés
- **Parallax Léger** : Effet sur le hero background

## 🚀 Technologies Utilisées

### Core Stack
- **React 18** : Framework frontend moderne
- **TypeScript** : Typage statique pour une meilleure robustesse
- **Vite** : Build tool ultra-rapide pour le développement
- **Tailwind CSS** : Framework CSS utility-first pour un styling efficient

### Librairies & Outils
- **Framer Motion** : Animations et transitions fluides
- **React Router DOM** : Navigation SPA sans rechargement
- **Shadcn/UI** : Composants UI modernes et accessibles
- **Lucide React** : Icônes SVG optimisées
- **ESLint & Prettier** : Qualité et formatage du code

### Design System
- **Tokens sémantiques** : Couleurs, espaces et typographie centralisés
- **Composants variants** : Boutons premium, cards hover, gradients
- **Mode sombre** : Support complet dark/light mode
- **Responsive breakpoints** : Mobile, tablet, desktop

## 📦 Installation & Développement

### Prérequis
- Node.js 18+ et npm/yarn
- Git pour le versioning

### Installation
```bash
# Cloner le repository
git clone <YOUR_GIT_URL>
cd enki-realty

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Preview du build de production
npm run preview
```

### Scripts Disponibles
```bash
npm run dev          # Serveur de développement (localhost:8080)
npm run build        # Build optimisé pour la production
npm run preview      # Aperçu du build de production
npm run lint         # Vérification ESLint
npm run lint:fix     # Correction automatique ESLint
```

## 📊 Données & Contenu

### Données Mockées
- **5 propriétés exemples** : Villas, appartements, penthouses à Chypre
- **Partenaires développeurs** : Top 10 promoteurs de l'île
- **Localisations** : Limassol, Paphos, Nicosie, Ayia Napa, Larnaca

### Structure des Données
```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  type: 'villa' | 'apartment' | 'penthouse' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  image: string;
  features: string[];
  status: 'available' | 'sold' | 'reserved';
}
```

## 🔒 Sécurité & Performances

### Sécurité
- **HTTPS Ready** : Configuration SSL/TLS
- **Headers sécurisés** : Protection XSS, CSRF
- **Sanitisation** : Validation des inputs utilisateur
- **Auth Placeholder** : Structure prête pour l'authentification

### Performances
- **Code Splitting** : React.lazy pour les composants
- **Lazy Loading** : Images et composants chargés à la demande
- **Tree Shaking** : Élimination du code mort
- **Bundle Optimization** : Vite optimizations

## 🌍 Déploiement

### Vercel (Recommandé)
```bash
# Connecter le repository à Vercel
vercel --prod

# Ou via l'interface Vercel
# 1. Importer le projet GitHub
# 2. Configuration automatique détectée
# 3. Déploiement en un clic
```

### Autres Options
- **Netlify** : Déploiement continu via Git
- **AWS S3 + CloudFront** : Distribution mondiale
- **GitHub Pages** : Hébergement gratuit pour projets publics

### Variables d'Environnement
```bash
# .env.local (pour développement)
VITE_APP_TITLE="ENKI-REALTY"
VITE_GOOGLE_MAPS_API_KEY="your_api_key"
VITE_CONTACT_EMAIL="contact@enki-realty.com"
```

## 🔮 Extensions Futures

### API Integration
- **Backend Node.js** : API REST pour les propriétés
- **Base de données** : PostgreSQL avec Prisma ORM
- **CMS Headless** : Strapi ou Sanity pour la gestion de contenu

### Fonctionnalités Avancées
- **Authentification** : JWT avec refresh tokens
- **Favoris utilisateur** : Sauvegarde des propriétés
- **Notifications** : Alertes email pour nouvelles propriétés
- **Visite virtuelle** : Intégration 360° tours
- **Chat en direct** : Support client temps réel

### Intégrations
- **Google Maps** : Carte interactive des propriétés
- **Payment Gateway** : Stripe pour les réservations
- **CRM Integration** : Salesforce ou HubSpot
- **Analytics** : Google Analytics 4, Hotjar

## 📞 Support & Contribution

### Contact
- **Email** : contact@enki-realty.com
- **Documentation** : [docs.enki-realty.com](https://docs.enki-realty.com)
- **Issues** : GitHub Issues pour les bugs et suggestions

### Contribution
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Copyright © 2024 ENKI-REALTY. Tous droits réservés.

---

**ENKI-REALTY** - *Votre partenaire de confiance pour l'immobilier premium à Chypre* 🏝️