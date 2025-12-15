# Guide complet : Layout Full-Width Responsive (Edge-to-Edge)

## Vue d'ensemble

Ce guide explique comment créer un layout full-width (full-bleed) responsive avec des sections qui s'étendent sur toute la largeur de l'écran, tout en maintenant le contenu dans des conteneurs centrés.

---

## 1. Principes fondamentaux

### Structure de base

```
┌─────────────────────────────────────┐
│  Full-Width Background Section      │
│  ┌───────────────────────────────┐  │
│  │  Centered Content Container   │  │
│  │  (max-width: 1200px)          │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Gutters responsifs recommandés

- **Mobile** : 16px (0.5rem à 1rem)
- **Tablet** : 24px (1.5rem)
- **Desktop** : 48px (3rem)
- **Large Desktop** : 64px-80px (4rem-5rem)

---

## 2. Implementation CSS Pure

### CSS Trick pour Full-Bleed

```css
/* Full-bleed container trick */
.full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

/* Alternative avec Grid */
.page-grid {
  display: grid;
  grid-template-columns:
    [full-start] minmax(1rem, 1fr)
    [content-start] minmax(0, 1200px) [content-end]
    minmax(1rem, 1fr) [full-end];
}

.full-width {
  grid-column: full-start / full-end;
}

.contained {
  grid-column: content-start / content-end;
}
```

### HTML Structure complète

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#000000">
  <title>Full-Width Layout Example</title>
  <style>
    /* Reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Safe Area support pour les notches (iPhone X+) */
    body {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }

    /* Root Container */
    .site-wrapper {
      overflow-x: hidden;
    }

    /* Full-Width Section */
    .section-full {
      width: 100%;
      position: relative;
    }

    /* Centered Content Container */
    .container {
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 1rem; /* 16px mobile */
      padding-right: 1rem;
    }

    /* Responsive gutters */
    @media (min-width: 768px) {
      .container {
        padding-left: 1.5rem; /* 24px tablet */
        padding-right: 1.5rem;
      }
    }

    @media (min-width: 1024px) {
      .container {
        padding-left: 3rem; /* 48px desktop */
        padding-right: 3rem;
      }
    }

    @media (min-width: 1536px) {
      .container {
        padding-left: 4rem; /* 64px large */
        padding-right: 4rem;
      }
    }

    /* Hero Section (Full-bleed) */
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
    }

    /* Accessibility */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    }

    .skip-link:focus {
      top: 0;
    }

    /* Focus states */
    a:focus,
    button:focus {
      outline: 3px solid #667eea;
      outline-offset: 2px;
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .hero {
        border-top: 3px solid currentColor;
        border-bottom: 3px solid currentColor;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <!-- Skip to main content for screen readers -->
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>

  <div class="site-wrapper">

    <!-- Hero Section (Full-width) -->
    <section class="section-full hero" role="banner">
      <div class="container">
        <h1>Full-Width Hero Section</h1>
        <p>Content is centered in a max-width container</p>
      </div>
    </section>

    <!-- Main Content -->
    <main id="main-content" class="section-full" style="background: #f5f5f5; padding: 4rem 0;">
      <div class="container">
        <h2>Content Section</h2>
        <p>This content stays within the max-width container</p>

        <!-- Responsive Image with srcset -->
        <picture>
          <source
            srcset="image-large.webp 1920w,
                    image-medium.webp 1280w,
                    image-small.webp 640w"
            sizes="(min-width: 1024px) 1200px,
                   (min-width: 768px) 100vw,
                   100vw"
            type="image/webp"
          />
          <img
            src="image-medium.jpg"
            srcset="image-large.jpg 1920w,
                    image-medium.jpg 1280w,
                    image-small.jpg 640w"
            sizes="(min-width: 1024px) 1200px,
                   (min-width: 768px) 100vw,
                   100vw"
            alt="Description détaillée de l'image"
            loading="lazy"
            decoding="async"
            width="1200"
            height="675"
            style="width: 100%; height: auto; display: block;"
          />
        </picture>
      </div>
    </main>

    <!-- Another Full-Width Section -->
    <section class="section-full" style="background: white; padding: 4rem 0;">
      <div class="container">
        <h2>Another Section</h2>
        <p>Consistent layout pattern</p>
      </div>
    </section>

  </div>
</body>
</html>
```

---

## 3. React + Tailwind Implementation

### Configuration Tailwind

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
}
```

### Components React

```tsx
// components/Container.tsx
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`
        max-w-[1200px]
        mx-auto
        px-4 sm:px-6 lg:px-12 xl:px-16
        ${className}
      `}
    >
      {children}
    </Component>
  );
};
```

```tsx
// components/FullWidthSection.tsx
import React from 'react';

