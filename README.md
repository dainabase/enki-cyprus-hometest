# ENKI-REALTY Cyprus Real Estate Platform

Une plateforme immobilière moderne pour explorer et découvrir les propriétés premium à Chypre, construite avec React, Vite, TypeScript, Tailwind CSS, et Framer Motion.

## 🏠 Fonctionnalités Principales

- **Carte Interactive Google Maps** : Explorez les propriétés avec clustering intelligent et animations
- **Recherche Avancée** : Filtrez par localisation, type, et gamme de prix
- **Propriétés Premium** : Collection de villas, appartements, penthouses et locaux commerciaux
- **Interface Responsive** : Optimisée pour desktop, tablet et mobile
- **Animations Fluides** : Interface utilisateur avec Framer Motion
- **Design Moderne** : System de design cohérent avec Tailwind CSS

## 🗺️ Configuration de la Carte

La carte Google Maps est configurée pour :
- **Centre par défaut** : Chypre (35.1264, 33.4299) avec zoom niveau 9
- **Clustering** : Regroupement automatique des marqueurs selon le zoom
- **Marqueurs personnalisés** : Icônes différenciées par type de propriété
- **Info Windows** : Aperçu rapide avec détails de la propriété

## 🧪 Test de la Propriété Mersini Beach

Une propriété de test spéciale a été ajoutée pour validation :
- **Nom** : "Mersini Beach Apartment"
- **Localisation** : Paphos (34.7768, 32.4245)
- **Caractéristiques** : 2 chambres, 80 m², 250,000 €
- **Test** : Rechercher "Mersini" ou "Paphos" pour isoler cette propriété

## 🚀 Installation et Lancement

```bash
# Cloner le projet
git clone [url-du-repo]
cd enki-realty

# Installer les dépendances
npm install

# Configurer la clé API Google Maps
cp .env.example .env.local
# Éditer .env.local et remplacer 'your_google_maps_api_key_here' par votre clé API

# Lancer en développement
npm run dev
```

## 🔑 Configuration Google Maps API

1. Obtenir une clé API sur [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Activer les APIs suivantes :
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Ajouter la clé dans `.env.local` :
   ```
   VITE_GOOGLE_MAPS_API_KEY=votre_cle_api_ici
   ```

## 🧪 Tests Recommandés

### Test de la Carte
1. Lancer `npm run dev`
2. Naviguer vers la page d'accueil
3. Vérifier que la carte se centre sur Chypre au chargement
4. Observer les console logs pour le debug

### Test de Recherche
1. Utiliser la barre de recherche avec "Paphos"
2. Vérifier que seuls les biens à Paphos s'affichent
3. Tester le bouton "Mersini Beach (Test)" pour isoler l'appartement test
4. Essayer différents filtres de type et prix

### Test de Clustering
1. Zoomer/dézoomer sur la carte
2. Observer le regroupement automatique des marqueurs
3. Cliquer sur les clusters pour zoom automatique

### Test des Animations
1. Cliquer sur un marqueur pour ouvrir l'InfoWindow
2. Vérifier l'animation fade-in du modal de propriété
3. Tester les animations hover sur les marqueurs

## 📱 Structure du Projet

```
src/
├── components/
│   ├── GoogleMap.tsx           # Composant carte principal
│   ├── PropertySearch.tsx      # Recherche et filtres
│   ├── PropertyModal.tsx       # Modal détails propriété
│   └── ui/                     # Composants UI réutilisables
├── data/
│   └── mockData.ts            # Données de test (incluant Mersini Beach)
├── pages/
│   └── Home.tsx               # Page d'accueil principale
└── lib/
    └── utils.ts               # Utilitaires
```

## 🐛 Debug et Console Logs

Le projet inclut des console logs détaillés pour le debug :
- `🗺️` : Événements de la carte Google Maps
- `📍` : Centrage et positionnement
- `📌` : Création des marqueurs
- `🏠` : Interaction avec les propriétés
- `🔍` : Fonctions de recherche et filtrage
- `📊` : Statistiques et compteurs

## 🚀 Production

```bash
# Build pour production
npm run build

# Preview du build
npm run preview
```

## 🛠️ Technologies Utilisées

- **React 18** : Framework frontend
- **Vite** : Build tool moderne
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utility-first
- **Framer Motion** : Animations et transitions
- **Google Maps API** : Cartes interactives
- **React Router** : Navigation SPA
- **Radix UI** : Composants accessibles

## 🎯 Prochaines Étapes

- [ ] Intégration avec une vraie API backend
- [ ] Authentification utilisateur
- [ ] Système de favoris
- [ ] Visite virtuelle 360°
- [ ] Calculateur de financement
- [ ] Notifications en temps réel

---

**ENKI-REALTY** - Votre passerelle vers l'immobilier de luxe à Chypre 🏝️