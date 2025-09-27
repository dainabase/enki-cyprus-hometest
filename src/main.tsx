import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/sentry'; // Initialize Sentry first
import './lib/i18n'; // Initialize i18n
import App from './App.tsx';
import './index.css';

console.log('🏁 main.tsx: Starting application');
console.log('🏁 Environment:', import.meta.env.MODE);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
