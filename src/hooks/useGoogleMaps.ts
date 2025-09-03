import { useJsApiLoader } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';

// Static libraries to avoid reload warnings - NEVER change this array
const libraries: Libraries = ['places', 'marker'];

// Global Google Maps API key resolver
const getGoogleMapsApiKey = () => {
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim();
  const devFallbackKey = 'AIzaSyBmFbbR7bD_4PSJGBU-_12ZL1VjGKRXKBU';
  const apiKey = envKey && envKey.length > 0 ? envKey : devFallbackKey;
  
  if (!envKey) {
    console.warn('⚠️ Using provided dev Google Maps API key. Configure VITE_GOOGLE_MAPS_API_KEY in .env.local for production.');
  }
  
  return apiKey;
};

// Global hook for Google Maps API loading - use this ONLY ONCE per app
export const useGoogleMapsGlobal = () => {
  const apiKey = getGoogleMapsApiKey();
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (!apiKey) {
    console.error('❌ No Google Maps API key available');
  }

  return { isLoaded, loadError, apiKey };
};