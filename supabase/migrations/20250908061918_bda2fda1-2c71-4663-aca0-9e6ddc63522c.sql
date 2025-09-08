-- Add property_types array to projects for multi-type support
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS property_types text[] DEFAULT ARRAY[]::text[];