import { motion, AnimatePresence } from 'framer-motion';
import { usePropertyExpansion } from '@/hooks/usePropertyExpansion';
import { PANEL_ANIMATIONS } from '@/constants/expansion.animations';
import { PropertyCardEnhanced } from './PropertyCardEnhanced';
import { PropertyExpanded } from './PropertyExpanded';
import { LexaiaPanel } from '../lexaia/LexaiaPanel';
import { mockProperties } from '@/data/mockProperties';

export const ExpansionContainer = () => {
  const { state, expandProperty, collapseProperty, closeLexaia } = usePropertyExpansion();

  if (state.phase === 'idle') {
    return null;
  }

  const expandedProperty = mockProperties.find(
    (p) => p.id === state.expandedPropertyId
  );

  const lexaiaProperty = mockProperties.find(
    (p) => p.id === state.selectedPropertyForLexaia
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
        {state.phase !== 'lexaia' && (
          <>
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
          </>
        )}

        {state.phase === 'lexaia' && lexaiaProperty && (
          <div className="flex h-screen -m-8">
            <div className="w-[5%] border-r border-black/10 bg-white flex items-start justify-center p-4">
              <div className="space-y-1">
                <div className="w-8 h-0.5 bg-black" />
                <div className="w-8 h-0.5 bg-black" />
                <div className="w-8 h-0.5 bg-black" />
              </div>
            </div>

            <LexaiaPanel
              property={lexaiaProperty}
              onClose={closeLexaia}
            />
          </div>
        )}
      </div>
    </motion.section>
  );
};
