import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { debounce } from 'lodash';
import { Property } from '@/data/mockData';

export type PropertyType = 'all' | 'appartement' | 'maison' | 'villa' | 'commercial' | 'penthouse';

export interface SearchFilters {
  propertyType: PropertyType;
  budgetRange: [number, number];
  location: string;
  bedrooms: number | null;
  searchQuery: string;
}

export interface SearchState {
  filters: SearchFilters;
  filteredProperties: Property[];
  isLoading: boolean;
  selectedProperty: Property | null;
  mapCenter: { lat: number; lng: number } | null;
  mapZoom: number;
}

type SearchAction =
  | { type: 'SET_PROPERTY_TYPE'; payload: PropertyType }
  | { type: 'SET_BUDGET_RANGE'; payload: [number, number] }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_BEDROOMS'; payload: number | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERED_PROPERTIES'; payload: Property[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SELECT_PROPERTY'; payload: Property | null }
  | { type: 'SET_MAP_CENTER'; payload: { lat: number; lng: number } | null }
  | { type: 'SET_MAP_ZOOM'; payload: number }
  | { type: 'RESET_FILTERS' };

const initialState: SearchState = {
  filters: {
    propertyType: 'all',
    budgetRange: [0, 3000000],
    location: '',
    bedrooms: null,
    searchQuery: ''
  },
  filteredProperties: [],
  isLoading: false,
  selectedProperty: null,
  mapCenter: null,
  mapZoom: 9
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_PROPERTY_TYPE':
      return {
        ...state,
        filters: { ...state.filters, propertyType: action.payload }
      };
    case 'SET_BUDGET_RANGE':
      return {
        ...state,
        filters: { ...state.filters, budgetRange: action.payload }
      };
    case 'SET_LOCATION':
      return {
        ...state,
        filters: { ...state.filters, location: action.payload }
      };
    case 'SET_BEDROOMS':
      return {
        ...state,
        filters: { ...state.filters, bedrooms: action.payload }
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        filters: { ...state.filters, searchQuery: action.payload }
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
    case 'SELECT_PROPERTY':
      return {
        ...state,
        selectedProperty: action.payload,
        mapCenter: action.payload ? { lat: action.payload.lat, lng: action.payload.lng } : null,
        mapZoom: action.payload ? 15 : 9
      };
    case 'SET_MAP_CENTER':
      return {
        ...state,
        mapCenter: action.payload
      };
    case 'SET_MAP_ZOOM':
      return {
        ...state,
        mapZoom: action.payload
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        selectedProperty: null,
        mapCenter: null,
        mapZoom: 9
      };
    default:
      return state;
  }
}

interface SearchContextType {
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  setPropertyType: (type: PropertyType) => void;
  setBudgetRange: (range: [number, number]) => void;
  setLocation: (location: string) => void;
  setBedrooms: (bedrooms: number | null) => void;
  setSearchQuery: (query: string) => void;
  selectProperty: (property: Property | null) => void;
  resetFilters: () => void;
  filterProperties: (allProperties: Property[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
  allProperties: Property[];
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children, allProperties }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Debounced filter function
  const debouncedFilter = debounce((properties: Property[], filters: SearchFilters) => {
    console.log('Filtering properties with filters:', filters);
    dispatch({ type: 'SET_LOADING', payload: true });

    let filtered = [...properties];

    // Filter by property type
    if (filters.propertyType !== 'all') {
      const typeMapping: Record<PropertyType, string[]> = {
        'all': [],
        'appartement': ['apartment'],
        'maison': ['maison'],
        'villa': ['villa'],
        'commercial': ['commercial'],
        'penthouse': ['penthouse']
      };
      
      const validTypes = typeMapping[filters.propertyType];
      if (validTypes.length > 0) {
        filtered = filtered.filter(property => validTypes.some(t => property.property_sub_type.includes(t)));
      }
    }

    // Filter by budget range
    filtered = filtered.filter(property => 
      property.priceValue >= filters.budgetRange[0] && 
      property.priceValue <= filters.budgetRange[1]
    );

    // Filter by bedrooms
    if (filters.bedrooms !== null) {
      filtered = filtered.filter(property => property.bedrooms === filters.bedrooms);
    }

    // Filter by location and search query
    if (filters.location || filters.searchQuery) {
      const searchTerm = (filters.location || filters.searchQuery).toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.features.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    }

    console.log(`Filtered results: ${filtered.length} properties out of ${properties.length}`);
    dispatch({ type: 'SET_FILTERED_PROPERTIES', payload: filtered });
  }, 300);

  // Filter properties when filters change
  useEffect(() => {
    if (allProperties.length > 0) {
      debouncedFilter(allProperties, state.filters);
    }
  }, [state.filters, allProperties, debouncedFilter]);

  // Initialize with all properties
  useEffect(() => {
    if (allProperties.length > 0 && state.filteredProperties.length === 0) {
      dispatch({ type: 'SET_FILTERED_PROPERTIES', payload: allProperties });
    }
  }, [allProperties, state.filteredProperties.length]);

  const contextValue: SearchContextType = {
    state,
    dispatch,
    setPropertyType: (type) => dispatch({ type: 'SET_PROPERTY_TYPE', payload: type }),
    setBudgetRange: (range) => dispatch({ type: 'SET_BUDGET_RANGE', payload: range }),
    setLocation: (location) => dispatch({ type: 'SET_LOCATION', payload: location }),
    setBedrooms: (bedrooms) => dispatch({ type: 'SET_BEDROOMS', payload: bedrooms }),
    setSearchQuery: (query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    selectProperty: (property) => dispatch({ type: 'SELECT_PROPERTY', payload: property }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    filterProperties: (properties) => debouncedFilter(properties, state.filters)
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};