interface FullWidthSectionProps {
  children: React.ReactNode;
  className?: string;
  background?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const FullWidthSection: React.FC<FullWidthSectionProps> = ({
  children,
  className = '',
  background = 'bg-white',
  as: Component = 'section',
}) => {
  return (
    <Component className={`w-full ${background} ${className}`}>
      {children}
    </Component>
  );
};
```

```tsx
// components/OptimizedImage.tsx
import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}) => {
  // Generate srcset
  const srcSet = [
    `${src}?w=640 640w`,
    `${src}?w=1280 1280w`,
    `${src}?w=1920 1920w`,
  ].join(', ');

  const sizes = '(min-width: 1024px) 1200px, (min-width: 768px) 100vw, 100vw';

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`w-full h-auto ${className}`}
    />
  );
};
```

```tsx
// pages/FullWidthLayout.tsx
import React from 'react';
import { Container } from '../components/Container';
import { FullWidthSection } from '../components/FullWidthSection';
import { OptimizedImage } from '../components/OptimizedImage';

export const FullWidthLayout: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-black focus:text-white"
      >
        Aller au contenu principal
      </a>

      {/* Hero Section - Full Width */}
      <FullWidthSection
        as="header"
        background="bg-gradient-to-br from-purple-600 to-purple-900"
        className="min-h-screen flex items-center text-white"
      >
        <Container>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6">
            Full-Width Hero Section
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-light opacity-90">
            Content is centered in a max-width container
          </p>
        </Container>
      </FullWidthSection>

      {/* Main Content Section */}
      <FullWidthSection
        as="main"
        id="main-content"
        background="bg-neutral-50"
        className="py-16 md:py-24 lg:py-32"
      >
        <Container>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8">
            Content Section
          </h2>
          <p className="text-lg md:text-xl text-neutral-700 mb-12">
            This content stays within the max-width container
          </p>

          <OptimizedImage
            src="/images/example.jpg"
            alt="Description détaillée pour l'accessibilité"
            width={1200}
            height={675}
            className="rounded-sm shadow-lg"
          />
        </Container>
      </FullWidthSection>

      {/* Another Section */}
      <FullWidthSection
        background="bg-white"
        className="py-16 md:py-24 lg:py-32"
      >
        <Container>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8">
            Another Section
          </h2>
          <p className="text-lg md:text-xl text-neutral-700">
            Consistent layout pattern
          </p>
        </Container>
      </FullWidthSection>
    </div>
  );
};
```

---

## 4. Breakpoints Tailwind utilisés

```css
/* Tailwind default breakpoints */
sm: 640px   /* padding: 1.5rem (24px) */
md: 768px   /* padding: 1.5rem (24px) */
lg: 1024px  /* padding: 3rem (48px) */
xl: 1280px  /* padding: 4rem (64px) */
2xl: 1536px /* padding: 4rem (64px) */
```

---

## 5. Accessibilité (WCAG 2.1 AA)

### Contraste des couleurs

```tsx
// Contraste minimum 4.5:1 pour le texte normal
// Contraste minimum 3:1 pour le texte large (18px+ ou 14px+ bold)

const accessibleColors = {
  // Background sombre, texte clair
  darkBg: '#1a1a1a',
  lightText: '#ffffff', // Ratio: 17.73:1 ✓

  // Background clair, texte sombre
  lightBg: '#ffffff',
  darkText: '#1a1a1a', // Ratio: 17.73:1 ✓

  // Accent colors
  primaryBg: '#667eea',
  primaryText: '#ffffff', // Ratio: 4.57:1 ✓
};
```

### Focus States (Tailwind)

```tsx
// Toujours visible avec outline
<button className="
  focus:outline-none
  focus:ring-4
  focus:ring-purple-500
  focus:ring-offset-2
  transition-all
">
  Accessible Button
</button>

// Alternative avec border
<a className="
  focus:outline-none
  focus:border-4
  focus:border-purple-500
  outline-offset-2
">
  Accessible Link
</a>
```

### Landmarks ARIA

```tsx
<header role="banner">
  <nav role="navigation" aria-label="Navigation principale">
    {/* Navigation items */}
  </nav>
</header>

<main role="main" id="main-content">
  {/* Main content */}
</main>

<aside role="complementary" aria-label="Contenu connexe">
  {/* Sidebar */}
</aside>

<footer role="contentinfo">
  {/* Footer */}
</footer>
```

---

## 6. Safe Area Handling (iPhone X+, Notches)

### CSS Variables

```css
/* globals.css */
:root {
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-right: env(safe-area-inset-right);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  --safe-area-inset-left: env(safe-area-inset-left);
}

body {
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
}

/* Fixed elements */
.fixed-header {
  padding-top: max(1rem, var(--safe-area-inset-top));
  padding-left: max(1rem, var(--safe-area-inset-left));
  padding-right: max(1rem, var(--safe-area-inset-right));
}

.fixed-footer {
  padding-bottom: max(1rem, var(--safe-area-inset-bottom));
}
```

### Tailwind Extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      padding: {
        'safe': 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
};
```

---

## 7. Performance & Images

