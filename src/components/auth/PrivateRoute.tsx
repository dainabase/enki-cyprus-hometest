import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

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

  logger.info('🔒 PrivateRoute check:', {
    path: location.pathname,
    isAuthenticated,
    isAdmin,
    loading,
    hasProfile: !!profile,
    adminOnly
  });

  // Show loading while auth is being determined
  if (loading) {
    logger.info('🔒 PrivateRoute: Still loading authentication...');
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
    logger.info('🔒 PrivateRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Block access to client space if profile flag is set (optional feature)
  if (!adminOnly && profile?.profile?.blockedClient) {
    logger.info('🔒 PrivateRoute: Client blocked, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // For admin routes, wait for profile to load completely
  if (adminOnly && isAuthenticated && !profile) {
    logger.info('🔒 PrivateRoute: Admin route, waiting for profile...');
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
    logger.info('🔒 PrivateRoute: Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  logger.info('🔒 PrivateRoute: Access granted');
  return <>{children}</>;
};