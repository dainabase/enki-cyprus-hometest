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

## 🎬 ANIMATIONS & TRANSITIONS AVANCÉES (FRAMER MOTION)

> **PHILOSOPHIE** : Animations fluides et naturelles inspirées des sites Framer originaux. Chaque mouvement doit avoir un **but** et améliorer l'expérience utilisateur.

### Durées Standards

```css
duration-100  /* 100ms - Micro-interactions (hover checkbox) */
duration-200  /* 200ms - Buttons, links, borders */
duration-300  /* 300ms - Cards, modals */
duration-500  /* 500ms - Images scale, complex transitions */
duration-700  /* 700ms - Page transitions */
duration-1000 /* 1000ms - Parallax, scroll animations */
```

### Easing Functions (Framer Motion)

```typescript
// Easing naturels Framer Motion
const easings = {
  easeOut: [0.16, 1, 0.3, 1],        // Standard (défaut)
  easeInOut: [0.43, 0.13, 0.23, 0.96], // Smooth S-curve
  anticipate: [0.25, 0.1, 0.25, 1],  // Bounce léger
  backOut: [0.34, 1.56, 0.64, 1],    // Overshoot élégant
};
```

---

## 🌊 ANIMATIONS AU SCROLL (SCROLL-TRIGGERED)

### Pattern 1 : Fade In Up (Apparition au scroll)

**Usage :** Sections, cartes, blocs de contenu

```tsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function FadeInSection({ children }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

### Pattern 2 : Stagger Children (Apparition en cascade)

**Usage :** Listes, grilles, features

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Pattern 3 : Scale In (Zoom progressif)

**Usage :** Images, cartes premium, CTAs

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.div>
```

---

## 📌 STICKY SCROLL ANIMATIONS

### Pattern 1 : Sticky Header (Navbar)

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

function StickyNavbar() {
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 0.95)']
  );

  const textColor = useTransform(
    scrollY,
    [0, 100],
    ['#FFFFFF', '#171717']
  );

  const padding = useTransform(
    scrollY,
    [0, 100],
    ['2rem', '1rem']
  );

  return (
    <motion.nav
      style={{ backgroundColor, padding }}
      className="fixed top-0 w-full z-50 backdrop-blur-md"
    >
      <motion.div style={{ color: textColor }}>
        Logo
      </motion.div>
    </motion.nav>
  );
}
```

### Pattern 2 : Sticky Sidebar (Table des matières)

```tsx
<motion.div
  className="sticky top-24"
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.3 }}
>
  {/* Table of contents */}
