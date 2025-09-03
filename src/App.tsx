import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { FilterProvider } from "./contexts/FilterContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

console.log('🚀 App.tsx: Rendering App component');

const App = () => {
  console.log('🔄 App.tsx: App function called');
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FilterProvider>
          <BrowserRouter>
            <TooltipProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <Toaster />
            <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </FilterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
