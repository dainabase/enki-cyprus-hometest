import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePropertyExpansion } from '@/hooks/usePropertyExpansion';
import { PANEL_ANIMATIONS } from '@/constants/expansion.animations';
import { PropertyCardEnhanced } from './PropertyCardEnhanced';
import { PropertyCardSkeleton } from './PropertyCardSkeleton';
import { PropertyExpanded } from './PropertyExpanded';
import { LexaiaPanel } from '../lexaia/LexaiaPanel';
import { ChatMiniMode } from '../chat/ChatMiniMode';
import { Breadcrumb } from '../chat/Breadcrumb';
import { mockProperties } from '@/data/mockProperties';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const ExpansionContainer = () => {
  const { state, expandProperty, collapseProperty, closeLexaia, toggleChatWidth, setChatWidth } = usePropertyExpansion();
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);

  if (state.phase === 'idle') {
    return null;
  }

  const expandedProperty = mockProperties.find(
    (p) => p.id === state.expandedPropertyId
  );

  const lexaiaProperty = mockProperties.find(
    (p) => p.id === state.selectedPropertyForLexaia
  );

  const getBreadcrumbStep = (): 'analysis' | 'results' | 'property' | 'lexaia' => {
    switch (state.phase) {
      case 'idle':
      case 'grid':
        return 'results';
      case 'expanded':
        return 'property';
      case 'lexaia':
        return 'lexaia';
      default:
        return 'results';
    }
  };

  const handleExpandProperty = (propertyId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      expandProperty(propertyId);
      setIsLoading(false);
    }, 1500);
  };

  const animationConfig = shouldReduceMotion
    ? { duration: 0 }
    : PANEL_ANIMATIONS.transition;

  return (
    <motion.section
      className="w-full bg-neutral-50 py-12 sm:py-24 md:py-32"
      initial={PANEL_ANIMATIONS.initial}
      animate={PANEL_ANIMATIONS.animate}
      exit={PANEL_ANIMATIONS.exit}
      transition={animationConfig}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {state.phase === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 sm:mb-12">
                <h2 className="swaarg-section-title text-black mb-4">
                  Properties Matching Your Criteria
                </h2>
                <p className="swaarg-subtitle text-black/60">
                  {mockProperties.length} properties found
                </p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3].map((i) => (
                    <PropertyCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {mockProperties.map((property) => (
                    <motion.div key={property.id} variants={itemVariants}>
                      <PropertyCardEnhanced
                        property={property}
                        onExpand={handleExpandProperty}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {state.phase === 'expanded' && expandedProperty && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row gap-4 lg:gap-6"
            >
              {state.chatWidth === 'mini' && (
                <div className="hidden lg:block lg:w-[20%]">
                  <div className="sticky top-24 space-y-4">
                    <Breadcrumb currentStep={getBreadcrumbStep()} />
                    <ChatMiniMode
                      onExpand={toggleChatWidth}
                      lastMessage="Property selected. View details or analyze fiscally."
                    />
                  </div>
                </div>
              )}

              <div className={state.chatWidth === 'mini' ? 'w-full lg:w-[80%]' : 'w-full'}>
                <AnimatePresence>
                  <PropertyExpanded
                    property={expandedProperty}
                    onCollapse={collapseProperty}
                  />
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {state.phase === 'lexaia' && lexaiaProperty && (
            <motion.div
              key="lexaia"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row h-screen -m-8"
            >
              {state.chatWidth === 'collapsed' && (
                <div className="hidden lg:flex lg:w-[5%] border-r border-black/10 bg-white items-start justify-center p-4">
                  <button
                    onClick={() => setChatWidth('mini')}
                    className="space-y-1 hover:opacity-70 transition-opacity min-w-[44px] min-h-[44px] flex flex-col items-center justify-center"
                    aria-label="Expand chat"
                  >
                    <div className="w-8 h-0.5 bg-black" />
                    <div className="w-8 h-0.5 bg-black" />
                    <div className="w-8 h-0.5 bg-black" />
                  </button>
                </div>
              )}

              {state.chatWidth === 'mini' && (
                <div className="hidden lg:block lg:w-[20%]">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-black/10">
                      <Breadcrumb currentStep={getBreadcrumbStep()} />
                    </div>
                    <div className="flex-1">
                      <ChatMiniMode
                        onExpand={toggleChatWidth}
                        lastMessage="Exploring fiscal optimization for this property"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className={`w-full ${state.chatWidth === 'mini' ? 'lg:w-[80%]' : state.chatWidth === 'collapsed' ? 'lg:w-[95%]' : ''}`}>
                <LexaiaPanel
                  property={lexaiaProperty}
                  onClose={closeLexaia}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
