# ENKI REALTY DESIGN SYSTEM

**Version:** 1.0
**Date:** Octobre 2025
**Inspiration:** [OneArc Framer Website](https://onearc.framer.website/)
**Philosophie:** Élégance méditerranéenne minimaliste

---

## 🎨 PHILOSOPHIE DE DESIGN

### Vision Globale
Le design system ENKI Realty s'inspire de l'élégance architecturale méditerranéenne et du minimalisme moderne. Il combine :

- **Sophistication sobre** : Jamais criard, toujours raffiné
- **Respiration visuelle** : Espaces généreux, hiérarchie claire
- **Excellence typographique** : Inter comme pilier de lisibilité
- **Palette naturelle** : Couleurs inspirées de Chypre (océan, sable, terre cuite)

### Principes Directeurs

1. **Moins c'est plus** : Chaque élément a une fonction précise
2. **Hiérarchie visuelle claire** : Le regard sait où aller
3. **Cohérence systémique** : Mêmes patterns partout
4. **Performance visuelle** : Rapide à charger, agréable à l'œil
5. **Accessibilité** : WCAG AA minimum sur tous les contrastes

---

## 🔤 TYPOGRAPHIE

### Police Principale : Inter

**Pourquoi Inter ?**
- Excellente lisibilité web et print
- Conçue spécifiquement pour les écrans
- Nombreux poids disponibles (100-900)
- Chiffres tabulaires parfaits pour l'immobilier
- Open source et optimisée

### Configuration Tailwind
```typescript
fontFamily: {
  'inter': ['Inter', 'system-ui', 'sans-serif'],
}
```

### Échelle Typographique

#### Titres (Headings)

| Niveau | Classe Tailwind | Taille | Poids | Usage |
|--------|----------------|--------|-------|-------|
| H1 Hero | `text-9xl` | 128px | 300 (Light) | Hero sections uniquement |
| H1 | `text-7xl` | 72px | 300 (Light) | Titre page principale |
| H2 | `text-5xl` | 48px | 400 (Regular) | Sections majeures |
| H3 | `text-3xl` | 30px | 500 (Medium) | Sous-sections |
| H4 | `text-xl` | 20px | 600 (Semibold) | Titres de cartes |
| H5 | `text-lg` | 18px | 600 (Semibold) | Petits titres |

**Caractéristiques communes des titres :**
- `tracking-tight` : Espacement légèrement réduit
- `leading-[0.95]` à `leading-tight` : Interligne serré pour impact
- Couleur : `text-gray-900` (défaut) ou `text-white` (sur fonds sombres)

#### Corps de Texte (Body)

| Type | Classe | Taille | Poids | Line Height | Usage |
|------|--------|--------|-------|-------------|-------|
| Large | `text-lg` | 18px | 400 | 150% | Intro, lead paragraphs |
| Normal | `text-base` | 16px | 400 | 150% | Corps principal |
| Small | `text-sm` | 14px | 400 | 140% | Descriptions, labels |
| Tiny | `text-xs` | 12px | 500 | 130% | Métadonnées, badges |

#### Nombres et Prix

```css
/* Classe custom pour les prix */
.price-display {
  font-family: Inter;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
```

**Exemples d'application :**
- Prix principal : `text-4xl font-semibold tracking-tight`
- Prix par m² : `text-lg font-medium text-gray-600`
- Métrique (superficie) : `text-2xl font-semibold tabular-nums`

#### Letterspacing (Tracking)

| Classe | Valeur | Usage |
|--------|--------|-------|
| `tracking-tighter` | -0.05em | Grands titres (H1-H2) |
| `tracking-tight` | -0.025em | Titres moyens (H3-H4) |
| `tracking-normal` | 0 | Corps de texte |
| `tracking-wide` | 0.025em | Labels, tags |
| `tracking-[0.2em]` | 0.2em | UPPERCASE text |

---

## 🎨 PALETTE DE COULEURS

### Couleurs Principales (HSL Format)

#### Ocean Blue (Primary)
```css
--primary: 199 63% 59%; /* #57B9D6 */
--primary-foreground: 0 0% 100%;
--primary-hover: 199 63% 55%;
```

**Usage :**
- Boutons CTA principaux
- Liens interactifs
- Éléments de navigation actifs
- Mise en avant stratégique

#### Cyprus Terra (Accent)
```css
--cyprus-terra: 25 35% 55%; /* Terre cuite méditerranéenne */
--cyprus-terra-foreground: 0 0% 100%;
```

**Usage :**
- Badges "Exclusif", "Hot Deal"
- Accents sur éléments premium
- Séparateurs visuels importants

### Couleurs Neutres (Grays)

#### Échelle Complète
```css
gray-50:  #FAFAFA  /* Arrière-plans très légers */
gray-100: #F5F5F5  /* Arrière-plans sections */
gray-200: #E5E5E5  /* Bordures légères */
gray-300: #D4D4D4  /* Bordures standards */
gray-400: #A3A3A3  /* Texte désactivé */
gray-500: #737373  /* Texte secondaire */
gray-600: #525252  /* Texte tertiaire */
gray-700: #404040  /* Texte principal */
gray-800: #262626  /* Texte emphase */
gray-900: #171717  /* Titres, emphase forte */
```

#### Noirs et Blancs Purs
```css
black: #000000    /* Fonds hero, overlays */
white: #FFFFFF    /* Fonds cartes, texte sur sombre */
```

### Couleurs Sémantiques

#### Success (Validations, confirmations)
```css
--success: 142 71% 45%; /* Vert méditerranéen */
--success-foreground: 0 0% 100%;
```

**Variantes :**
- `bg-green-50` : Arrière-plan notifications
- `text-green-600` : Texte positif
- `border-green-200` : Bordures succès

#### Destructive (Erreurs, suppressions)
```css
--destructive: 0 84.2% 60.2%; /* Rouge élégant */
--destructive-foreground: 0 0% 100%;
```

**Variantes :**
- `bg-red-50` : Arrière-plan alertes
- `text-red-600` : Texte erreur
- `border-red-200` : Bordures erreur

#### Warning (Avertissements)
```css
/* Utiliser amber au lieu de yellow */
amber-50: #FFFBEB
amber-500: #F59E0B
amber-600: #D97706
```

### Règles d'Usage des Couleurs

#### DO ✅
- Utiliser gray pour 90% de l'interface
- Primary blue pour CTAs et navigation
- Terra cotta SEULEMENT pour badges premium
- Blanc pur pour cartes sur fond gris
- Noir pur pour hero sections

#### DON'T ❌
- Jamais de bleu/purple/indigo vif
- Jamais de dégradés arc-en-ciel
- Jamais plus de 2 couleurs d'accent sur un écran
- Jamais de jaune pur (toujours amber)
- Jamais de bordures colorées sans raison sémantique

---

## 📐 SPACING SYSTEM

### Échelle (Base 4px)

| Token | Valeur | Classe Tailwind | Usage |
|-------|--------|-----------------|-------|
| xs | 4px | `space-1` | Espaces micro (badges) |
| sm | 8px | `space-2` | Espaces entre icône et texte |
| md | 16px | `space-4` | Espaces standards entre éléments |
| lg | 24px | `space-6` | Espaces entre sections mineures |
| xl | 32px | `space-8` | Espaces entre sections |
| 2xl | 48px | `space-12` | Espaces entre blocs majeurs |
| 3xl | 64px | `space-16` | Espaces hero |
| 4xl | 96px | `space-24` | Respiration maximale |

### Padding Standards

#### Cartes (Cards)
```tsx
<Card className="p-6">        {/* Standard */}
<Card className="p-8">        {/* Spacieuse */}
<Card className="p-4">        {/* Compacte */}
```

#### Sections
```tsx
<section className="py-16 px-6">      {/* Mobile */}
<section className="py-24 px-12">     {/* Desktop */}
<section className="py-32 px-6">      {/* Hero */}
```

#### Grilles
```tsx
<div className="grid gap-4">    {/* Compact */}
<div className="grid gap-6">    {/* Standard */}
<div className="grid gap-8">    {/* Spacieux */}
```

---

## 🎯 COMPOSANTS UI

### Boutons (Buttons)

#### Variantes

##### Primary (CTA Principal)
```tsx
<button className="
  bg-primary hover:bg-primary-hover
  text-white font-medium
  px-6 py-3 rounded-lg
  transition-colors duration-200
  shadow-md hover:shadow-lg
">
  Contactez-nous
</button>
```

##### Secondary (Action secondaire)
```tsx
<button className="
  bg-white hover:bg-gray-50
  text-gray-900 font-medium
  px-6 py-3 rounded-lg
  border border-gray-300
  transition-all duration-200
">
  En savoir plus
</button>
```

##### Ghost (Navigation)
```tsx
<button className="
  bg-transparent hover:bg-gray-100
  text-gray-700 hover:text-gray-900
  px-4 py-2 rounded-lg
  transition-colors duration-200
">
  Explorer
</button>
```

##### Destructive
```tsx
<button className="
  bg-red-600 hover:bg-red-700
  text-white font-medium
  px-6 py-3 rounded-lg
  transition-colors duration-200
">
  Supprimer
</button>
```

#### Tailles
```tsx
// Small
<button className="px-3 py-1.5 text-sm">Small</button>

// Medium (default)
<button className="px-6 py-3 text-base">Medium</button>

// Large
<button className="px-8 py-4 text-lg">Large</button>
```

### Cartes (Cards)

#### Standard Card
```tsx
<div className="
  bg-white rounded-lg
  border border-gray-200
  p-6
  shadow-sm hover:shadow-md
  transition-shadow duration-200
">
  {/* Content */}
</div>
```

#### Premium Card
```tsx
<div className="
  bg-white rounded-xl
  border-2 border-primary/20
  p-8
  shadow-lg hover:shadow-xl
  transition-all duration-300
">
  {/* Content */}
</div>
```

#### Property Card (Carte Projet)
```tsx
<div className="
  bg-white rounded-lg overflow-hidden
  border border-gray-200
  hover:shadow-xl hover:border-primary/30
  transition-all duration-300
  group
">
  {/* Image avec overlay au hover */}
  <div className="relative overflow-hidden h-64">
    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
  </div>

  {/* Content */}
  <div className="p-6">
    {/* Info */}
  </div>
</div>
```

### Badges

#### Status Badge
```tsx
<span className="
  inline-flex items-center
  px-3 py-1 rounded-full
  text-xs font-medium
  bg-gray-100 text-gray-700
">
  Disponible
</span>
```

#### Premium Badge
```tsx
<span className="
  inline-flex items-center gap-1
  px-3 py-1 rounded-full
  text-xs font-semibold
  bg-cyprus-terra text-white
">
  <Star className="h-3 w-3" />
  Exclusif
</span>
```

#### Distance Badge (Commodités)
```tsx
<span className="
  inline-flex items-center gap-1
  px-2 py-1 rounded
  text-xs font-medium
  bg-gray-50 text-gray-600
  border border-gray-200
">
  <MapPin className="h-3 w-3" />
  2.5 km
</span>
```

### Inputs (Formulaires)

#### Text Input Standard
```tsx
<input className="
  w-full px-4 py-3
  border border-gray-300 rounded-lg
  focus:border-primary focus:ring-2 focus:ring-primary/20
  transition-all duration-200
  text-gray-900 placeholder:text-gray-400
" />
```

#### Select
```tsx
<select className="
  w-full px-4 py-3
  border border-gray-300 rounded-lg
  focus:border-primary focus:ring-2 focus:ring-primary/20
  transition-all duration-200
  text-gray-900 bg-white
  cursor-pointer
">
  <option>Option</option>
</select>
```

#### Checkbox Simple (Admin)
```tsx
<input type="checkbox" className="
  h-4 w-4 rounded
  border-gray-300 text-gray-900
  focus:ring-primary focus:ring-2
  cursor-pointer
" />
```

---

## 🌐 LAYOUTS & GRILLES

### Container System

#### Page Container
```tsx
<div className="max-w-7xl mx-auto px-6 lg:px-12">
  {/* Content */}
</div>
```

#### Narrow Container (Articles, formulaires)
```tsx
<div className="max-w-3xl mx-auto px-6">
  {/* Content */}
</div>
```

#### Full Bleed (Hero, galeries)
```tsx
<div className="w-full">
  {/* Content */}
</div>
```

### Grilles Standards

#### 2 Colonnes (Desktop)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Items */}
</div>
```

#### 3 Colonnes (Projets)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

#### 4 Colonnes (Features)
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Items */}
</div>
```

#### 50/50 Split (Admin)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div>{/* Left */}</div>
  <div>{/* Right */}</div>
</div>
```

---

## 🖼️ IMAGES & MÉDIAS

### Ratios Standards

| Type | Ratio | Usage |
|------|-------|-------|
| Hero | 16:9 | Bannières principales |
| Property Card | 4:3 | Vignettes projets |
| Gallery | 3:2 | Galeries photos |
| Square | 1:1 | Logos, avatars |
| Portrait | 3:4 | Photos architecturales |

### Classes Optimisées

#### Image Hero (Fullscreen)
```tsx
<img className="
  w-full h-screen object-cover
  opacity-60
" />
```

#### Image Card (Hover Scale)
```tsx
<img className="
  w-full h-64 object-cover
  group-hover:scale-105
  transition-transform duration-500
" />
```

#### Image Responsive
```tsx
<img className="
  w-full h-auto
  rounded-lg
" />
```

### Overlays

#### Gradient Overlay (Hero)
```tsx
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
```

#### Solid Overlay (Texte lisible)
```tsx
<div className="absolute inset-0 bg-black/50" />
```

---

## 🎬 ANIMATIONS & TRANSITIONS

### Durées Standards

```css
duration-100  /* 100ms - Micro-interactions (hover checkbox) */
duration-200  /* 200ms - Buttons, links, borders */
duration-300  /* 300ms - Cards, modals */
duration-500  /* 500ms - Images scale, complex transitions */
duration-700  /* 700ms - Page transitions */
```

### Easing Functions

```css
ease-in      /* Accélération douce */
ease-out     /* Décélération douce (défaut) */
ease-in-out  /* Courbe en S */
```

### Patterns Courants

#### Hover Card
```tsx
<div className="
  transition-all duration-300 ease-out
  hover:shadow-xl hover:scale-[1.02]
">
```

#### Button Hover
```tsx
<button className="
  transition-colors duration-200
  hover:bg-primary-hover
">
```

#### Image Zoom (Hover)
```tsx
<div className="overflow-hidden">
  <img className="
    transition-transform duration-500 ease-out
    group-hover:scale-110
  " />
</div>
```

#### Fade In (Page Load)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints Tailwind

| Breakpoint | Taille | Usage |
|------------|--------|-------|
| `sm` | 640px | Petits mobiles landscape |
| `md` | 768px | Tablettes portrait |
| `lg` | 1024px | Tablettes landscape, petits laptops |
| `xl` | 1280px | Desktop standard |
| `2xl` | 1536px | Grand desktop |

### Patterns Mobile-First

#### Typography Responsive
```tsx
<h1 className="
  text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
  font-light tracking-tight
">
```

#### Padding Responsive
```tsx
<section className="
  py-12 px-6
  md:py-16 md:px-8
  lg:py-24 lg:px-12
">
```

#### Grid Responsive
```tsx
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
```

---

## ♿ ACCESSIBILITÉ

### Contrastes Minimums (WCAG AA)

| Combinaison | Ratio | Statut |
|-------------|-------|--------|
| gray-900 sur white | 16:1 | ✅ Excellent |
| gray-700 sur white | 10:1 | ✅ Excellent |
| gray-600 sur white | 7:1 | ✅ Bon |
| primary sur white | 4.5:1 | ✅ Minimum |
| white sur primary | 4.5:1 | ✅ Minimum |

### Règles Strictes

1. **Focus visible** : Toujours `focus:ring-2 focus:ring-primary/20`
2. **Alt text** : Obligatoire sur toutes les images
3. **Labels** : Tous les inputs ont un label (visible ou aria-label)
4. **Keyboard navigation** : Tous les éléments interactifs accessibles au clavier
5. **Color independence** : Ne jamais utiliser SEULEMENT la couleur pour transmettre l'info

---

## 📋 CHECKLIST DESIGN

### Avant de Déployer un Composant

- [ ] Police Inter utilisée partout
- [ ] Palette limitée (gray + primary + 1 accent max)
- [ ] Aucune couleur bleue/violette criarde
- [ ] Espacement cohérent (système 4px)
- [ ] Transitions sur hover (200-300ms)
- [ ] Contrastes WCAG AA validés
- [ ] Responsive mobile-first
- [ ] Focus states visibles
- [ ] Alt text sur images
- [ ] Cohérent avec composants existants

---

## 🔧 OUTILS & WORKFLOW

### Extensions VS Code Recommandées
- **Tailwind CSS IntelliSense** : Autocomplétion classes
- **Prettier** : Formatage automatique
- **ESLint** : Linting JavaScript/TypeScript

### Commande Build
```bash
npm run build  # Vérifier que tout compile
```

### Test Visual
```bash
npm run dev    # Tester en local
```

---

## 📚 EXEMPLES DE PAGES

### Page Template Projet (Référence Gold Standard)

**Fichier :** `src/pages/projects/ProjectPage.tsx`

**Caractéristiques :**
- Hero fullscreen avec vidéo/image (opacité 60%)
- Titre géant (text-9xl) en font-light
- Sections généreusement espacées (py-24)
- Cartes blanches sur fond légèrement gris
- Animations subtiles au scroll (Framer Motion)
- Typography impeccable (Inter light pour titres, regular pour texte)

**À Réutiliser :**
```tsx
// Hero Section Pattern
<section className="relative w-full h-screen bg-black">
  <div className="absolute inset-0">
    <img className="w-full h-full object-cover opacity-60" />
  </div>
  <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
    <p className="text-white/60 text-sm tracking-[0.2em] uppercase mb-8 font-light">
      {location}
    </p>
    <h1 className="text-white text-9xl font-light tracking-tight leading-[0.95] mb-12">
      {title}
    </h1>
  </div>
</section>
```

---

## 🎓 RESSOURCES

### Inspiration Design
- [OneArc Framer](https://onearc.framer.website/) - Référence principale
- [Awwwards Real Estate](https://www.awwwards.com/websites/real-estate/) - Tendances luxe
- [Inter Font](https://rsms.me/inter/) - Documentation police

### Documentation Technique
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Design System maintenu par l'équipe ENKI Realty**
**Dernière mise à jour :** Octobre 2025
