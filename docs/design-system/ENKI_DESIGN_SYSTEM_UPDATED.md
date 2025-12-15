# ENKI REALTY DESIGN SYSTEM - VERSION MISE À JOUR 2025

**Date de mise à jour:** Janvier 2025  
**Base:** Pages Projects.tsx, ProjectPage, et ModernMenu  
**Philosophie:** Élégance méditerranéenne minimaliste, Framer Motion exclusif

---

## 🚫 RÈGLES ABSOLUES

### INTERDICTIONS STRICTES
1. **❌ AUCUN EMOJI** - Jamais d'emojis dans le code UI
2. **❌ AUCUNE COULEUR DIRECTE** - Toujours utiliser les tokens sémantiques
3. **❌ AUCUNE ANIMATION CSS** - Uniquement Framer Motion
4. **❌ AUCUN INLINE STYLE** - Sauf Framer Motion transforms

### OBLIGATIONS
1. **✅ FRAMER MOTION OBLIGATOIRE** - Pour toutes les animations
2. **✅ TOKENS HSL UNIQUEMENT** - Tous en format HSL
3. **✅ CLASSES SWAARG** - Pour toute la typographie
4. **✅ ICONS LUCIDE REACT** - Remplacer tous les emojis par des icons

---

## 🎨 PALETTE DE COULEURS (HSL STRICT)

### Couleurs Principales
```css
/* Primary - Cyprus Ocean Blue */
--primary: 199 63% 59%;
--primary-foreground: 0 0% 100%;
--primary-hover: 199 63% 55%;

/* Secondary - Light Cyprus Blue */
--secondary: 210 50% 88%;
--secondary-foreground: 0 0% 3.9%;

/* Cyprus Terra Cotta - Accents premium */
--cyprus-terra: 25 35% 55%;
--cyprus-terra-foreground: 0 0% 100%;

/* Golden Visa Badge - Premium Gold */
--golden-visa: 45 93% 47%;
--golden-visa-foreground: 0 0% 0%;
```

### Couleurs Sémantiques
```css
/* Status */
--success: 142 71% 45%;
--success-foreground: 0 0% 100%;

--destructive: 0 84.2% 60.2%;
--destructive-foreground: 0 0% 100%;

--warning: 38 92% 50%;
--warning-foreground: 0 0% 0%;

/* Neutral */
--muted: 30 50% 97%;
--muted-foreground: 25 15% 40%;

--accent: 30 50% 96%;
--accent-foreground: 25 25% 35%;
```

### Utilisation dans Tailwind
```tsx
// ✅ CORRECT
<Badge className="bg-golden-visa text-golden-visa-foreground">
  Golden Visa
</Badge>

<div className="bg-cyprus-terra text-cyprus-terra-foreground">
  Premium
</div>

// ❌ INCORRECT
<Badge className="bg-yellow-500 text-black">
  Golden Visa
</Badge>
```

---

## 🔤 TYPOGRAPHIE SWAARG (OBLIGATOIRE)

### Classes Disponibles

```css
.swaarg-hero-title        /* 6xl-8xl, extralight, -0.05em */
.swaarg-hero-subtitle     /* lg-xl, normal, -0.01em */
.swaarg-section-title     /* 5xl-7xl, light, -0.04em */
.swaarg-large-title       /* 4xl-6xl, light, -0.03em */
.swaarg-card-title        /* 2xl-3xl, normal, -0.02em */
.swaarg-body-large        /* lg-xl, normal, -0.01em */
.swaarg-body              /* base, normal, -0.01em */
.swaarg-button            /* base, medium, normal */
.swaarg-nav               /* base, medium */
.swaarg-subtitle          /* xl-2xl, light, -0.02em */
```

### Exemples d'Usage
```tsx
// Hero Section
<h1 className="swaarg-hero-title">
  Découvrez Notre Sélection
</h1>
<p className="swaarg-hero-subtitle">
  Des programmes neufs d'exception
</p>

// Section
<h2 className="swaarg-section-title">
  Pourquoi Investir à Chypre ?
</h2>
<p className="swaarg-subtitle">
  Un cadre fiscal avantageux
</p>

// Card
<h3 className="swaarg-card-title">
  Villa Mediterranean
</h3>
<p className="swaarg-body">
  Description de la propriété...
</p>
```

---

## 🎬 ANIMATIONS FRAMER MOTION

### Pattern 1: Fade In Up (Standard)
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {children}
</motion.div>
```

### Pattern 2: Stagger Children
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

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Pattern 3: Parallax Scroll
```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, 150]);
const opacity = useTransform(scrollY, [0, 300], [1, 0]);

<motion.div style={{ y, opacity }}>
  {children}
</motion.div>
```

### Pattern 4: Hover Scale (Cards)
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.3 }}
  className="group"
>
  <img className="group-hover:scale-105 transition-transform duration-500" />
</motion.div>
```

---

## 🎯 COMPOSANTS STANDARDISÉS

