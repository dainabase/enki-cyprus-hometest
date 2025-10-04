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
import LoadingSpinner from "./components/LoadingSpinner";
import { CookieConsentBanner } from "./components/CookieConsent";
import { NotificationProvider } from "./components/NotificationProvider";
import { initGA, trackPageView } from "./lib/analytics";

// Lazy load pages for code splitting  
const PublicProjectPage = lazy(() => import("./pages/projects/ProjectPage"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const LexaiaPage = lazy(() => import("./pages/LexaiaPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages that are NOT part of the main admin dashboard routing
const AdminAIImportUnified = lazy(() => import("./pages/admin/AdminAIImportUnified"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message?.includes('network')) return false;
        return failureCount < 2;
      },
    },
  },
});

// Error Fallback Component
const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center p-8 max-w-md">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        Une erreur est survenue
      </h2>
      <p className="text-slate-600 mb-4">
        Veuillez recharger la page pour continuer.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
                {/* Special admin route for AI import (outside main admin dashboard) */}
                <Route path="/admin-ai-import-unified" element={
                  <PrivateRoute adminOnly>
                    <AdminAIImportUnified />
                  </PrivateRoute>
                } />
                
                {/* Main admin dashboard - handles ALL /admin/* routes internally */}
                <Route path="/admin/*" element={
                  <PrivateRoute adminOnly>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                
                {/* Public routes - with Layout */}
                <Route path="/*" element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:slug" element={<PublicProjectPage />} />
                      <Route path="/project/:id" element={<ProjectDetail />} />
                      <Route path="/project-detail/:id" element={<ProjectDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/dashboard" element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      } />
                      <Route path="/lexaia" element={<LexaiaPage />} />
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
