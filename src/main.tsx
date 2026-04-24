import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/sentry'; // Initialize Sentry first
import './lib/i18n'; // Initialize i18n
import App from './App.tsx';
import './index.css';
import { logger } from '@/lib/logger';

logger.info('🏁 main.tsx: Starting application');

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
