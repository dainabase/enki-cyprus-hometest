import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  profile: {
    name?: string;
    country?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile['profile']>) => Promise<{ error: Error | null }>;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from profiles table
  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        setProfile(null);
      } else if (data) {
        setProfile({
          ...data,
          role: data.role as 'admin' | 'user',
          profile: (data.profile as any) || {}
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let initialLoadComplete = false;
    
    console.log('🔐 AuthContext: Initializing authentication...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      console.log('🔐 Auth state changed:', event, nextSession?.user?.email);

      if (!mounted) return;

      // Only update state after initial load is complete OR if this is a real auth event
      if (initialLoadComplete || event !== 'INITIAL_SESSION') {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);

        if (nextSession?.user && mounted) {
          // Defer profile loading to avoid deadlocks
          setTimeout(async () => {
            if (mounted) {
              await fetchProfile(nextSession.user!.id);
            }
          }, 100);
        } else {
          setProfile(null);
          if (mounted) {
            setLoading(false);
          }
        }
      }
    });

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log('🔐 AuthContext: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('❌ AuthContext: Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('🔐 AuthContext: Initial session found:', !!session?.user);
        
        setSession(session);
        setUser(session?.user ?? null);
        initialLoadComplete = true;

        if (session?.user && mounted) {
          // Load profile for existing session
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ AuthContext: Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      console.log('🔐 AuthContext: Cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        setUser(null);
        setSession(null);
        setProfile(null);
      }

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile['profile']>) => {
    if (!user) {
      return { error: new Error('Utilisateur non connecté') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          profile: { ...profile?.profile, ...updates }
        })
        .eq('id', user.id);

      if (error) {
        return { error: new Error(error.message) };
      }

      // Refresh profile
      await fetchProfile(user.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isAuthenticated = !!user && !!session;

  const contextValue: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};