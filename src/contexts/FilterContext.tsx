import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { debounce } from 'lodash';
import { Property } from '@/data/mockData';

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
  properties: Property[];
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children, properties }) => {
  const [state, dispatch] = useReducer(filterReducer, {
    ...initialState,
    allProperties: properties,
    filteredProperties: properties
  });

  // Fonction de filtrage avec debounce
  const debouncedFilter = debounce(() => {
    console.log('🔍 Applying filters:', state.filters);
    dispatch({ type: 'SET_LOADING', payload: true });

    let filtered = [...state.allProperties];

    // Filtre par type de bien
    if (state.filters.propertyType !== 'Tous') {
      const typeMapping: { [key: string]: string[] } = {
        'Appartements': ['apartment', 'penthouse'],
        'Maisons': ['villa', 'maison'],
        'Commercial': ['commercial']
      };
      
      const validTypes = typeMapping[state.filters.propertyType] || [];
      if (validTypes.length > 0) {
        filtered = filtered.filter(property => validTypes.includes(property.type));
      }
    }

    // Filtre par budget
    filtered = filtered.filter(property => 
      property.priceValue >= state.filters.budgetMin && 
      property.priceValue <= state.filters.budgetMax
    );

    // Filtre par localisation
    if (state.filters.location) {
      const location = state.filters.location.toLowerCase();
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(location) ||
        property.title.toLowerCase().includes(location)
      );
    }

    console.log(`📊 Filtered results: ${filtered.length} properties`);
    dispatch({ type: 'SET_FILTERED_PROPERTIES', payload: filtered });
  }, 300);

  const applyFilters = () => {
    debouncedFilter();
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [state.filters]);

  // Initialiser avec toutes les propriétés
  useEffect(() => {
    if (properties.length > 0) {
      dispatch({ type: 'SET_ALL_PROPERTIES', payload: properties });
    }
  }, [properties]);

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