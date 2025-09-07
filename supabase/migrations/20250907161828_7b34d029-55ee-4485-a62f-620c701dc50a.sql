-- Ajout d'index pour améliorer les performances des requêtes fréquentes

-- Index sur les colonnes de recherche et filtrage les plus utilisées
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_cyprus_zone ON projects(cyprus_zone);
CREATE INDEX IF NOT EXISTS idx_projects_golden_visa ON projects(golden_visa_eligible);
CREATE INDEX IF NOT EXISTS idx_projects_price ON projects(price);
CREATE INDEX IF NOT EXISTS idx_projects_developer_id ON projects(developer_id);

CREATE INDEX IF NOT EXISTS idx_buildings_project_id ON buildings(project_id);
CREATE INDEX IF NOT EXISTS idx_buildings_construction_status ON buildings(construction_status);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_budget ON leads(budget_min, budget_max);

CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_promoter_id ON commissions(promoter_id);

-- Index composites pour les requêtes complexes
CREATE INDEX IF NOT EXISTS idx_projects_status_zone ON projects(status, cyprus_zone);
CREATE INDEX IF NOT EXISTS idx_leads_status_score ON leads(status, score);

-- Index pour l'ordre d'affichage
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);