# ENKI REALTY - BRAND BOOK & DESIGN SYSTEM
## Page d'Accueil - Version Actuelle (2025)

---

## 🎨 PALETTE DE COULEURS

### Couleurs Primaires
```
Bleu Principal: HSL(200, 100%, 45%) - #0090E6
Bleu Hover: HSL(200, 100%, 40%) - #007ACC
Blanc Pur: HSL(0, 0%, 99%) - #FCFCFC
Texte Principal: HSL(215, 25%, 27%) - #485563
```

### Couleurs Secondaires
```
Gris Clair: HSL(210, 20%, 96%) - #F4F6F8
Gris Moyen: HSL(210, 15%, 97%) - #F7F8FA
Gris Texte: HSL(215, 15%, 45%) - #6B7684
Accent: HSL(200, 30%, 95%) - #F0F7FD
```

### Couleurs de Status
```
Succès: HSL(142, 75%, 45%) - #20B256
Erreur: HSL(0, 85%, 60%) - #E53E3E
Bordures: HSL(210, 20%, 90%) - #E2E8F0
Ring/Focus: HSL(200, 100%, 45%) - #0090E6
```

### Mode Sombre
```
Arrière-plan: HSL(215, 30%, 8%) - #0F1419
Texte: HSL(210, 15%, 92%) - #E8EAED
Carte: HSL(215, 25%, 10%) - #141B22
Primaire: HSL(200, 100%, 55%) - #1BA1F2
```

---

## 🎭 GRADIENTS SIGNATURE

### Gradient Héro
```
linear-gradient(135deg, HSL(200, 100%, 45%) 0%, HSL(190, 85%, 50%) 100%)
```

### Gradient Carte
```
linear-gradient(145deg, HSL(0, 0%, 100%) 0%, HSL(210, 15%, 98%) 100%)
```

### Gradient Premium
```
linear-gradient(135deg, HSL(200, 100%, 45%) 0%, HSL(210, 85%, 40%) 50%, HSL(190, 80%, 45%) 100%)
```

---

## ✍️ TYPOGRAPHIE SYSTÈME "SWAARG"

### Police Principale
```
Font-Family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Font-Features: "cv05", "cv11", "ss01"
Font-Variation: "opsz" 14
Line-Height: 1.6
Letter-Spacing: -0.01em
```

### Hiérarchie Typographique
```
1. Hero Title: 6xl-8xl, font-light, tracking-tight, -0.02em
2. Hero Subtitle: lg-2xl, font-normal, leading-relaxed, -0.005em
3. Section Title: 5xl-7xl, font-light, tracking-tight, -0.015em
4. Large Title: 4xl-6xl, font-light, tracking-tight, -0.015em
5. Card Title: 2xl-3xl, font-medium, tracking-tight, -0.01em
6. Body Large: lg-xl, font-normal, leading-relaxed, -0.005em
7. Body: base, font-normal, leading-relaxed, -0.003em
8. Button: base, font-medium, tracking-normal
9. Navigation: base, font-medium
```

---

## 🏗️ COMPOSANTS DE LA PAGE D'ACCUEIL

### 1. SECTION HÉRO
**Structure:**
- Hauteur: 100vh
- Background: Image parallax (cyprus-hero.jpg) + gradient overlay
- Animation: Framer Motion avec révélation progressive

**Éléments visuels:**
- Titre principal animé avec reveal
- Sous-titre avec animation décalée
- Statistiques en cartes flottantes
- Boutons CTA avec variants premium
- Formulaire de recherche agentique
- Indicateur de scroll personnalisé

**Indicateur de Scroll:**
```
Conteneur: w-7 h-11, border-2 border-white/70, rounded-full
Point: w-1.5 h-1.5, bg-white, rounded-full, mt-1.5
Animation: translateY [0, 6, 0] + opacity [1, 0.4, 1]
Durée: 2s, repeat: Infinity, easeInOut
```

### 2. CARROUSEL 3D AVANCÉ
**Caractéristiques:**
- Hauteur: 80vh
- Background: Dégradé dynamique + Canvas 3D
- Physique: react-spring + use-gesture
- Parallax: Framer Motion

**Structure des cartes:**
```
Conteneur: max-w-7xl, h-[70vh], shadow-2xl
Background: gradient from-background/95 to-background/85
Backdrop: blur-xl, border border-white/20
Layout: flex-col lg:flex-row
```

**Image (2/3):**
- Parallax hover: scale(1.05)
- Overlay: gradient from-black/70 to-transparent
- Info flottante: bottom-8 left-8

**Sidebar Intérêts (1/3):**
- Background: gradient backdrop-blur-xl
- Border: border-l border-white/10
- Animation: stagger des éléments

