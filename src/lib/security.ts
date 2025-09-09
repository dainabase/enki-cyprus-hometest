import { supabase } from '@/integrations/supabase/client';

// Rate limiting for analytics events
export const checkAnalyticsRateLimit = async (
  userId?: string,
  sessionId?: string,
  limit: number = 100,
  windowMinutes: number = 60
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_user_id: userId || null,
      p_session_id: sessionId || null,
      p_limit: limit,
      p_window_minutes: windowMinutes
    });

    if (error) {
      console.error('Rate limit check failed:', error);
      return false; // Fail closed - deny if we can't check
    }

    return data;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return false;
  }
};

// Update rate limit counter
export const updateRateLimit = async (
  userId?: string,
  sessionId?: string
): Promise<void> => {
  try {
    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - (windowStart.getMinutes() % 60), 0, 0);

    const { error } = await supabase
      .from('analytics_rate_limits')
      .upsert({
        user_id: userId || null,
        session_id: sessionId || null,
        event_count: 1,
        window_start: windowStart.toISOString()
      }, {
        onConflict: 'user_id,session_id,window_start',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Failed to update rate limit:', error);
    }
  } catch (error) {
    console.error('Rate limit update error:', error);
  }
};

// Admin action logging
export const logAdminAction = async (
  action: string,
  resourceType: string,
  resourceId?: string,
  details: Record<string, any> = {}
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('log_admin_action', {
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId || null,
      p_details: details
    });

    if (error) {
      console.error('Failed to log admin action:', error);
    }
  } catch (error) {
    console.error('Admin action logging error:', error);
  }
};

// Input sanitization utilities
export const sanitizeString = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const sanitizeHTML = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate UUID format
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Admin audit log retrieval
export const getAuditLogs = async (
  limit: number = 100,
  offset: number = 0
): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc('get_audit_logs', {
      p_limit: limit,
      p_offset: offset
    });

    if (error) {
      console.error('Failed to retrieve audit logs:', error);
      throw new Error('Access denied or failed to retrieve audit logs');
    }

    return data || [];
  } catch (error) {
    console.error('Audit log retrieval error:', error);
    throw error;
  }
};

// Security headers for API requests
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};