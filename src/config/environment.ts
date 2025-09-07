const isProd = import.meta.env.VITE_APP_ENV === 'production';
const isDev = import.meta.env.VITE_APP_ENV === 'development';

export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://ccsakftsslurjgnjwdci.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2FrZnRzc2x1cmpnbmp3ZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjQyNDIsImV4cCI6MjA3MjUwMDI0Mn0.HpJzpJC8d9H74Pqye-AoYIZWPLvT9iYNHx_4yeFrPnk',
  enableTests: !isProd && import.meta.env.VITE_ENABLE_TESTS === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDevtools: !isProd && import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  logLevel: isProd ? 'error' : 'debug',
  appName: import.meta.env.VITE_APP_NAME || 'Enki Reality Admin',
  defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://enki-realty.com',
};

// Désactiver les outils de dev en production
if (isProd) {
  // Désactiver React DevTools
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { isDisabled: true };
  }
  
  // Désactiver console.log en production (garder error et warn)
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
}

// Configuration pour l'analytics
export const analyticsConfig = {
  enabled: config.enableAnalytics && isProd,
  ga4Id: import.meta.env.VITE_GA4_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
};

// Configuration pour les features
export const featureFlags = {
  tests: config.enableTests,
  analytics: config.enableAnalytics,
  devtools: config.enableDevtools,
  predictions: import.meta.env.VITE_ENABLE_PREDICTIONS === 'true',
};

export { isProd, isDev };