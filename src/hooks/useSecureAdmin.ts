import { useAuth } from '@/contexts/AuthContext';
import { logAdminAction } from '@/lib/security';
import { useCallback } from 'react';

export const useSecureAdmin = () => {
  const { isAdmin, user } = useAuth();

  const logAction = useCallback(async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details: Record<string, any> = {}
  ) => {
    if (!isAdmin || !user) {
      console.warn('Attempted admin action without proper authorization');
      return;
    }

    await logAdminAction(action, resourceType, resourceId, {
      ...details,
      timestamp: new Date().toISOString(),
      user_email: user.email
    });
  }, [isAdmin, user]);

  const secureAction = useCallback(async <T>(
    action: () => Promise<T>,
    actionName: string,
    resourceType: string,
    resourceId?: string,
    details: Record<string, any> = {}
  ): Promise<T | null> => {
    if (!isAdmin) {
      throw new Error('Insufficient permissions: Admin access required');
    }

    try {
      const result = await action();
      await logAction(actionName, resourceType, resourceId, { 
        ...details, 
        status: 'success' 
      });
      return result;
    } catch (error) {
      await logAction(actionName, resourceType, resourceId, { 
        ...details, 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }, [isAdmin, logAction]);

  return {
    isAdmin,
    logAction,
    secureAction
  };
};