-- ÉTAPE 2/3 : IMPORT DES DONNÉES AVEC VALIDATION DES CONTRAINTES
-- =======================================================

-- 1. IMPORT DEVELOPERS avec validation rating_score
INSERT INTO developers (
  id, name, logo, commission_rate, website, phone_numbers,
  email_primary, email_sales, email_marketing, main_city, 
  founded_year, years_experience, total_projects, rating_score,
  payment_terms, status, company_registration_number, vat_number,
  license_number, insurance_coverage, bank_guarantee,
  created_at, updated_at
)
SELECT 
  id, name, logo, 
  COALESCE(commission_rate, 5.0),
  website, 
  CASE 
    WHEN phone_numbers IS NOT NULL 
    THEN array_to_json(phone_numbers)::jsonb 
    ELSE '[]'::jsonb 
  END as phone_numbers,
  email_primary, email_sales, email_marketing, main_city,
  founded_year, years_experience, total_projects, 
  -- Validate rating_score: if null or > 10, set to NULL, otherwise keep value
  CASE 
    WHEN rating_score IS NULL OR rating_score > 10 THEN NULL
    WHEN rating_score < 0 THEN NULL
    ELSE rating_score 
  END as rating_score,
  payment_terms, 
  COALESCE(status, 'active'),
  company_registration_number, vat_number, license_number,
  insurance_coverage, 
  CASE WHEN bank_guarantee = true THEN 1000000 ELSE NULL END as bank_guarantee,
  created_at, updated_at
FROM backup_developers_20250119;