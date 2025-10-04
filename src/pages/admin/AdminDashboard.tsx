import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import direct pour AdminOverview pour éviter les problèmes
import { AdminOverview } from './AdminOverview';

// Lazy load admin pages avec gestion d'erreur simplifiée
const AdminDevelopers = lazy(() => import('./AdminDevelopers'));
const AdminProjects = lazy(() => import('./AdminProjects'));
const AdminBuildings = lazy(() => import('./AdminBuildings'));
const NewBuilding = lazy(() => import('./buildings/new'));
const EditBuilding = lazy(() => import('./buildings/[id]/edit'));
const AdminProperties = lazy(() => import('./AdminProperties'));
const AdminPropertyForm = lazy(() => import('./AdminPropertyForm'));
const AdminProjectForm = lazy(() => import('./AdminProjectForm'));
const AdminProjectDetail = lazy(() => import('./AdminProjectDetail'));
const ProjectDashboard = lazy(() => import('./projects/[id]/dashboard'));
const AdminUnits = lazy(() => import('./AdminUnits'));
const AdminCommissions = lazy(() => 
  import('./AdminCommissions').then(module => ({
    default: module.AdminCommissions || module.default
  }))
);
const AdminSettings = lazy(() => import('./AdminSettings'));
const AdminAnalytics = lazy(() => import('./AdminAnalytics'));
const AdminPredictions = lazy(() => import('./AdminPredictions'));
const AdminSegmentation = lazy(() => import('./AdminSegmentation'));
const AdminPerformance = lazy(() => import('./AdminPerformance'));
const AdminDocumentation = lazy(() => import('./AdminDocumentation'));
const AdminContent = lazy(() => import('./AdminContent'));
const AdminLeads = lazy(() => import('./AdminLeads'));
const AdminPipeline = lazy(() => import('./AdminPipeline'));
const AdminReports = lazy(() => import('./AdminReports'));
const AdminTests = lazy(() => import('./AdminTests'));

const AdminHeader = () => (
  <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="flex h-full items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <a
          href="/"
          className="text-xl font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-tight"
        >
          ENKI-REALTY
        </a>
        <span className="text-muted-foreground">|</span>
        <span className="text-sm text-muted-foreground font-medium">Admin Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Retour au site
        </a>
      </div>
    </div>
  </header>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <LoadingSpinner />
  </div>
);

const AdminDashboard = () => {
  const { profile } = useAuth();

  // La vérification des droits d'accès est déjà faite par PrivateRoute
  // Ce composant ne sera rendu que si l'utilisateur est admin

  return (
    <PrivateRoute adminOnly>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />

          <div className="flex flex-1 flex-col">
            <AdminHeader />

            <main className="flex-1 overflow-auto p-6">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<AdminOverview />} />
                  <Route path="developers" element={<AdminDevelopers />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="buildings" element={<AdminBuildings />} />
                  <Route path="buildings/new" element={<NewBuilding />} />
                  <Route path="buildings/:id/edit" element={<EditBuilding />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="properties/new" element={<AdminPropertyForm />} />
                  <Route path="properties/:id/edit" element={<AdminPropertyForm />} />
                  <Route path="projects/new" element={<AdminProjectForm />} />
                  <Route path="projects/:id" element={<AdminProjectDetail />} />
                  <Route path="projects/:id/edit" element={<AdminProjectForm />} />
                  <Route path="projects/:id/dashboard" element={<ProjectDashboard />} />
                  <Route path="units" element={<AdminUnits />} />
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="pipeline" element={<AdminPipeline />} />
                  <Route path="commissions" element={<AdminCommissions />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="predictions" element={<AdminPredictions />} />
                  <Route path="segmentation" element={<AdminSegmentation />} />
                  <Route path="performance" element={<AdminPerformance />} />
                  <Route path="documentation" element={<AdminDocumentation />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="settings" element={<AdminSettings />} />
                  {process.env.NODE_ENV === 'development' && (
                    <Route path="tests" element={<AdminTests />} />
                  )}
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </PrivateRoute>
  );
};

export default AdminDashboard;
