# ENKI REALTY - DESIGN SYSTEM COMPLET 2025

**Version:** 2.0 - Complet & Définitif  
**Date:** Janvier 2025  
**Base:** Pages Projects.tsx, ModernMenu.tsx, ProjectPage.tsx  
**Philosophie:** Minimalisme noir & blanc, Élégance méditerranéenne, Framer Motion exclusif

---

## 🚫 RÈGLES ABSOLUES - INTERDICTIONS

1. **❌ AUCUN EMOJI** - Uniquement Lucide React Icons
2. **❌ AUCUNE COULEUR DIRECTE** - Toujours via tokens (bg-primary, text-black/60, etc.)
3. **❌ AUCUNE ANIMATION CSS** - Framer Motion exclusivement
4. **❌ AUCUN bg-blue-500, bg-yellow-500, etc.** - Tokens sémantiques uniquement
5. **❌ AUCUN inline style** - Sauf Framer Motion transforms (style={{ y, opacity }})

---

## 🎨 PALETTE DE COULEURS - MINIMALISME NOIR & BLANC

### Couleur Dominante : NOIR
```tsx
// Noir pur
className="bg-black"              // Fond noir pur
className="text-black"            // Texte noir pur

// Noir avec opacités (textes)
className="text-black/80"         // Texte noir 80% - Titres secondaires
className="text-black/70"         // Texte noir 70% - Corps de texte
className="text-black/60"         // Texte noir 60% - Métadonnées
className="text-black/40"         // Texte noir 40% - Labels discrets
className="text-black/20"         // Texte noir 20% - Placeholders

// Noir avec opacités (fonds & bordures)
className="bg-black/5"            // Fond très léger - Placeholders images
className="bg-black/10"           // Fond léger - Séparateurs visuels
className="border-black/10"       // Bordure légère - Cards, séparateurs
className="border-black/20"       // Bordure moyenne - Inputs
className="border-black/30"       // Bordure visible - Hover states
```

### Couleur Contraste : BLANC
```tsx
// Blanc pur
className="bg-white"              // Fond blanc - Cards, sections
className="text-white"            // Texte blanc - Sur fond noir

// Blanc avec opacités (sur fond noir)
className="text-white/90"         // Texte blanc 90% - Corps sur noir
className="text-white/80"         // Texte blanc 80% - KPIs
className="text-white/60"         // Texte blanc 60% - Métadonnées sur noir
className="bg-white/10"           // Fond blanc 10% - Glass effect buttons
className="bg-white/20"           // Fond blanc 20% - Glass cards
className="border-white/20"       // Bordure blanche 20% - Glass borders
```

### Fond Alternatif : NEUTRAL-50
```tsx
className="bg-neutral-50"         // #FAFAFA - Fond sections alternées
```

### SEULE Couleur Accent : GOLDEN VISA
```tsx
// Badge Golden Visa uniquement
className="bg-yellow-500 text-black"  // ⚠️ Exception unique pour Golden Visa
// À REMPLACER PAR: bg-golden-visa text-golden-visa-foreground (futur)
```

---

## 🔤 TYPOGRAPHIE - SYSTÈME SWAARG (INTER FONT)

### Classes Swaarg Disponibles

```tsx
// HERO
className="swaarg-hero-title"           
// → text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight
// Usage: Titre principal hero

className="swaarg-hero-subtitle"        
// → text-xl md:text-2xl font-light leading-relaxed
// Usage: Sous-titre hero

// SECTIONS
className="swaarg-section-title"        
// → text-4xl md:text-5xl font-light tracking-tight
// Usage: Titres de sections principales

className="swaarg-subtitle"             
// → text-lg font-light max-w-3xl
// Usage: Sous-titres de sections

// CARDS
className="swaarg-card-title"           
// → text-2xl md:text-3xl font-light tracking-tight
// Usage: Titres de cards projets

className="swaarg-body"                 
// → text-base font-light leading-relaxed
// Usage: Descriptions, corps de texte

className="swaarg-body-large"           
// → text-lg md:text-xl font-light leading-relaxed
// Usage: Lead paragraphs
```

### Styles Typographiques Manuels (si nécessaire)

