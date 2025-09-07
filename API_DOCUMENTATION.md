# Documentation API

## Architecture Supabase

### Base de données PostgreSQL
Le système utilise Supabase comme backend avec Row Level Security (RLS) activé.

## Tables principales

### `developers`
Développeurs immobiliers
```sql
CREATE TABLE developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_info JSONB DEFAULT '{}',
  website TEXT,
  logo TEXT,
  commission_rate NUMERIC DEFAULT 3.00,
  payment_terms TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `projects`
Projets immobiliers
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES developers(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location JSONB NOT NULL,
  price NUMERIC NOT NULL,
  status TEXT DEFAULT 'under_construction',
  golden_visa_eligible BOOLEAN DEFAULT false,
  cyprus_zone TEXT DEFAULT 'limassol',
  completion_date TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  virtual_tour_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `buildings`
Bâtiments dans les projets
```sql
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  name TEXT NOT NULL,
  building_type TEXT DEFAULT 'residential',
  total_floors INTEGER DEFAULT 1,
  total_units INTEGER DEFAULT 1,
  construction_status TEXT DEFAULT 'planned',
  energy_rating TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `leads`
Prospects CRM
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  status VARCHAR DEFAULT 'new',
  source VARCHAR,
  property_type VARCHAR,
  zones TEXT[],
  budget_min NUMERIC,
  budget_max NUMERIC,
  urgency VARCHAR,
  golden_visa_interest BOOLEAN DEFAULT false,
  assigned_to UUID,
  score INTEGER DEFAULT 0,
  notes TEXT,
  last_contact_date DATE,
  status_changed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `commissions`
Commissions de vente
```sql
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  promoter_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  date TIMESTAMPTZ DEFAULT now(),
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Policies RLS

### Sécurité par rôles
```sql
-- Admins ont accès complet
CREATE POLICY "Admins can manage all" ON table_name 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Lecture publique pour certaines tables
CREATE POLICY "Public can view" ON projects 
FOR SELECT USING (true);

-- Utilisateurs gèrent leurs propres données
CREATE POLICY "Users manage own data" ON leads 
FOR ALL USING (assigned_to = auth.uid());
```

## Storage Buckets

### `property-images`
- **Public**: Oui
- **Taille max**: 10MB
- **Formats**: JPG, PNG, WebP
- **Structure**: `/project-id/image-name.jpg`

### `documents`
- **Public**: Non
- **Taille max**: 50MB
- **Formats**: PDF, DOC, XLS
- **Structure**: `/type/document-name.pdf`

## Fonctions Edge

### `agentic-search`
Recherche intelligente de propriétés
```typescript
POST /functions/v1/agentic-search
Body: {
  query: string,
  filters?: object,
  limit?: number
}
Response: {
  properties: Property[],
  suggestions: string[]
}
```

### `lexaia-call`
Génération de rapports AI
```typescript
POST /functions/v1/lexaia-call
Body: {
  properties: Property[],
  clientProfile: object
}
Response: {
  report: string,
  recommendations: string[]
}
```

## Requêtes communes

### Récupérer projets avec développeur
```javascript
const { data } = await supabase
  .from('projects')
  .select(`
    *,
    developers (name, logo),
    buildings (count)
  `)
  .eq('status', 'active');
```

### Leads avec pipeline
```javascript
const { data } = await supabase
  .from('leads')
  .select('*')
  .eq('assigned_to', userId)
  .order('created_at', { ascending: false });
```

### Calcul commissions
```javascript
const { data } = await supabase
  .from('commissions')
  .select(`
    *,
    projects (title, price),
    promoters (name)
  `)
  .gte('date', startDate)
  .lte('date', endDate);
```

## Triggers automatiques

### Calcul commission sur vente
```sql
CREATE TRIGGER calculate_commission_trigger
AFTER UPDATE ON projects
FOR EACH ROW
WHEN (NEW.status = 'sold' AND OLD.status != 'sold')
EXECUTE FUNCTION calculate_commission();
```

### Mise à jour timestamps
```sql
CREATE TRIGGER update_updated_at
BEFORE UPDATE ON {table}
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## Optimisations

### Index de performance
```sql
-- Recherche par zone
CREATE INDEX idx_projects_zone ON projects(cyprus_zone);

-- Filtrage par statut
CREATE INDEX idx_leads_status ON leads(status);

-- Tri par date
CREATE INDEX idx_commissions_date ON commissions(date DESC);
```

### Pagination optimisée
```javascript
const { data, count } = await supabase
  .from('table_name')
  .select('*', { count: 'exact' })
  .range(from, to)
  .order('created_at', { ascending: false });
```

## Sécurité

### Authentication
- JWT tokens via Supabase Auth
- Refresh automatique
- Logout sur expiration

### Authorization
- RLS sur toutes les tables sensibles
- Rôles : admin, sales, user
- Audit trail des actions admin

### Rate Limiting
- 100 requêtes/minute par utilisateur
- 1000 requêtes/heure par IP
- Protection DDoS intégrée