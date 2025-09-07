-- Fix tests: Golden Visa auto-flag, cleanup orphans, and enforce cascade relationships
BEGIN;

-- 1) Cleanup orphaned data so constraints & integrity checks pass
DELETE FROM public.buildings WHERE project_id IS NULL;
DELETE FROM public.projects WHERE developer_id IS NULL;

-- 2) Golden Visa automatic detection (>= €300,000)
CREATE OR REPLACE FUNCTION public.set_golden_visa_flag()
RETURNS trigger AS $$
BEGIN
  IF NEW.price IS NOT NULL AND NEW.price >= 300000 THEN
    NEW.golden_visa_eligible := true;
  ELSE
    NEW.golden_visa_eligible := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_set_golden_visa_flag ON public.projects;
CREATE TRIGGER trg_set_golden_visa_flag
BEFORE INSERT OR UPDATE OF price ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.set_golden_visa_flag();

-- Backfill existing rows
UPDATE public.projects
SET golden_visa_eligible = (price IS NOT NULL AND price >= 300000);

-- 3) Enforce FK with cascade: buildings → projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_buildings_project_id'
  ) THEN
    ALTER TABLE public.buildings
    ADD CONSTRAINT fk_buildings_project_id
    FOREIGN KEY (project_id) REFERENCES public.projects(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Projects → developers (keep nullable but enforce reference); set null on dev deletion
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_projects_developer_id'
  ) THEN
    ALTER TABLE public.projects
    ADD CONSTRAINT fk_projects_developer_id
    FOREIGN KEY (developer_id) REFERENCES public.developers(id)
    ON DELETE SET NULL;
  END IF;
END $$;

COMMIT;