### Lazy Loading Strategy

```tsx
// Above the fold - Priority
<OptimizedImage
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority={true}  // loading="eager"
/>

// Below the fold - Lazy load
<OptimizedImage
  src="/content.jpg"
  alt="Content image"
  width={1200}
  height={675}
  priority={false}  // loading="lazy"
/>
```

### Responsive Images avec srcset

```tsx
// Utilisation de next/image (Next.js)
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={675}
  sizes="(max-width: 768px) 100vw,
         (max-width: 1024px) 100vw,
         1200px"
  loading="lazy"
  quality={85}
/>
```

### WebP avec fallback

```tsx
<picture>
  <source
    srcSet="/image.webp"
    type="image/webp"
  />
  <source
    srcSet="/image.jpg"
    type="image/jpeg"
  />
  <img
    src="/image.jpg"
    alt="Description"
    loading="lazy"
  />
</picture>
```

---

## 8. Grid CSS Alternative (Advanced)

```css
/* Full-bleed Grid Layout */
.page-layout {
  display: grid;
  grid-template-columns:
    [full-start] minmax(1rem, 1fr)
    [wide-start] minmax(0, 100px)
    [content-start] min(100% - 2rem, 1200px) [content-end]
    minmax(0, 100px) [wide-end]
    minmax(1rem, 1fr) [full-end];
}

/* Usage */
.hero {
  grid-column: full-start / full-end;
}

.content {
  grid-column: content-start / content-end;
}

.wide-content {
  grid-column: wide-start / wide-end;
}
```

```tsx
// React Component
export const GridLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid [grid-template-columns:minmax(1rem,1fr)_minmax(0,1200px)_minmax(1rem,1fr)]">
      {children}
    </div>
  );
};

// Usage
<GridLayout>
  <div className="col-[1/-1] bg-purple-900">Full Width</div>
  <div className="col-[2/3]">Centered Content</div>
</GridLayout>
```

---

## 9. Checklist de mise en œuvre

### HTML/CSS
- [ ] Meta viewport avec `viewport-fit=cover`
- [ ] Safe area insets pour les notches
- [ ] Full-bleed sections avec `width: 100%`
- [ ] Centered containers avec `max-width` + `margin: 0 auto`
- [ ] Responsive gutters (16px → 24px → 48px)
- [ ] Overflow-x hidden sur root

### Images
- [ ] srcset pour responsive images
- [ ] sizes attribute appropriés
- [ ] loading="lazy" pour images below-fold
- [ ] loading="eager" pour hero/LCP
- [ ] WebP avec fallback JPEG/PNG
- [ ] width & height explicites (prevent CLS)
- [ ] Alt text descriptifs

### Accessibilité
- [ ] Skip to main content link
- [ ] Focus states visibles (outline/ring)
- [ ] Contraste ≥ 4.5:1 (texte normal)
- [ ] Contraste ≥ 3:1 (texte large)
- [ ] ARIA landmarks (banner, main, contentinfo)
- [ ] prefers-reduced-motion support
- [ ] prefers-contrast support
- [ ] Keyboard navigation

### Performance
- [ ] Images optimisées (compression, format)
- [ ] Lazy loading strategique
- [ ] Critical CSS inline
- [ ] Font loading optimisé
- [ ] No layout shift (CLS)

---

## 10. Exemple complet Tailwind (Production Ready)

```tsx
// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Full-Width Layout',
  description: 'Responsive edge-to-edge layout',
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="overflow-x-hidden">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-black focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
```

```tsx
// components/Section.tsx
interface SectionProps {
  children: React.ReactNode;
  background?: string;
  contained?: boolean;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  background = 'bg-white',
  contained = true,
  className = '',
}) => {
  const content = contained ? (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
      {children}
    </div>
  ) : (
    children
  );

  return (
    <section className={`w-full ${background} ${className}`}>
      {content}
    </section>
  );
};
```

```tsx
// app/page.tsx
import { Section } from '@/components/Section';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section
        background="bg-gradient-to-br from-purple-600 to-purple-900"
        className="min-h-screen flex items-center text-white py-20"
      >
        <div>
          <h1 className="text-5xl lg:text-7xl font-light mb-6">
            Full-Width Layout
          </h1>
          <p className="text-xl lg:text-2xl font-light opacity-90">
            Responsive, accessible, performant
          </p>
        </div>
      </Section>

      {/* Content */}
      <Section
        background="bg-neutral-50"
        className="py-20 lg:py-32"
      >
        <h2 className="text-4xl lg:text-5xl font-light mb-8">
          Content Section
        </h2>
        <p className="text-lg text-neutral-700">
          This content is centered and respects safe areas
        </p>
      </Section>
    </>
  );
}
```

---

## Ressources supplémentaires

- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Tricks: Full-Bleed Layout](https://css-tricks.com/full-bleed/)
- [Web.dev: Safe Area Insets](https://web.dev/viewport-fit-cover/)