### Badge Golden Visa
```tsx
import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

<Badge className="bg-golden-visa text-golden-visa-foreground border-0 text-xs px-3 py-1 font-medium">
  <Award className="w-3 h-3 mr-1" />
  Golden Visa
</Badge>
```

### Badge Premium
```tsx
import { Star } from 'lucide-react';

<Badge className="bg-cyprus-terra text-cyprus-terra-foreground border-0 text-xs px-3 py-1 font-semibold">
  <Star className="w-3 h-3 mr-1" />
  Premium
</Badge>
```

### Project Card (Standard)
```tsx
import { motion } from 'framer-motion';
import { MapPin, Building2 } from 'lucide-react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="group bg-white border border-black/10 overflow-hidden hover:border-black/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
>
  {/* Image */}
  <div className="relative h-64 bg-black/5 overflow-hidden">
    <img 
      src={image} 
      alt={title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    
    {/* Badges */}
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      {isGoldenVisa && (
        <Badge className="bg-golden-visa text-golden-visa-foreground">
          <Award className="w-3 h-3 mr-1" />
          Golden Visa
        </Badge>
      )}
    </div>
  </div>

  {/* Content */}
  <div className="p-6">
    <h3 className="swaarg-card-title mb-2 line-clamp-1">
      {title}
    </h3>
    
    <div className="flex items-center gap-2 text-black/60 mb-3">
      <MapPin className="w-4 h-4" />
      <span className="text-sm font-light">{location}</span>
    </div>
    
    <p className="swaarg-body text-black/60 mb-4 line-clamp-2">
      {description}
    </p>
    
    <div className="flex items-center justify-between pt-4 border-t border-black/10">
      <div>
        <p className="text-xs text-black/40 uppercase tracking-wider mb-1">
          À partir de
        </p>
        <p className="text-2xl font-light text-black">
          €{price.toLocaleString()}
        </p>
      </div>
    </div>
  </div>
</motion.div>
```

### Button Premium
```tsx
<Button
  size="lg"
  className="bg-black text-white hover:bg-black/90 px-8 py-6 text-sm uppercase tracking-wider font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
>
  Découvrir
</Button>
```

---

## 📐 LAYOUT PATTERNS

### Hero Section (Standard)
```tsx
<section className="relative h-screen overflow-hidden">
  {/* Parallax Background */}
  <motion.div
    style={{ y: heroParallaxY }}
    className="absolute inset-0 w-full h-full"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
  </motion.div>

  {/* Content */}
  <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="swaarg-hero-title text-white"
    >
      {title}
    </motion.h1>
    
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="swaarg-hero-subtitle text-white/90"
    >
      {subtitle}
    </motion.p>
  </div>
</section>
```

### Section avec Grid
```tsx
<section className="py-24 bg-neutral-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <div className="h-[1px] w-20 bg-black mb-6 mx-auto" />
      <h2 className="swaarg-section-title mb-6">
        {title}
      </h2>
      <p className="swaarg-subtitle">
        {subtitle}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

---

## 🔄 ICONS LUCIDE REACT (REMPLACEMENT EMOJIS)

### Mapping Emojis → Icons
```tsx
import {
  Building2,      // 🏛️ Architecture
  TrendingUp,     // 📈 Rendements
  Euro,           // 💰 Finance
  Sun,            // ☀️ Soleil
  Plane,          // ✈️ Voyage
  GraduationCap,  // 🎓 Éducation
  Award,          // 🏆 Excellence
  Star,           // ⭐ Premium
  MapPin,         // 📍 Localisation
  Home,           // 🏠 Maison
  Shield,         // 🛡️ Sécurité
  Heart,          // ❤️ Favori
} from 'lucide-react';
```

### Utilisation
```tsx
// ❌ INCORRECT
<div className="text-4xl mb-4">🏛️</div>

// ✅ CORRECT
<Building2 className="w-10 h-10 text-primary mb-4" />
```

---

## ✅ CHECKLIST DE VALIDATION

### Avant chaque commit
- [ ] Aucun emoji dans le code
- [ ] Toutes les couleurs utilisent des tokens HSL
- [ ] Toutes les animations utilisent Framer Motion
- [ ] Toute la typographie utilise les classes swaarg
- [ ] Tous les icons sont Lucide React
- [ ] Pas de `bg-yellow-500`, `bg-blue-500`, etc.
- [ ] Pas de `text-white` sans token sémantique
- [ ] Framer Motion pour tous les mouvements

### Performance
- [ ] `whileInView` avec `viewport={{ once: true }}`
- [ ] Images avec `loading="lazy"` (sauf hero)
- [ ] Prefetch au hover des liens projets

---

## 📚 RÉFÉRENCES

- **Documentation complète**: `docs/ENKI_DESIGN_SYSTEM.md`
- **Page référence**: `src/pages/Projects.tsx`
- **Menu référence**: `src/components/layout/ModernMenu.tsx`
- **Animations**: `src/lib/animations.ts`

---

**Design System maintenu par l'équipe ENKI Realty**  
**Dernière mise à jour:** Janvier 2025
