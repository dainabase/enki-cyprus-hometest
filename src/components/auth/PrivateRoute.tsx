import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, isAdmin, loading, profile } = useAuth();
  const location = useLocation();

  console.log('🔒 PrivateRoute check:', {
    path: location.pathname,
    isAuthenticated,
    isAdmin,
    loading,
    hasProfile: !!profile,
    adminOnly
  });

  // Show loading while auth is being determined
  if (loading) {
    console.log('🔒 PrivateRoute: Still loading authentication...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Only redirect if we're absolutely sure the user is not authenticated
  if (!loading && !isAuthenticated) {
    console.log('🔒 PrivateRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Block access to client space if profile flag is set
  if (!adminOnly && profile?.profile?.blockedClient) {
    console.log('🔒 PrivateRoute: Client blocked, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // For admin routes, wait for profile to load completely
  if (adminOnly && isAuthenticated && !profile) {
    console.log('🔒 PrivateRoute: Admin route, waiting for profile...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement du profil administrateur...</p>
        </div>
      </div>
    );
  }

  // Only check admin status after profile is loaded
  if (adminOnly && profile && !isAdmin) {
    console.log('🔒 PrivateRoute: Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('🔒 PrivateRoute: Access granted');
  return <>{children}</>;
};