</motion.div>
```

### Pattern 3 : Sticky CTA (Bottom Bar)

```tsx
function StickyCTA() {
  const [ref, inView] = useInView({ threshold: 0 });

  return (
    <>
      <div ref={ref} /> {/* Trigger point */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: inView ? 100 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 w-full bg-white border-t shadow-xl p-4 z-50"
      >
        <button>Contactez-nous</button>
      </motion.div>
    </>
  );
}
```

---

## 🎢 PARALLAX SCROLL EFFECTS

### Pattern 1 : Simple Parallax (Backgrounds)

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <section className="relative h-screen overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-0"
      >
        <img src="/bg.jpg" className="w-full h-[120vh] object-cover" />
      </motion.div>
      <div className="relative z-10">
        {/* Content */}
      </div>
    </section>
  );
}
```

### Pattern 2 : Multi-Layer Parallax

```tsx
function MultiLayerParallax() {
  const { scrollYProgress } = useScroll();

  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const yMiddle = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const yForeground = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <section className="relative h-screen">
      <motion.div style={{ y: yBackground }} className="absolute inset-0">
        {/* Background layer */}
      </motion.div>
      <motion.div style={{ y: yMiddle }}>
        {/* Middle layer */}
      </motion.div>
      <motion.div style={{ y: yForeground }}>
        {/* Foreground layer */}
      </motion.div>
    </section>
  );
}
```

### Pattern 3 : Zoom Parallax (Images)

```tsx
function ZoomParallax() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <motion.div
      style={{ scale, opacity }}
      className="sticky top-0 h-screen"
    >
      <img src="/hero.jpg" className="w-full h-full object-cover" />
    </motion.div>
  );
}
```

---

## 🔄 SCROLL HORIZONTAL (Défilement horizontal en scrollant verticalement)

### Pattern : Horizontal Gallery

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function HorizontalScroll() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  return (
    <section ref={targetRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex gap-8"
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="min-w-[600px] h-[70vh] rounded-2xl bg-white p-8"
            >
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

---

## ✨ MICRO-INTERACTIONS (Hover & Click)

### Pattern 1 : Magnetic Button (Bouton aimanté)

```tsx
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

function MagneticButton({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) / 4);
    y.set((e.clientY - centerY) / 4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="px-8 py-4 bg-primary text-white rounded-lg"
    >
      {children}
    </motion.button>
  );
}
```

### Pattern 2 : Tilt Card (Carte qui s'incline)

```tsx
function TiltCard({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div
      style={{ rotateX, rotateY }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="bg-white rounded-xl p-8 shadow-lg"
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
```

### Pattern 3 : Ripple Effect (Effet d'onde au clic)

```tsx
function RippleButton({ children }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, id: Date.now() };
    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples(r => r.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden px-8 py-4 bg-primary text-white rounded-lg"
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
          }}
        />
      ))}
      {children}
    </button>
  );
}
```

---

## 🎯 SCROLL PROGRESS INDICATOR

```tsx
import { motion, useScroll } from 'framer-motion';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
    />
  );
}
```

---

## 🌀 PAGE TRANSITIONS

### Pattern : Route Transition

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## 📱 MOBILE GESTURES (Swipe, Drag)

### Pattern : Swipeable Cards

```tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

function SwipeableCard({ onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={(e, { offset, velocity }) => {
        if (Math.abs(offset.x) > 100) {
          onSwipe(offset.x > 0 ? 'right' : 'left');
        }
      }}
      className="absolute w-full h-full bg-white rounded-2xl shadow-xl"
    >
      {/* Card content */}
    </motion.div>
  );
}
```

---

## 🎨 ANIMATION VARIANTS (Presets Réutilisables)

```typescript
// animations.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};
```

**Usage :**
```tsx
import { fadeInUp } from './animations';

<motion.div
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
```

---

## 📱 RESPONSIVE DESIGN (MOBILE-FIRST OBLIGATOIRE)

> **RÈGLE ABSOLUE** : TOUT doit être **mobile-first**, **full-width** et **parfaitement responsive** sur smartphone (320px-768px), tablette (768px-1024px) et desktop (1024px+).

### ⚠️ RÈGLES NON-NÉGOCIABLES

#### 1. MOBILE-FIRST OBLIGATOIRE
- **TOUJOURS** coder d'abord pour mobile (320px-375px)
- **TOUJOURS** utiliser des classes sans breakpoint pour mobile
- **TOUJOURS** ajouter breakpoints `sm:`, `md:`, `lg:` progressivement
- **JAMAIS** de `hidden` sur mobile sans alternative

#### 2. FULL-WIDTH PAR DÉFAUT
- **TOUS les composants** doivent occuper 100% de la largeur sur mobile
- **Container max-width** : Seulement sur desktop (lg:max-w-7xl)
- **Padding horizontal** : TOUJOURS `px-6` minimum sur mobile
- **Sections hero** : TOUJOURS `w-full h-screen` (pas de padding latéral sur hero)

#### 3. IMAGES RESPONSIVE
- **TOUJOURS** `w-full h-auto` ou `w-full h-[fixed]`
- **TOUJOURS** `object-cover` pour maintenir ratio
- **JAMAIS** de tailles fixes en pixels
- **TOUJOURS** tester sur iPhone SE (375px) et iPhone 12 Pro (390px)

#### 4. TYPOGRAPHY RESPONSIVE OBLIGATOIRE
- **Titres** : TOUJOURS 5 breakpoints minimum
- **Corps** : Au moins 3 breakpoints (base, md:, lg:)
- **Jamais** de text-9xl sur mobile (max text-5xl)

#### 5. GRIDS & LAYOUTS
- **Mobile** : TOUJOURS `grid-cols-1` ou `flex-col`
- **Tablette** : `md:grid-cols-2` possible
- **Desktop** : `lg:grid-cols-3` ou `lg:grid-cols-4` maximum
- **Gaps** : Progressifs (gap-4, md:gap-6, lg:gap-8)

### Breakpoints Tailwind

| Breakpoint | Taille | Device | Usage Prioritaire |
|------------|--------|--------|-------------------|
| (none) | 0-639px | **Mobile** | **BASE - TOUJOURS définir** |
| `sm:` | 640px+ | Mobile landscape | Petits ajustements |
| `md:` | 768px+ | **Tablette** | **Layout changes** |
| `lg:` | 1024px+ | **Desktop** | **Multi-colonnes** |
| `xl:` | 1280px+ | Large desktop | Spacieux |
| `2xl:` | 1536px+ | Extra large | Max-width containers |

### 📐 PATTERNS FULL-WIDTH OBLIGATOIRES

#### Hero Section (TOUJOURS Full-Width)
```tsx
// ✅ CORRECT - Full width sur tous devices
<section className="
  relative w-full h-screen
  px-6 py-12
  md:px-8 md:py-16
  lg:px-12 lg:py-24
">
  <div className="
    max-w-7xl mx-auto
    text-center
  ">
    {/* Content centré avec max-width */}
  </div>
</section>

// ❌ INCORRECT - Pas de w-full
<section className="h-screen">
```

#### Container Pattern (Desktop Max-Width)
```tsx
// ✅ CORRECT - Full width mobile, max-width desktop
<div className="
  w-full px-6
  lg:max-w-7xl lg:mx-auto lg:px-12
">
  {/* Content */}
</div>

// ❌ INCORRECT - Max-width sur mobile
<div className="max-w-7xl mx-auto">
```

#### Typography Responsive COMPLÈTE
```tsx
// ✅ CORRECT - 5 breakpoints, lisible sur tous devices
<h1 className="
  text-4xl      /* Mobile (base) */
  sm:text-5xl   /* Mobile landscape */
  md:text-6xl   /* Tablette */
  lg:text-7xl   /* Desktop */
  xl:text-8xl   /* Large desktop */
  font-light tracking-tight leading-tight
">

// ❌ INCORRECT - Trop gros sur mobile
<h1 className="text-9xl">
```

#### Padding Responsive PROGRESSIF
```tsx
// ✅ CORRECT - Progressif et proportionnel
<section className="
  py-12 px-6    /* Mobile: compact */
  md:py-16 md:px-8    /* Tablette: moyen */
  lg:py-24 lg:px-12   /* Desktop: généreux */
">

// ❌ INCORRECT - Identique partout
<section className="py-24 px-12">
```

#### Grid Responsive OBLIGATOIRE
```tsx
// ✅ CORRECT - Progressive enhancement
<div className="
  grid grid-cols-1 gap-4          /* Mobile: 1 col */
  md:grid-cols-2 md:gap-6         /* Tablette: 2 cols */
  lg:grid-cols-3 lg:gap-8         /* Desktop: 3 cols */
">

// ❌ INCORRECT - Forcé 3 colonnes partout
<div className="grid grid-cols-3 gap-8">
```

#### Images Responsive PARFAITES
```tsx
// ✅ CORRECT - Responsive et optimisé
<div className="
  relative w-full
  h-64          /* Mobile: 256px */
  md:h-80       /* Tablette: 320px */
  lg:h-96       /* Desktop: 384px */
  overflow-hidden rounded-xl
">
  <img
    src={url}
    alt="Description"
    className="w-full h-full object-cover"
  />
</div>

// ❌ INCORRECT - Hauteur fixe non responsive
<img src={url} className="h-96" />
```

#### Flex Direction Responsive
```tsx
// ✅ CORRECT - Colonne mobile, ligne desktop
<div className="
  flex flex-col gap-4           /* Mobile: vertical */
  md:flex-row md:gap-6         /* Tablette+: horizontal */
  lg:gap-8
">

// ❌ INCORRECT - Toujours horizontal
<div className="flex flex-row gap-8">
```

#### Buttons & CTAs Responsive
```tsx
// ✅ CORRECT - Full width mobile, auto desktop
<button className="
  w-full px-6 py-3 text-base      /* Mobile: full width */
  md:w-auto md:px-8 md:py-4      /* Desktop: auto width */
  rounded-full font-medium
">

// ❌ INCORRECT - Pas responsive
<button className="px-8 py-4">
```

### 📱 TESTS OBLIGATOIRES

#### Devices à Tester Systématiquement

| Device | Width | Notes |
|--------|-------|-------|
| **iPhone SE** | 375px | Minimum absolu |
| **iPhone 12/13/14** | 390px | Standard iOS |
| **iPhone 14 Pro Max** | 430px | Large iOS |
| **Samsung Galaxy S21** | 360px | Standard Android |
| **iPad Mini** | 768px | Tablette portrait |
| **iPad Pro** | 1024px | Tablette landscape |
| **MacBook Air** | 1280px | Desktop standard |
| **iMac 27"** | 2560px | Large desktop |

#### Chrome DevTools Breakpoints Custom
```
320px  - Minimum (petits Android)
375px  - iPhone SE
390px  - iPhone 12+
768px  - iPad portrait
1024px - iPad landscape
1280px - Desktop
1920px - Full HD
```

### 🚫 ERREURS COURANTES À ÉVITER

#### ❌ Ce qu'il NE FAUT JAMAIS faire :

1. **Fixed Width sans Responsive**
```tsx
// ❌ MAUVAIS
<div className="w-[1200px]">
```

2. **Text trop grand sur Mobile**
```tsx
// ❌ MAUVAIS - Illisible sur mobile
<h1 className="text-9xl">
```

3. **Padding trop grand sur Mobile**
```tsx
// ❌ MAUVAIS - Gaspille l'espace
<section className="py-24 px-12">
```

4. **Grid multi-colonnes sur Mobile**
```tsx
// ❌ MAUVAIS - Colonnes trop étroites
<div className="grid grid-cols-3">
```

5. **Hidden sans Alternative**
```tsx
// ❌ MAUVAIS - Contenu perdu sur mobile
<div className="hidden lg:block">
  Important content
</div>
```

6. **Absolute Positioning sans Responsive**
```tsx
// ❌ MAUVAIS - Déborde sur mobile
<div className="absolute right-12 top-12">
```

#### ✅ Solutions Correctes :

1. **Max-Width avec Full Width Mobile**
```tsx
// ✅ BON
<div className="w-full lg:max-w-7xl lg:mx-auto">
```

2. **Typography Progressive**
```tsx
// ✅ BON
<h1 className="text-4xl md:text-6xl lg:text-8xl">
```

3. **Padding Progressif**
```tsx
// ✅ BON
<section className="py-12 px-6 md:py-16 lg:py-24">
```

4. **Grid Responsive**
```tsx
// ✅ BON
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

5. **Conditional Rendering avec Alternative**
```tsx
// ✅ BON - Menu burger mobile, full menu desktop
<div className="lg:hidden">
  <MobileMenu />
</div>
<div className="hidden lg:block">
  <DesktopMenu />
</div>
```

### 📋 CHECKLIST RESPONSIVE OBLIGATOIRE

Avant chaque commit, vérifier :

- [ ] **Testé sur iPhone SE (375px)** - Plus petit device commun
- [ ] **Texte lisible** sur 320px minimum
- [ ] **Images responsive** avec w-full et object-cover
- [ ] **Pas de débordement horizontal** (overflow-x)
- [ ] **Padding adapté** par breakpoint (px-6, md:px-8, lg:px-12)
- [ ] **Typography scalable** (5 breakpoints pour H1)
- [ ] **Grids en 1 colonne** sur mobile
- [ ] **Buttons full-width** sur mobile si nécessaire
- [ ] **Pas de fixed width** sans max-width responsive
- [ ] **Navigation mobile** fonctionnelle (burger menu)
- [ ] **Touch targets** 44x44px minimum
- [ ] **Scroll performance** fluide sur mobile
- [ ] **Animations performantes** (60fps sur mobile)

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

## 📋 CHECKLIST DESIGN COMPLÈTE

### Avant de Déployer un Composant

#### Design & Typography
- [ ] Police **Inter** utilisée partout (font-light pour titres, font-medium pour corps)
- [ ] Palette limitée (**gray + primary** + 1 accent max, **jamais de bleu/violet criard**)
- [ ] Typography **5 breakpoints minimum** pour H1 (text-4xl, sm:, md:, lg:, xl:)
- [ ] Espacement cohérent (**système 4px** : gap-4, md:gap-6, lg:gap-8)
- [ ] Transitions sur hover (**200-300ms** avec easing `[0.16, 1, 0.3, 1]`)

#### Responsive & Mobile-First
- [ ] **Testé sur iPhone SE (375px)** - Plus petit device commun
- [ ] **Full-width sur mobile** (`w-full` par défaut, `lg:max-w-7xl` sur desktop)
- [ ] **Grids en 1 colonne mobile** (`grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`)
- [ ] **Padding progressif** (`px-6`, `md:px-8`, `lg:px-12`)
- [ ] **Typography scalable** (base, sm:, md:, lg:, xl:)
- [ ] **Images responsive** (`w-full h-auto` ou `w-full h-[fixed]` avec `object-cover`)
- [ ] **Buttons full-width mobile** si CTAs principales
- [ ] **Pas de débordement horizontal** (overflow-x vérifié)

#### Animations Framer Motion
- [ ] **Fade In au scroll** sur sections principales (`whileInView`)
- [ ] **Stagger animations** sur grilles/listes (`staggerContainer`)
- [ ] **Image zoom au hover** (`whileHover={{ scale: 1.05-1.1 }}`)
- [ ] **Smooth transitions** (duration 0.6-0.8s)
- [ ] **Parallax hero** si page avec hero fullscreen
- [ ] **Animations performantes** 60fps sur mobile (`viewport={{ once: true }}`)

#### Accessibilité
- [ ] **Contrastes WCAG AA** validés (gray-900 sur white = 16:1)
- [ ] **Focus states visibles** (`focus:ring-2 focus:ring-primary/20`)
- [ ] **Alt text** sur toutes les images
- [ ] **Touch targets** 44x44px minimum sur mobile
- [ ] **Keyboard navigation** fonctionnelle

#### Cohérence
- [ ] **Cohérent avec composants existants** (même style, même patterns)
- [ ] **Framer Motion** importé de `@/lib/animations` si presets utilisés
- [ ] **Pas de code dupliqué** (composants réutilisables créés)

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
