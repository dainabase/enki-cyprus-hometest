import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleMapsProvider>
        <App />
      </GoogleMapsProvider>
    </BrowserRouter>
  </StrictMode>
);
