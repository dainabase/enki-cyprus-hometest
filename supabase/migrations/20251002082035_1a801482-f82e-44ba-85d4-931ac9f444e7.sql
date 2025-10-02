
-- ==================================================================
-- SECURITY FIX: Implement Proper Role-Based Access Control (Targeted)
-- ==================================================================

-- 1. Create the app_role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'sales', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- RLS: Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Create secure helper functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.is_sales(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'sales'::public.app_role);
$$;

-- 4. Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id,
  CASE 
    WHEN role = 'admin' THEN 'admin'::public.app_role
    WHEN role = 'sales' THEN 'sales'::public.app_role
    WHEN role = 'moderator' THEN 'moderator'::public.app_role
    ELSE 'user'::public.app_role
  END
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 5. Update get_current_user_role() function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY 
    CASE role
      WHEN 'admin'::public.app_role THEN 1
      WHEN 'sales'::public.app_role THEN 2
      WHEN 'moderator'::public.app_role THEN 3
      ELSE 4
    END
  LIMIT 1;
$$;

-- 6. Update can_access_leads() function
CREATE OR REPLACE FUNCTION public.can_access_leads()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin'::public.app_role, 'sales'::public.app_role)
  );
$$;

-- 7. Update RLS policies for existing tables only

-- ai_agents_config
DROP POLICY IF EXISTS "Admins can manage AI agents config" ON public.ai_agents_config;
CREATE POLICY "Admins can manage AI agents config"
  ON public.ai_agents_config FOR ALL TO public USING (public.is_admin());

-- ai_agents_logs
DROP POLICY IF EXISTS "Admins can view AI agents logs" ON public.ai_agents_logs;
CREATE POLICY "Admins can view AI agents logs"
  ON public.ai_agents_logs FOR SELECT TO public USING (public.is_admin());

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO public USING (public.is_admin());

-- buildings
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.buildings;
CREATE POLICY "Allow all for authenticated users"
  ON public.buildings FOR ALL TO public USING (auth.role() = 'authenticated'::text);

-- developers
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.developers;
CREATE POLICY "Allow all for authenticated users"
  ON public.developers FOR ALL TO public USING (auth.role() = 'authenticated'::text);

-- projects
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.projects;
CREATE POLICY "Allow all for authenticated users"
  ON public.projects FOR ALL TO public USING (auth.role() = 'authenticated'::text);

-- Deprecate profiles.role column
COMMENT ON COLUMN public.profiles.role IS 
  'DEPRECATED: Use user_roles table instead. Kept for backward compatibility only.';

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_sales(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_leads() TO authenticated;
