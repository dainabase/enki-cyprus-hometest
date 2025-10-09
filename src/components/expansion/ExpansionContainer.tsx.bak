import { motion, AnimatePresence } from 'framer-motion';
import { usePropertyExpansion } from '@/hooks/usePropertyExpansion';
import { PANEL_ANIMATIONS } from '@/constants/expansion.animations';
import { PropertyCardEnhanced } from './PropertyCardEnhanced';
import { PropertyExpanded } from './PropertyExpanded';
import { mockProperties } from '@/data/mockProperties';

export const ExpansionContainer = () => {
  const { state, expandProperty, collapseProperty } = usePropertyExpansion();

  if (state.phase === 'idle') {
    return null;
  }

  const expandedProperty = mockProperties.find(
    (p) => p.id === state.expandedPropertyId
  );

  return (
    <motion.section
      className="w-full bg-neutral-50 py-24 md:py-32"
      initial={PANEL_ANIMATIONS.initial}
      animate={PANEL_ANIMATIONS.animate}
      exit={PANEL_ANIMATIONS.exit}
      transition={PANEL_ANIMATIONS.transition}
    >
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="swaarg-section-title text-black mb-4">
            Properties Matching Your Criteria
          </h2>
          <p className="swaarg-subtitle text-black/60">
            {mockProperties.length} properties found
          </p>
        </div>

        <AnimatePresence>
          {state.phase === 'expanded' && expandedProperty && (
            <PropertyExpanded
              property={expandedProperty}
              onCollapse={collapseProperty}
            />
          )}
        </AnimatePresence>

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
