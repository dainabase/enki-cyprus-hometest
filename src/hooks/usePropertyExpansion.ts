import { useState, useCallback } from 'react';
import type { ExpansionState, ExpansionPhase, ChatWidth } from '@/types/expansion.types';

export const usePropertyExpansion = () => {
  const [state, setState] = useState<ExpansionState>({
    phase: 'grid',
    expandedPropertyId: null,
    showLexaia: false,
    selectedPropertyForLexaia: null,
    chatWidth: 'full',
  });

  const setPhase = useCallback((phase: ExpansionPhase) => {
    setState(prev => ({ ...prev, phase }));
  }, []);

  const expandProperty = useCallback((propertyId: string) => {
    setState({
      phase: 'expanded',
      expandedPropertyId: propertyId,
      showLexaia: false,
      selectedPropertyForLexaia: null,
      chatWidth: 'mini',
    });
  }, []);

  const collapseProperty = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'grid',
      expandedPropertyId: null,
      chatWidth: 'full',
    }));
  }, []);

  const openLexaia = useCallback((propertyId: string) => {
    setState({
      phase: 'lexaia',
      expandedPropertyId: null,
      showLexaia: true,
      selectedPropertyForLexaia: propertyId,
      chatWidth: 'collapsed',
    });
  }, []);

  const closeLexaia = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'grid',
      showLexaia: false,
      selectedPropertyForLexaia: null,
      chatWidth: 'full',
    }));
  }, []);

  const showGrid = useCallback(() => {
    setState({
      phase: 'grid',
      expandedPropertyId: null,
      showLexaia: false,
      selectedPropertyForLexaia: null,
      chatWidth: 'full',
    });
  }, []);

  const setChatWidth = useCallback((width: ChatWidth) => {
    setState(prev => ({ ...prev, chatWidth: width }));
  }, []);

  const toggleChatWidth = useCallback(() => {
    setState(prev => ({
      ...prev,
      chatWidth: prev.chatWidth === 'full' ? 'mini' : 'full',
    }));
  }, []);

  return {
    state,
    setPhase,
    expandProperty,
    collapseProperty,
    openLexaia,
    closeLexaia,
    showGrid,
    setChatWidth,
    toggleChatWidth,
  };
};
