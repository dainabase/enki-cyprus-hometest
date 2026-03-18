import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Shared JWT verification for all Edge Functions.
 * 
 * Usage in any Edge Function:
 * ```ts
 * import { verifyAuth, createAuthenticatedClient } from '../_shared/auth.ts';
 * 
 * // Option 1: Just verify JWT exists
 * const authResult = verifyAuth(req);
 * if (authResult.error) return authResult.error;
 * 
 * // Option 2: Get authenticated Supabase client (respects RLS)
 * const { client, error } = createAuthenticatedClient(req);
 * if (error) return error;
 * ```
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

interface AuthResult {
  authHeader: string;
  error: Response | null;
}

interface AuthClientResult {
  client: ReturnType<typeof createClient> | null;
  authHeader: string;
  error: Response | null;
}

/**
 * Verify that a valid Authorization header is present.
 * Does NOT validate the JWT signature (Supabase handles that via RLS).
 * Returns the auth header string for forwarding to Supabase client.
 */
export function verifyAuth(req: Request): AuthResult {
  const authHeader = req.headers.get('Authorization') || '';
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authHeader: '',
      error: new Response(
        JSON.stringify({ 
          error: 'Authorization header requis',
          hint: 'Incluez un header Authorization: Bearer <votre_jwt>'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    };
  }

  return { authHeader, error: null };
}

/**
 * Create a Supabase client authenticated with the user's JWT.
 * This ensures all queries respect Row Level Security policies.
 */
export function createAuthenticatedClient(req: Request): AuthClientResult {
  const { authHeader, error } = verifyAuth(req);
  if (error) return { client: null, authHeader: '', error };

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      client: null,
      authHeader,
      error: new Response(
        JSON.stringify({ error: 'Configuration Supabase manquante' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader }
    }
  });

  return { client, authHeader, error: null };
}

/**
 * Create a Supabase client with SERVICE_ROLE_KEY (bypasses RLS).
 * Use ONLY for admin operations like logging analytics events.
 */
export function createServiceClient(): ReturnType<typeof createClient> | null {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceKey) return null;

  return createClient(supabaseUrl, serviceKey);
}
