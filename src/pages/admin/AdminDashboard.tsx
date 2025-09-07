import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { AdminProjects } from './AdminProjects';
import { AdminCommissions } from './AdminCommissions';
import { AdminUsers } from './AdminUsers';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminContent } from './AdminContent';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const { profile } = useAuth();

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-2">Accès Restreint</h2>
            <p className="text-secondary">
              Seuls les administrateurs peuvent accéder à cette section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PrivateRoute adminOnly>
      <div className="min-h-screen bg-muted/30">
        <SidebarProvider defaultOpen collapsedWidth={72}>
          <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <main className="flex-1 pt-16">
              <Routes>
                <Route path="" element={<AdminOverview />} />
                <Route path="overview" element={<AdminOverview />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="commissions" element={<AdminCommissions />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="*" element={<Navigate to="/admin/overview" replace />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </PrivateRoute>
  );
};