import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';
import './lib/sentry'; // Initialize Sentry first
import './lib/i18n'; // Initialize i18n
import App from './App.tsx';
import './index.css';

console.log('🏁 main.tsx: Starting application');

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleMapsProvider>
      <App />
    </GoogleMapsProvider>
  </StrictMode>
);
