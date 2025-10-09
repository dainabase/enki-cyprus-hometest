// Constantes pour animations Framer Motion - Respect Design System

export const EXPANSION_TRANSITIONS = {
  // Bezier standard du Design System
  ease: [0.16, 1, 0.3, 1] as const,

  // Durées
  fast: 0.4,
  medium: 0.8,
  slow: 1.2,
};

export const CHAT_WIDTHS = {
  full: '100%',
  mini: '20%',
  micro: '15%',
  collapsed: '5%',
};

export const PANEL_ANIMATIONS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: EXPANSION_TRANSITIONS.medium,
    ease: EXPANSION_TRANSITIONS.ease,
  },
};

export const CARD_ANIMATIONS = {
  hover: { scale: 1.02, y: -4 },
  tap: { scale: 0.98 },
  transition: {
    duration: EXPANSION_TRANSITIONS.fast,
    ease: EXPANSION_TRANSITIONS.ease,
  },
};