```tsx
// Titres standards
className="text-3xl md:text-4xl font-light text-black mb-4 tracking-tight"
className="text-2xl font-light text-black mb-2 line-clamp-1"

// Corps de texte
className="text-lg text-black/60 font-light"
className="text-base text-black/60 font-light leading-relaxed"
className="text-sm font-light"

// Métadonnées / Labels
className="text-xs text-black/40 uppercase tracking-wider"
className="text-xs uppercase tracking-wider text-white/60"

// Prix
className="text-4xl font-light text-black"
className="text-2xl font-light text-black"
```

---

## 🎯 BOUTONS - STYLES STANDARDS

### Bouton Primary (Noir sur blanc)
```tsx
<Button
  size="lg"
  className="bg-black text-white hover:bg-black/90 px-8 py-6 text-sm uppercase tracking-wider font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
>
  Découvrir
</Button>
```

### Bouton Secondary (Blanc sur noir)
```tsx
<Button
  size="lg"
  className="bg-white text-black hover:bg-white/90 px-8 py-6 text-sm uppercase tracking-wider font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
>
  Explorer
</Button>
```

### Bouton Outline (Transparent avec bordure)
```tsx
<Button
  size="lg"
  variant="outline"
  className="border-2 border-white text-white hover:bg-white hover:text-black backdrop-blur-md bg-white/10 px-8 py-6 text-sm uppercase tracking-wider font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
>
  Télécharger
</Button>
```

### Bouton Link (Texte simple)
```tsx
<Link
  to="/projects/villa-123"
  className="text-sm font-medium text-black hover:underline uppercase tracking-wider"
>
  Découvrir
</Link>
```

### Propriétés communes des boutons
- **Padding**: `px-8 py-6` (large), `px-6 py-3` (medium), `px-3 py-1.5` (small)
- **Text**: `text-sm uppercase tracking-wider font-medium`
- **Focus**: `focus-visible:outline-none focus-visible:ring-2`
- **Transitions**: Utiliser `transition-colors duration-200` ou Framer Motion

---

## 🃏 CARDS - PROJECT CARD STANDARD

### Structure Complète
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="group bg-white border border-black/10 overflow-hidden hover:border-black/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
>
  {/* IMAGE */}
  <div className="relative h-64 bg-black/5 overflow-hidden">
    <img
      src={image}
      alt={title}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    
    {/* Badges */}
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      <Badge className="bg-yellow-500 text-black border-0 text-xs px-3 py-1 font-medium">
        Golden Visa
      </Badge>
      <Badge className="bg-black text-white border-0">
        Villa
      </Badge>
    </div>
  </div>

  {/* CONTENT */}
  <div className="p-6">
    {/* Title */}
    <h3 className="text-2xl font-light text-black mb-2 line-clamp-1">
      {title}
    </h3>

    {/* Location */}
    <div className="flex items-center gap-2 text-black/60 mb-3">
      <MapPin className="w-4 h-4" />
      <span className="text-sm font-light">{location}</span>
    </div>

    {/* Description */}
    <p className="text-black/60 font-light text-sm mb-4 line-clamp-2">
      {description}
    </p>

    {/* Price & CTA */}
    <div className="flex items-center justify-between pt-4 border-t border-black/10">
      <div>
        <p className="text-xs text-black/40 uppercase tracking-wider mb-1">
          À partir de
        </p>
        <p className="text-2xl font-light text-black">
          €{price.toLocaleString()}
        </p>
      </div>
      <Link
        to={`/projects/${slug}`}
        className="text-sm font-medium text-black hover:underline uppercase tracking-wider"
      >
        Découvrir
      </Link>
    </div>
  </div>
</motion.div>
```

### Card Simple (Benefit, Feature)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
  className="bg-white p-8 border border-black/10"
>
  {/* Icon */}
  <Building2 className="w-10 h-10 text-black mb-4" />
  
  {/* Title */}
  <h3 className="text-2xl font-light text-black mb-4 tracking-tight">
    {title}
  </h3>
  
  {/* Description */}
  <p className="text-base text-black/60 font-light leading-relaxed mb-4">
    {description}
  </p>
  
  {/* Badge optionnel */}
  <div className="pt-4 border-t border-black/10">
    <Badge variant="outline" className="bg-black/5 text-black border-0 px-3 py-1 text-xs">
      {highlight}
    </Badge>
  </div>
</motion.div>
```

### Card Testimonial
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
  className="bg-neutral-50 p-8 border border-black/10"
