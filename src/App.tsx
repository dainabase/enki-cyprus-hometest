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
import { PrivateRoute } from "./components/auth/PrivateRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import { CookieConsentBanner } from "./components/CookieConsent";
import { NotificationProvider } from "./components/NotificationProvider";
import { initGA, trackPageView } from "./lib/analytics";

// Lazy load pages for code splitting  
const PublicProjectPage = lazy(() => import("./app/(public)/projects/[slug]/page"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const LexaiaPage = lazy(() => import("./pages/LexaiaPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load admin pages for better performance
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminProjectForm = lazy(() => import("./pages/admin/AdminProjectForm"));
const AdminAIImport = lazy(() => import("./pages/admin/AdminAIImport"));
const AdminAIImportUnified = lazy(() => import("./pages/admin/AdminAIImportUnified"));
const AdminProjectDetail = lazy(() => import("./pages/admin/AdminProjectDetail"));
const AdminBuildings = lazy(() => import("./pages/admin/AdminBuildings"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminPerformance = lazy(() => import("./pages/admin/AdminPerformance"));
const AdminSegmentation = lazy(() => import("./pages/admin/AdminSegmentation"));

// Test integration page (dev mode only)
const AdminTestIntegration = lazy(() => import("./pages/admin/AdminTestIntegration").then(module => ({ default: module.default })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.message?.includes('network')) return false;
        return failureCount < 2;
      },
    },
  },
});

// App component rendering

const AppContent = () => {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <BrowserRouter>
      <TooltipProvider>
        <FilterProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Admin routes - without Layout */}
              <Route path="/admin/*" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/projects/new" element={<PrivateRoute adminOnly><AdminProjectForm /></PrivateRoute>} />
              <Route path="/admin/projects/ai-import" element={<PrivateRoute adminOnly><AdminAIImport /></PrivateRoute>} />
              <Route path="/admin/ai-import-unified" element={<PrivateRoute adminOnly><AdminAIImportUnified /></PrivateRoute>} />
              <Route path="/admin/projects/:id" element={<PrivateRoute adminOnly><AdminProjectDetail /></PrivateRoute>} />
              <Route path="/admin/projects/:id/edit" element={<PrivateRoute adminOnly><AdminProjectForm /></PrivateRoute>} />
              <Route path="/admin-test" element={<PrivateRoute adminOnly><AdminTestIntegration /></PrivateRoute>} />
              
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
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
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
      </TooltipProvider>
    </BrowserRouter>
  );
};

const App = () => {
  // App function called
  return (
    <ErrorBoundary fallback={<div className="p-6 text-center"><p>Une erreur est survenue. Veuillez recharger la page.</p></div>}>
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
