import { motion, AnimatePresence } from 'framer-motion';
import { usePropertyExpansion } from '@/hooks/usePropertyExpansion';
import { PANEL_ANIMATIONS } from '@/constants/expansion.animations';
import { PropertyCardEnhanced } from './PropertyCardEnhanced';
import { PropertyExpanded } from './PropertyExpanded';
import { LexaiaPanel } from '../lexaia/LexaiaPanel';
import { ChatMiniMode } from '../chat/ChatMiniMode';
import { Breadcrumb } from '../chat/Breadcrumb';
import { mockProperties } from '@/data/mockProperties';

export const ExpansionContainer = () => {
  const { state, expandProperty, collapseProperty, closeLexaia, toggleChatWidth, setChatWidth } = usePropertyExpansion();

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

  return (
    <motion.section
      className="w-full bg-neutral-50 py-24 md:py-32"
      initial={PANEL_ANIMATIONS.initial}
      animate={PANEL_ANIMATIONS.animate}
      exit={PANEL_ANIMATIONS.exit}
      transition={PANEL_ANIMATIONS.transition}
    >
      <div className="container mx-auto px-4">
        {state.phase === 'grid' && (
          <>
            <div className="mb-12">
              <h2 className="swaarg-section-title text-black mb-4">
                Properties Matching Your Criteria
              </h2>
              <p className="swaarg-subtitle text-black/60">
                {mockProperties.length} properties found
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
          </>
        )}

        {state.phase === 'expanded' && expandedProperty && (
          <div className="flex gap-6">
            {state.chatWidth === 'mini' && (
              <div className="w-[20%]">
                <div className="sticky top-24 space-y-4">
                  <Breadcrumb currentStep={getBreadcrumbStep()} />
                  <ChatMiniMode
                    onExpand={toggleChatWidth}
                    lastMessage="Property selected. View details or analyze fiscally."
                  />
                </div>
              </div>
            )}

            <div className={state.chatWidth === 'mini' ? 'w-[80%]' : 'w-full'}>
              <AnimatePresence>
                <PropertyExpanded
                  property={expandedProperty}
                  onCollapse={collapseProperty}
                />
              </AnimatePresence>
            </div>
          </div>
        )}

        {state.phase === 'lexaia' && lexaiaProperty && (
          <div className="flex h-screen -m-8">
            {state.chatWidth === 'collapsed' && (
              <div className="w-[5%] border-r border-black/10 bg-white flex items-start justify-center p-4">
                <button
                  onClick={() => setChatWidth('mini')}
                  className="space-y-1 hover:opacity-70 transition-opacity"
                  aria-label="Expand chat"
                >
                  <div className="w-8 h-0.5 bg-black" />
                  <div className="w-8 h-0.5 bg-black" />
                  <div className="w-8 h-0.5 bg-black" />
                </button>
              </div>
            )}

            {state.chatWidth === 'mini' && (
              <div className="w-[20%]">
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

            <div className={state.chatWidth === 'mini' ? 'w-[80%]' : state.chatWidth === 'collapsed' ? 'w-[95%]' : 'w-full'}>
              <LexaiaPanel
                property={lexaiaProperty}
                onClose={closeLexaia}
              />
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};
