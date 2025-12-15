import ReactGA from 'react-ga4';
import { supabase } from '@/integrations/supabase/client';

// Initialize Google Analytics
export const initGA = () => {
  const GA4_ID = import.meta.env.VITE_GA4_ID || '';
  if (GA4_ID) {
    ReactGA.initialize(GA4_ID);
    if (import.meta.env.DEV) {
      console.log('📊 Google Analytics initialized');
    }
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  ReactGA.send({ 
    hitType: 'pageview', 
    page: path,
    title: title || document.title
  });
  
  // Also track in Supabase for admin analytics
  trackCustomEvent('page_view', {
    page: path,
    title: title || document.title
  });
};

// Track custom events
export const trackCustomEvent = async (eventName: string, eventData: Record<string, any> = {}) => {
  // Track in GA4
  ReactGA.event(eventName, eventData);
  
  // Track in Supabase for admin dashboard with rate limiting
  try {
    const sessionId = getSessionId();
    
    // Import rate limiting functions
    const { checkAnalyticsRateLimit, updateRateLimit } = await import('./security');
    
    // Check rate limit (100 events per hour per session)
    const withinLimit = await checkAnalyticsRateLimit(undefined, sessionId, 100, 60);
    
    if (!withinLimit) {
      console.warn('Analytics rate limit exceeded for session:', sessionId);
      return;
    }

    await supabase.from('analytics_events').insert({
      event_name: eventName,
      event_data: eventData,
      session_id: sessionId,
      page_url: window.location.pathname,
      user_agent: navigator.userAgent,
    });

    // Update rate limit counter
    await updateRateLimit(undefined, sessionId);
  } catch (error) {
    console.error('Error tracking event to Supabase:', error);
  }
};

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Track conversion events
export const trackConversion = (conversionType: string, value?: number) => {
  trackCustomEvent('conversion', {
    conversion_type: conversionType,
    value: value,
    timestamp: new Date().toISOString()
  });
};

// Track search filters
export const trackSearchFilter = (filters: Record<string, any>) => {
  trackCustomEvent('search_filter_applied', filters);
};

// Track project interactions
export const trackProjectView = (projectId: string, projectTitle: string) => {
  trackCustomEvent('project_viewed', {
    project_id: projectId,
    project_title: projectTitle
  });
};

export const trackContactClick = (source: string) => {
  trackCustomEvent('contact_clicked', { source });
};

export const trackLexaiaCalculation = (result: any) => {
  trackCustomEvent('lexaia_calculated', { result });
};

export const trackCommissionTriggered = (data: {
  project_id: string;
  amount: number;
  promoter_id: string;
  conversion_type: string;
}) => {
  trackCustomEvent('commission_triggered', data);
};