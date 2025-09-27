import { ToastProvider } from '@/components/ToastProvider';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { ErrorBoundary } from "@sentry/react";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/Layout";
import { FilterProvider } from "./contexts/FilterContext";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleMapsProvider } from "./contexts/GoogleMapsContext";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { CookieConsentBanner } from "./components/CookieConsent";
import { NotificationProvider } from "./components/NotificationProvider";
import { initGA } from "./lib/analytics";

// Lazy load pages for code splitting  
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // @ts-ignore
        if (error?.message?.includes('network')) return false;
        return failureCount < 2;
      },
    },
  },
});

// Error Fallback Component
const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center p-8 max-w-md">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Une erreur est survenue
      </h2>
      <p className="text-muted-foreground mb-4">
        Veuillez recharger la page pour continuer.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
      >
        Recharger la page
      </button>
    </div>
  </div>
);

// App component rendering
const AppContent = () => {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <BrowserRouter>
      <TooltipProvider>
        <GoogleMapsProvider>
          <FilterProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public routes - with Layout */}
                <Route path="/*" element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                } />
              </Routes>
            </Suspense>
            <CookieConsentBanner />
            <Sonner />
          </FilterProvider>
        </GoogleMapsProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ToastProvider>
              <NotificationProvider>
                <AppContent />
              </NotificationProvider>
            </ToastProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