>
  {/* Stars */}
  <div className="flex gap-1 mb-4">
    {[...Array(5)].map((_, i) => (
      <span key={i} className="text-black text-lg">★</span>
    ))}
  </div>

  {/* Quote */}
  <p className="text-base text-black/70 font-light leading-relaxed mb-6 italic">
    "{quote}"
  </p>

  {/* Author */}
  <div className="pt-6 border-t border-black/10">
    <p className="text-sm font-medium text-black mb-1">
      {name}
    </p>
    <p className="text-xs text-black/40 uppercase tracking-wider">
      {nationality} · {propertyType}
    </p>
  </div>
</motion.div>
```

---

## 🏷️ BADGES

### Badge Noir (Défaut)
```tsx
<Badge className="bg-black text-white border-0 text-xs px-4 py-2">
  Projet Vedette
</Badge>
```

### Badge Golden Visa
```tsx
<Badge className="bg-yellow-500 text-black border-0 text-xs px-3 py-1 font-medium">
  Golden Visa
</Badge>
```

### Badge Outline Subtle
```tsx
<Badge variant="outline" className="bg-black/5 text-black border-0 px-3 py-1 text-xs">
  12,5% IS
</Badge>
```

### Badge sur Fond Noir
```tsx
<Badge className="bg-white/10 border border-white/20 text-white backdrop-blur-md px-6 py-2">
  Chypre, Méditerranée
</Badge>
```

---

## 📐 LAYOUTS - STRUCTURES STANDARDS

### Hero Section Full Screen
```tsx
<section className="relative h-screen overflow-hidden">
  {/* Parallax Background */}
  <motion.div
    style={{ y: heroParallaxY }}
    className="absolute inset-0 w-full h-full"
  >
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center scale-110"
      style={{ backgroundImage: `url(${image})` }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
  </motion.div>

  {/* Content */}
  <motion.div
    style={{ opacity: heroOpacity }}
    className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center"
  >
    {/* Location Badge */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="inline-flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-6 py-2 mb-6"
    >
      <MapPin className="w-4 h-4 text-white" />
      <span className="text-white font-medium">Chypre, Méditerranée</span>
    </motion.div>

    {/* Title */}
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 max-w-4xl tracking-tight leading-tight"
    >
      {title}
    </motion.h1>

    {/* Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl font-light leading-relaxed"
    >
      {subtitle}
    </motion.p>

    {/* CTAs */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="flex flex-wrap gap-4 justify-center"
    >
      {/* Buttons here */}
    </motion.div>
  </motion.div>

  {/* Scroll Indicator */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 1.5 }}
    className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
  >
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
    >
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-1 h-2 bg-white rounded-full"
      />
    </motion.div>
  </motion.div>
</section>
```

### Section avec Titre Centré
```tsx
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    {/* Header */}
    <div className="text-center mb-16">
      <div className="h-[1px] w-20 bg-black mb-6 mx-auto" />
      <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight mb-4">
        {title}
      </h2>
      <p className="text-lg text-black/60 font-light">
        {subtitle}
      </p>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        // Card component
      ))}
    </div>
  </div>
</section>
```

### Section Alternée (Fond Neutral)
```tsx
<section className="py-24 bg-neutral-50">
  {/* Same structure as above */}
</section>
```

### CTA Section (Fond Noir)
```tsx
<section className="relative py-32 bg-black text-white overflow-hidden">
  <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight"
    >
      {title}
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-xl md:text-2xl text-white/90 mb-12 font-light"
    >
      {description}
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap gap-4 justify-center"
    >
      {/* CTAs */}
    </motion.div>
  </div>
</section>
```

---

## 🎬 ANIMATIONS FRAMER MOTION - PATTERNS

### Pattern 1: Fade In Up (Standard)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {children}
</motion.div>
```

### Pattern 2: Stagger avec Delay
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
>
  {children}
</motion.div>
```

### Pattern 3: Parallax Scroll
```tsx
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, 150]);
const opacity = useTransform(scrollY, [0, 300], [1, 0]);

<motion.div style={{ y, opacity }}>
  {children}
</motion.div>
```

### Pattern 4: Scale on Appear
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
>
  {children}
</motion.div>
```

### Pattern 5: Hover Scale (Cards)
```tsx
// Sur le parent
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="group"
>
  {/* Sur l'image */}
  <img className="group-hover:scale-105 transition-transform duration-500" />
</motion.div>
```

---

## 🔄 ICONS LUCIDE REACT - MAPPING