### 3. BOUTONS SYSTÈME

**Bouton Premium:**
```css
.btn-premium {
  background: gradient from-primary to-primary-hover
  color: primary-foreground
  padding: px-8 py-3
  border-radius: rounded-lg
  font-weight: font-semibold
  shadow: shadow-lg hover:shadow-premium
  transform: hover:scale-105
  transition: all 300ms
}
```

**Bouton Outline Premium:**
```css
.btn-outline-premium {
  border: 2px border-primary
  color: primary
  background: transparent
  padding: px-8 py-3
  border-radius: rounded-lg
  font-weight: font-semibold
  hover: bg-primary + text-primary-foreground
  transition: all 300ms
}
```

---

## 🎯 ANIMATIONS SIGNATURE

### 1. Animations d'Entrée
```
fade-in: opacity 0→1 + translateY 10px→0 (300ms ease-out)
scale-in: scale 0.95→1 + opacity 0→1 (200ms ease-out)
slide-in-right: translateX 100%→0 (300ms ease-out)
```

### 2. Animations Hover
```
hover-scale: scale 1→1.05 (200ms)
card-hover: shadow-lg + translateY -4px (300ms)
button-hover: scale 1→1.05 + shadow-premium (300ms)
```

### 3. Animations de Révélation Textuelle
- Utilise la librairie Framer Motion
- Révélation caractère par caractère
- Timing: delay progressif + spring animation
- Easing: easeOut avec bounce subtil

---

## 🖼️ IMAGES & ASSETS

### Image Héro
```
Fichier: cyprus-hero.jpg
Traitement: Parallax scroll
Overlay: Gradient linéaire noir/transparent
Position: center/cover
```

### Images Propriétés
```
Fallback: picsum.photos/1200x800
Traitement: lazy loading
Hover: scale(1.05) + transition 400ms
Overlay: gradient from-black/70 via-black/20 to-transparent
```

---

## 🔧 OMBRES & EFFETS

### Système d'Ombres
```
shadow-sm: 0 2px 4px HSL(215, 25%, 27%, 0.05)
shadow-md: 0 4px 12px HSL(215, 25%, 27%, 0.08)
shadow-lg: 0 8px 25px HSL(215, 25%, 27%, 0.12)
shadow-premium: 0 12px 40px HSL(200, 100%, 45%, 0.15)
```

### Effets de Verre
```
backdrop-blur-sm: 4px
backdrop-blur-xl: 24px
background: white/10 à white/30
border: white/20
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```
sm: 640px (mobile)
md: 768px (tablette)
lg: 1024px (desktop)
xl: 1280px (large desktop)
2xl: 1536px (extra large)
```

### Adaptations Clés
- Hero: text 6xl→8xl selon breakpoint
- Carrousel: flex-col→flex-row à lg
- Padding: responsive avec container queries
- Images: aspect-ratio adaptatif

---

## 🎮 INTERACTIONS

### Micro-Interactions
1. **Boutons:** Scale + shadow au hover
2. **Cartes:** Lift + shadow (translateY -4px)
3. **Icônes:** Rotation + scale sur hover
4. **Links:** Underline animé (scale-x 0→1)
5. **Inputs:** Border color + ring focus

### Gestes Tactiles
- Carrousel: Swipe horizontal
- Images: Pinch-to-zoom
- Scroll: Momentum + elastic

---

## 🌟 ÉLÉMENTS SPÉCIAUX

### Canvas 3D (Three.js)
```
Position: absolute inset-0
Opacity: 0.3
Camera: [0, 0, 5]
Lights: ambient(0.4) + point[10,10,10]
Geometrie: Sphere avec MeshDistortMaterial
Couleur: #1E3A8A, distort: 0.3, speed: 1.5
Controls: OrbitControls (autoRotate: 0.5)
```

### Particules & Effects
- Floating elements avec react-spring
- Auto-rotation continue
- Parallax multicouche
- Motion blur sur déplacement

---

## 📋 CHECKLIST QUALITÉ

### Performance
- [x] Lazy loading images
- [x] Code splitting composants
- [x] Animations GPU-accelerated
- [x] Debounce sur interactions

### Accessibilité
- [x] Contrast ratio > 4.5:1
- [x] Focus visible sur tous éléments
- [x] Alt text sur images
- [x] Aria labels appropriés

### SEO
- [x] Semantic HTML structure
- [x] Meta descriptions
- [x] Schema.org markup
- [x] Performance optimizations

---

**Version:** 2025.01
**Dernière mise à jour:** 2025-01-27
**Responsable Design:** ENKI REALTY Team