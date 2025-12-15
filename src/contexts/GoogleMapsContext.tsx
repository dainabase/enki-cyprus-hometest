import React, { createContext, useContext, ReactNode } from 'react';
import { useGoogleMapsGlobal } from '@/hooks/useGoogleMaps';
import { logger } from '@/lib/logger';

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
  apiKey: string;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const { isLoaded, loadError, apiKey } = useGoogleMapsGlobal();

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, apiKey }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMapsContext = () => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    const fallback: GoogleMapsContextType = { isLoaded: false, loadError: new Error('GoogleMapsProvider is missing'), apiKey: '' };
    logger.error('useGoogleMapsContext used outside of GoogleMapsProvider', undefined, { component: 'GoogleMapsContext' });
    return fallback;
  }
  return context;
};