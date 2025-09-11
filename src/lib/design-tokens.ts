// Système de design tokens pour TypeScript
export const colors = {
  // Couleurs principales
  primary: {
    DEFAULT: '#57B9D6',
    hover: '#3FA5C6',
    light: '#7FCAE3',
    dark: '#2E95B6',
    rgb: '87, 185, 214',
  },
  secondary: {
    DEFAULT: '#D3E3F0',
    hover: '#B8D2E6',
    light: '#E8F1F8',
    dark: '#A8C5DD',
    rgb: '211, 227, 240',
  },
  accent: {
    DEFAULT: '#FDF0E4',
    hover: '#FCDEC4',
    light: '#FEF8F2',
    dark: '#F5D4B4',
    rgb: '253, 240, 228',
  },
  muted: {
    DEFAULT: '#A17964',
    hover: '#8A6552',
    light: '#B89380',
    dark: '#785443',
    rgb: '161, 121, 100',
  },
  
  // Golden Visa
  golden: {
    DEFAULT: '#FFD700',
    dark: '#B8860B',
    light: '#FFED4E',
  },
  
  // Sémantiques
  semantic: {
    success: '#22C55E',
    warning: '#FB923C',
    error: '#EF4444',
    info: '#57B9D6',
  },
} as const;

export const gradients = {
  hero: 'linear-gradient(135deg, #FDF0E4 0%, #D3E3F0 50%, #57B9D6 100%)',
  sunset: 'linear-gradient(135deg, #FDF0E4 0%, #A17964 45%, #57B9D6 100%)',
  ocean: 'linear-gradient(180deg, #7FCAE3 0%, #57B9D6 100%)',
  sand: 'linear-gradient(135deg, #FDF0E4 0%, #FCDEC4 100%)',
  premium: 'linear-gradient(90deg, #57B9D6 0%, #A17964 100%)',
  golden: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(87, 185, 214, 0.05)',
  DEFAULT: '0 4px 6px -1px rgba(87, 185, 214, 0.1)',
  md: '0 10px 15px -3px rgba(87, 185, 214, 0.1)',
  lg: '0 20px 25px -5px rgba(87, 185, 214, 0.15)',
  xl: '0 25px 50px -12px rgba(87, 185, 214, 0.25)',
} as const;

export const animations = {
  transition: {
    base: '200ms ease-in-out',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  duration: {
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
} as const;