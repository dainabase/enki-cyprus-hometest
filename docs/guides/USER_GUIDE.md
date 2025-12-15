# Guide Utilisateur

## Navigation

Le menu latéral contient les sections suivantes :

### 📊 **Dashboard**
Vue d'ensemble avec KPIs temps réel :
- Nombre total de projets, propriétés, leads
- Valeur du portefeuille
- Taux de conversion
- Graphiques d'évolution

### 🏗️ **Projects**
Gestion des projets immobiliers :
- Créer/modifier/supprimer des projets
- Associer à un développeur
- Définir zone géographique
- Marquer Golden Visa si ≥€300,000

### 🏢 **Buildings**
Gestion des bâtiments :
- Créer des bâtiments dans un projet
- Définir nombre d'étages et d'unités
- Statut de construction
- Type de bâtiment

### 🏠 **Properties**
Gestion des propriétés individuelles :
- Créer dans un bâtiment
- Prix, surface, chambres
- Upload d'images
- Plans d'étage

### 👥 **Leads**
CRM des prospects :
- Import/création de leads
- Assignation aux commerciaux
- Scoring automatique
- Historique des interactions

### 📋 **Pipeline**
Kanban des ventes :
- Drag & drop entre étapes
- Suivi progression
- Temps moyen par étape
- Taux de conversion

### 💰 **Commissions**
Tracking des paiements :
- Calcul automatique
- Statut des paiements
- Historique par commercial
- Export comptable

### 📈 **Reports**
Export des données :
- CSV personnalisés
- Filtres avancés
- Planification automatique
- Envoi par email

### 📊 **Analytics**
Graphiques et métriques :
- Évolution des ventes
- Performance par zone
- Analyse de rentabilité
- Comparaisons temporelles

### 🔮 **Predictions**
Tendances et prévisions :
- Prédiction des ventes
- Analyse saisonnière
- Recommandations pricing
- Alertes opportunités

### 🎯 **Segmentation**
Classification des clients :
- Segments automatiques
- Profils d'acheteurs
- Ciblage marketing
- Personnalisation offres

### 🏆 **Performance**
Classement des agents :
- Top performers
- Métriques individuelles
- Objectifs et réalisations
- Historique performance

## Workflows principaux

### Créer un nouveau projet
1. **Aller dans Projects** → Cliquer "New Project"
2. **Sélectionner le développeur** (obligatoire)
3. **Remplir les informations** :
   - Titre et description
   - Zone géographique
   - Prix et caractéristiques
4. **Cocher "Golden Visa Eligible"** si prix ≥€300,000
5. **Sauvegarder** et ajouter images

### Gérer les leads
1. **Aller dans Leads** → Voir nouveaux prospects
2. **Assigner un score** (0-5 étoiles selon potentiel)
3. **Changer le statut** selon progression
4. **Aller dans Pipeline** → Drag & drop pour avancer
5. **Ajouter notes** et programmer suivi

### Traiter une vente
1. **Pipeline** → Déplacer lead vers "Sold"
2. **Commission automatique** calculée et créée
3. **Propriété** marquée comme vendue
4. **Analytics** mis à jour en temps réel

### Export de données
1. **Reports** → Sélectionner type d'export
2. **Configurer filtres** (dates, zones, statuts)
3. **Choisir colonnes** à inclure
4. **Télécharger CSV** ou programmer envoi

## Zones géographiques

- **Limassol** : Hub commercial, bureaux, résidentiel haut standing
- **Paphos** : Tourisme, villas, retraités européens
- **Larnaca** : Proximité aéroport, investisseurs locatifs
- **Nicosia** : Capitale, bureaux, appartements familiaux
- **Famagusta** : Zone émergente, potentiel de croissance

## Support multilingue

L'interface supporte 8 langues :
- **Anglais** (EN) - Langue principale
- **Français** (FR) - Marché francophone
- **Grec** (EL) - Population locale
- **Russe** (RU) - Investisseurs russes
- **Espagnol** (ES) - Marché hispanophone
- **Italien** (IT) - Investisseurs italiens
- **Allemand** (DE) - Marché germanophone
- **Néerlandais** (NL) - Investisseurs néerlandais

## Raccourcis clavier

- **Ctrl+K** : Recherche rapide
- **Ctrl+N** : Nouvelle entité
- **Ctrl+S** : Sauvegarder formulaire
- **Ctrl+E** : Export données
- **Escape** : Fermer modal/formulaire

## Conseils d'utilisation

### Performance
- Utiliser la pagination (25 items par page)
- Filtrer avant d'exporter de gros volumes
- Actualiser le cache en cas de données obsolètes

### Workflow optimal
1. **Matin** : Vérifier Dashboard et nouveaux leads
2. **Pipeline** : Avancer les prospects chauds
3. **Suivi** : Contacter les leads assignés
4. **Fin de journée** : Mettre à jour notes et statuts

### Gestion des images
- Formats supportés : JPG, PNG, WebP
- Taille max : 10MB par image
- Optimisation automatique par Supabase
- Organisation par dossiers de projet