### Icons Standards
```tsx
import {
  Building2,      // Architecture, propriétés
  MapPin,         // Localisation
  TrendingUp,     // Rendements, croissance
  Euro,           // Prix, finance
  Sun,            // Climat, soleil
  Plane,          // Voyage, accessibilité
  GraduationCap,  // Éducation, écoles
  Award,          // Excellence, Golden Visa
  Star,           // Premium, favori
  Home,           // Maison, résidence
  Shield,         // Sécurité, garantie
  Calendar,       // Date, livraison
  ArrowRight,     // Navigation, CTA
} from 'lucide-react';
```

### Utilisation
```tsx
// ❌ INCORRECT
<div className="text-4xl mb-4">🏛️</div>

// ✅ CORRECT
<Building2 className="w-10 h-10 text-black mb-4" />

// Avec couleur custom
<MapPin className="w-4 h-4 text-black/60" />

// Tailles standards
className="w-4 h-4"    // Small (16px)
className="w-5 h-5"    // Medium (20px)
className="w-8 h-8"    // Large (32px)
className="w-10 h-10"  // XL (40px)
```

---

## 📏 SPACING SYSTEM

### Padding Standards
```tsx
// Cards
className="p-6"         // Standard card
className="p-8"         // Large card

// Sections
className="py-24"       // Section vertical (desktop)
className="py-16"       // Section vertical (mobile)
className="px-6"        // Section horizontal
className="px-4"        // Mobile horizontal

// Buttons
className="px-8 py-6"   // Large button
className="px-6 py-3"   // Medium button
className="px-3 py-1"   // Small badge
```

### Gaps & Spacing
```tsx
// Grids
className="gap-8"       // Standard grid
className="gap-6"       // Compact grid
className="gap-4"       // Tight grid
className="gap-2"       // Badges, inline elements

// Flex
className="flex gap-4"  // CTAs
className="flex gap-2"  // Icon + text
```

### Margins
```tsx
className="mb-16"       // Section spacing
className="mb-12"       // Large element spacing
className="mb-8"        // Medium spacing
className="mb-6"        // Standard spacing
className="mb-4"        // Small spacing
className="mb-2"        // Tight spacing
```

---

## 🎨 BORDERS & SHADOWS

### Borders
```tsx
// Standard
className="border border-black/10"        // Default card border
className="border border-black/20"        // Input border
className="border-2 border-white"         // Outline button

// Hover
className="hover:border-black/30"         // Card hover

// Separators
className="border-t border-black/10"      // Top separator
className="h-[1px] w-20 bg-black"         // Decorative line
```

### Shadows
```tsx
className="shadow-sm"                     // Subtle shadow
className="shadow-lg"                     // Card shadow
className="hover:shadow-lg"               // Hover shadow
```

---

## 🎭 TRANSITIONS

### Durées Standards
```tsx
className="transition-all duration-300"    // Cards, complex
className="transition-colors duration-200" // Buttons, links
className="transition-transform duration-500" // Images
```

### Avec Framer Motion
```tsx
transition={{ duration: 0.6 }}            // Standard
transition={{ duration: 0.8 }}            // Slow, smooth
transition={{ duration: 0.3 }}            // Fast
```

### Easing Framer Motion
```tsx
ease: [0.16, 1, 0.3, 1]                   // Easing naturel (default)
```

---

## ✅ CHECKLIST VALIDATION

### Avant chaque composant
- [ ] Pas d'emojis (Lucide React uniquement)
- [ ] Couleurs via classes (text-black/60, bg-white, etc.)
- [ ] Animations Framer Motion uniquement
- [ ] Classes swaarg pour typographie
- [ ] Spacing cohérent (p-6, gap-8, mb-4)
- [ ] Transitions définies
- [ ] Hover states présents

### Performance
- [ ] `whileInView` avec `viewport={{ once: true }}`
- [ ] Images avec `loading="lazy"` (sauf hero)
- [ ] `transition-transform duration-500` pour images

---

## 📚 RÉFÉRENCES

- **Page principale**: `src/pages/Projects.tsx`
- **Menu**: `src/components/layout/ModernMenu.tsx`
- **Page projet**: `src/app/(public)/projects/[slug]/page.tsx`
- **Animations**: `src/lib/animations.ts`

---

**Design System ENKI Realty - Version Complète**  
**Maintenu par l'équipe ENKI**  
**Dernière mise à jour:** Janvier 2025

Ce design system garantit une cohérence totale sur tout le site.
