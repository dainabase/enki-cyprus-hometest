import { motion } from 'framer-motion';
import { usePropertyExpansion } from '@/hooks/usePropertyExpansion';
import { PANEL_ANIMATIONS } from '@/constants/expansion.animations';
import { PropertyCardEnhanced } from './PropertyCardEnhanced';
import { mockProperties } from '@/data/mockProperties';

export const ExpansionContainer = () => {
  const { state, expandProperty } = usePropertyExpansion();

  if (state.phase === 'idle') {
    return null;
  }

  return (
    <motion.section
      className="w-full bg-gray-50 min-h-screen"
      initial={PANEL_ANIMATIONS.initial}
      animate={PANEL_ANIMATIONS.animate}
      exit={PANEL_ANIMATIONS.exit}
      transition={PANEL_ANIMATIONS.transition}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Properties Matching Your Criteria
          </h2>
          <p className="text-muted-foreground">
            {mockProperties.length} properties found - Phase: {state.phase}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <PropertyCardEnhanced
              key={property.id}
              property={property}
              onExpand={expandProperty}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};
