# Enki Reality Admin Panel

## 🏠 Vue d'ensemble
Panel d'administration pour la gestion immobilière à Chypre.
- Gestion multi-projets (Développeur → Projet → Bâtiment → Propriété)
- Support Golden Visa (≥€300,000)
- CRM et pipeline de vente
- Support 8 langues
- Analytics et prédictions

## 🚀 Quick Start
```bash
npm install
cp .env.example .env
npm run dev
```

## 📋 Fonctionnalités principales

✅ **CRUD complet** pour toutes les entités
✅ **Gestion multilingue** (EN, FR, EL, RU, ES, IT, DE, NL)
✅ **Upload d'images** avec Supabase Storage
✅ **Calcul automatique** des commissions
✅ **Pipeline de vente** kanban
✅ **Segmentation clients** automatique
✅ **Dashboard** avec KPIs temps réel
✅ **Export CSV** des données
✅ **Analytics** avec graphiques

## 🛠 Stack technique

- **Frontend**: React + Vite + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI**: Tailwind CSS + Shadcn/ui
- **State**: React Query + Zustand
- **Charts**: Recharts

## 📊 Architecture

```
Développeur (1)
  └── Projets (N)
      └── Bâtiments (N)
          └── Propriétés (N)
```

## 🔐 Fonctionnalités métier

- **Golden Visa**: Détection automatique pour investissements ≥€300,000
- **Commissions**: Calcul automatique selon taux développeur
- **Pipeline**: Suivi des prospects de "New" à "Sold"
- **Segmentation**: Classification automatique des clients
- **Performance**: Classement des agents commerciaux

## 📖 Documentation

- [Guide d'installation](./INSTALLATION.md)
- [Guide utilisateur](./USER_GUIDE.md)
- [Documentation API](./API_DOCUMENTATION.md)
- [Changelog](./CHANGELOG.md)

## 🌐 Zones géographiques supportées

- **Limassol**: Hub commercial principal
- **Paphos**: Tourisme & résidentiel
- **Larnaca**: Proximité aéroport
- **Nicosia**: Capitale
- **Famagusta**: Zone émergente

## 📱 Support

- Desktop responsive
- Tablet optimisé
- Mobile friendly
- PWA ready

---

**ENKI-REALITY** - Votre solution d'administration immobilière à Chypre 🏝️