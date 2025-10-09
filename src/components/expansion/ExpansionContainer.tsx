import { motion } from 'framer-motion';
import { usePropertyExpansion } from '@/hooks/usePropertyExpansion';
import { PANEL_ANIMATIONS } from '@/constants/expansion.animations';

export const ExpansionContainer = () => {
  const { state } = usePropertyExpansion();

  // Pour l'instant, juste un placeholder
  // Les prochaines étapes ajouteront le contenu

  if (state.phase === 'idle') {
    return null;
  }

  return (
    <motion.section
      className="w-full bg-white"
      initial={PANEL_ANIMATIONS.initial}
      animate={PANEL_ANIMATIONS.animate}
      exit={PANEL_ANIMATIONS.exit}
      transition={PANEL_ANIMATIONS.transition}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          Expansion Container - Phase: {state.phase}
        </div>
      </div>
    </motion.section>
  );
};
