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
const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.default })));
const Search = lazy(() => import("./pages/Search").then(module => ({ default: module.default })));
const Projects = lazy(() => import("./pages/Projects").then(module => ({ default: module.default })));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail").then(module => ({ default: module.default })));
const About = lazy(() => import("./pages/About").then(module => ({ default: module.default })));
const Contact = lazy(() => import("./pages/Contact").then(module => ({ default: module.default })));
const Login = lazy(() => import("./pages/Login").then(module => ({ default: module.default })));
const Register = lazy(() => import("./pages/Register").then(module => ({ default: module.default })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(module => ({ default: module.default })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(module => ({ default: module.default })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const LexaiaPage = lazy(() => import("./pages/LexaiaPage").then(module => ({ default: module.default })));
const NotFound = lazy(() => import("./pages/NotFound").then(module => ({ default: module.default })));

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
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/project-detail/:id" element={<ProjectDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/lexaia" element={<LexaiaPage />} />
                <Route path="/admin/*" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
                {/* Test integration route - dev mode only */}
                <Route path="/admin-test" element={<PrivateRoute adminOnly><AdminTestIntegration /></PrivateRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
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
