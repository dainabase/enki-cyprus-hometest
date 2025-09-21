import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { debounce } from 'lodash';
import { Property } from '@/lib/supabase';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';

// Types pour les filtres
export interface SearchFilters {
  propertyType: string;
  budgetMin: number;
  budgetMax: number;
  location: string;
}

export interface FilterState {
  filters: SearchFilters;
  filteredProperties: Property[];
  isLoading: boolean;
  allProperties: Property[];
}

type FilterAction =
  | { type: 'SET_PROPERTY_TYPE'; payload: string }
  | { type: 'SET_BUDGET_RANGE'; payload: { min: number; max: number } }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_FILTERED_PROPERTIES'; payload: Property[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_ALL_PROPERTIES'; payload: Property[] };

const initialState: FilterState = {
  filters: {
    propertyType: 'Tous',
    budgetMin: 0,
    budgetMax: 1000000,
    location: ''
  },
  filteredProperties: [],
  isLoading: false,
  allProperties: []
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_PROPERTY_TYPE':
      return {
        ...state,
        filters: { ...state.filters, propertyType: action.payload }
      };
    case 'SET_BUDGET_RANGE':
      return {
        ...state,
        filters: { 
          ...state.filters, 
          budgetMin: action.payload.min, 
          budgetMax: action.payload.max 
        }
      };
    case 'SET_LOCATION':
      return {
        ...state,
        filters: { ...state.filters, location: action.payload }
      };
    case 'SET_FILTERED_PROPERTIES':
      return {
        ...state,
        filteredProperties: action.payload,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ALL_PROPERTIES':
      return {
        ...state,
        allProperties: action.payload,
        filteredProperties: action.payload
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        filteredProperties: state.allProperties
      };
    default:
      return state;
  }
}

interface FilterContextType {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  applyFilters: () => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  
  // Hook pour charger les propriétés depuis Supabase
  // On force propertyType à undefined si c'est "Tous" pour éviter le filtrage
  const { properties, loading, error } = useSupabaseProperties({
    propertyType: state.filters.propertyType === 'Tous' ? undefined : state.filters.propertyType,
    budgetMin: state.filters.budgetMin,
    budgetMax: state.filters.budgetMax,
    location: state.filters.location
  });

  // Les filtres sont maintenant appliqués directement via le hook useSupabaseProperties
  const applyFilters = () => {
    // Le filtrage est automatique via le hook
    console.log('Filters applied via Supabase hook:', state.filters);
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  // Mettre à jour les propriétés quand elles changent depuis Supabase
  useEffect(() => {
    console.log('FilterContext: properties update', properties.length, 'loading:', loading, 'error:', error);
    dispatch({ type: 'SET_LOADING', payload: loading });
    if (properties.length >= 0) { // Change > 0 to >= 0 pour accepter un tableau vide
      dispatch({ type: 'SET_ALL_PROPERTIES', payload: properties });
    }
    if (error) {
      console.error('Erreur Supabase:', error);
    }
  }, [properties, loading, error]);

  const contextValue: FilterContextType = {
    state,
    dispatch,
    applyFilters,
    resetFilters
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};