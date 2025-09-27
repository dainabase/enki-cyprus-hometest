import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ToastProvider } from "@/components/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { FilterProvider } from "@/contexts/FilterContext";
import { GoogleMapsProvider } from "@/contexts/GoogleMapsContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { NotificationProvider } from "@/components/NotificationProvider";
import { ConsentManager } from "@/components/ConsentManager";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import Layout from "@/components/layout/Layout";

// Pages
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Search from "@/pages/Search";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import AdminProjects from "@/pages/AdminProjects";
import AdminProjectForm from "@/pages/admin/AdminProjectForm";
import AdminProjectDetail from "@/pages/admin/AdminProjectDetail";
import AdminBuildings from "@/pages/admin/AdminBuildings";
import AdminBuildingDetail from "@/pages/admin/AdminBuildingDetail";
import AdminDevelopers from "@/pages/admin/AdminDevelopers";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminReports from "@/pages/admin/AdminReports";
import AdminTests from "@/pages/admin/AdminTests";
import AdminTestIntegration from "@/pages/admin/AdminTestIntegration";
import AdminAIImport from "@/pages/admin/AdminAIImport";
import AdminAIImportUnified from "@/pages/admin/AdminAIImportUnified";
import AdminUnits from "@/pages/admin/AdminUnits";
import PropertyForm from "@/pages/admin/PropertyForm";
import TestPage from "@/pages/admin/TestPage";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import LexaiaPage from "@/pages/LexaiaPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GoogleMapsProvider>
            <FilterProvider>
                <SearchProvider allProperties={[]}>
                  <NotificationProvider>
                    <ToastProvider>
                      <BrowserRouter>
                        <ConsentManager onConsentChange={() => {}} />
                        <Routes>
                          {/* Public routes */}
                          <Route path="/" element={<Layout><></></Layout>}>
                            <Route index element={<Home />} />
                            <Route path="projects" element={<Projects />} />
                            <Route path="projects/:slug" element={<ProjectDetail />} />
                            <Route path="search" element={<Search />} />
                            <Route path="about" element={<About />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="blog" element={<Blog />} />
                            <Route path="privacy" element={<PrivacyPolicy />} />
                            <Route path="lexaia" element={<LexaiaPage />} />
                          </Route>

                          {/* Auth routes */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />

                          {/* Protected routes */}
                          <Route
                            path="/dashboard"
                            element={
                              <PrivateRoute>
                                <Dashboard />
                              </PrivateRoute>
                            }
                          />

                          {/* Admin routes */}
                          <Route
                            path="/admin"
                            element={
                              <PrivateRoute adminOnly>
                                <Admin />
                              </PrivateRoute>
                            }
                          >
                            <Route index element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="projects" element={<AdminProjects />} />
                            <Route path="projects/new" element={<AdminProjectForm />} />
                            <Route path="projects/:id" element={<AdminProjectDetail />} />
                            <Route path="projects/:id/edit" element={<AdminProjectForm />} />
                            <Route path="buildings" element={<AdminBuildings />} />
                            <Route path="buildings/:id" element={<AdminBuildingDetail />} />
                            <Route path="developers" element={<AdminDevelopers />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="analytics" element={<AdminAnalytics />} />
                            <Route path="reports" element={<AdminReports />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="tests" element={<AdminTests />} />
                            <Route path="test-integration" element={<AdminTestIntegration />} />
                            <Route path="ai-import" element={<AdminAIImport />} />
                            <Route path="ai-import-unified" element={<AdminAIImportUnified />} />
                            <Route path="units" element={<AdminUnits />} />
                            <Route path="units/new" element={<PropertyForm />} />
                            <Route path="units/:id/edit" element={<PropertyForm />} />
                            <Route path="test" element={<TestPage />} />
                          </Route>

                          {/* 404 */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      <Toaster />
                    </BrowserRouter>
                  </ToastProvider>
                </NotificationProvider>
              </SearchProvider>
            </FilterProvider>
          </GoogleMapsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;