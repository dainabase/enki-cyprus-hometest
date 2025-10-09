import { useState, useCallback } from 'react';
import type { ExpansionState, ExpansionPhase } from '@/types/expansion.types';

export const usePropertyExpansion = () => {
  const [state, setState] = useState<ExpansionState>({
    phase: 'idle',
    expandedPropertyId: null,
    showLexaia: false,
    selectedPropertyForLexaia: null,
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
    });
  }, []);

  const collapseProperty = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'grid',
      expandedPropertyId: null,
    }));
  }, []);

  const openLexaia = useCallback((propertyId: string) => {
    setState({
      phase: 'lexaia',
      expandedPropertyId: null,
      showLexaia: true,
      selectedPropertyForLexaia: propertyId,
    });
  }, []);

  const closeLexaia = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'grid',
      showLexaia: false,
      selectedPropertyForLexaia: null,
    }));
  }, []);

  const showGrid = useCallback(() => {
    setState({
      phase: 'grid',
      expandedPropertyId: null,
      showLexaia: false,
      selectedPropertyForLexaia: null,
    });
  }, []);

  return {
    state,
    setPhase,
    expandProperty,
    collapseProperty,
    openLexaia,
    closeLexaia,
    showGrid,
  };
};
