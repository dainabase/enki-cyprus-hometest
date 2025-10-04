# 📊 Audit des Tables Supabase - Enki Reality

**Date:** 2025-10-04  
**Total tables:** 43

---

## 📈 Résumé Exécutif

| Catégorie | Nombre |
|-----------|---------|
| **Total tables** | 43 |
| **Tables utilisées** | ~28 |
| **Tables inutilisées** | ~15 |
| **Tables legacy/test** | 5 |

---

## ✅ Tables Actives (Utilisées dans le code)

### **Core Business (9 tables)**
| Table | Taille | Utilisation | Priorité |
|-------|--------|-------------|----------|
| `projects` | 488 kB | ✅ Haute (page projets, admin) | 🔴 Critique |
| `properties` | 320 kB | ✅ Haute (propriétés, admin) | 🔴 Critique |
| `buildings` | 176 kB | ✅ Haute (bâtiments, admin) | 🔴 Critique |
| `developers` | 104 kB | ✅ Moyenne (admin, affichage) | 🟠 Important |
| `leads` | 160 kB | ✅ Haute (CRM, contacts) | 🔴 Critique |
| `commissions` | 64 kB | ✅ Moyenne (gestion commissions) | 🟠 Important |
| `commission_payments` | 48 kB | ✅ Faible (paiements) | 🟡 Normal |
| `dossiers` | 16 kB | ✅ Moyenne (recherche agentique) | 🟠 Important |
| `promoters` | 32 kB | ✅ Moyenne (section promoteurs) | 🟠 Important |

### **Media & Documents (4 tables)**
| Table | Taille | Utilisation |
|-------|--------|-------------|
| `project_images` | 64 kB | ✅ Haute (galeries projets) |
| `building_images` | 32 kB | ✅ Haute (galeries bâtiments) |
| `project_documents` | 16 kB | ✅ Moyenne (documents PDF) |
| `project_ai_imports` | 32 kB | ✅ Faible (import IA) |

### **Amenities & Features (4 tables)**
| Table | Taille | Utilisation |
|-------|--------|-------------|
| `amenities_reference` | 80 kB | ✅ Haute (référentiel prestations) |
| `project_amenities` | 80 kB | ✅ Haute (prestations projets) |
| `nearby_amenities` | 80 kB | ✅ Haute (commodités à proximité) |
| `project_nearby_amenities` | 80 kB | ✅ Haute (liaison projet-commodités) |

### **User Management (3 tables)**
| Table | Taille | Utilisation |
|-------|--------|-------------|
| `profiles` | 64 kB | ✅ Haute (profils utilisateurs) |
| `user_roles` | 72 kB | ✅ Haute (rôles admin) |
| `notification_preferences` | 40 kB | ✅ Faible (préférences notifs) |

### **Analytics & Tracking (3 tables)**
| Table | Taille | Utilisation |
|-------|--------|-------------|
| `analytics_events` | 6016 kB | ✅ Très haute (tracking GA4) |
| `analytics_rate_limits` | 1976 kB | ✅ Moyenne (rate limiting) |
| `admin_audit_log` | 32 kB | ✅ Moyenne (logs admin) |

### **Drafts & Forms (5 tables)**
| Table | Taille | Utilisation |
|-------|--------|-------------|
| `project_drafts` | 224 kB | ✅ Haute (brouillons projets) |
| `building_drafts` | 32 kB | ✅ Moyenne (brouillons bâtiments) |
| `property_drafts` | 32 kB | ✅ Moyenne (brouillons propriétés) |
| `developer_drafts` | 56 kB | ✅ Moyenne (brouillons développeurs) |
| `contact_drafts` | 32 kB | ✅ Faible (brouillons contacts) |
| `lexaia_drafts` | 24 kB | ✅ Faible (brouillons Lexaia) |
| `registration_drafts` | 32 kB | ✅ Faible (brouillons inscription) |
| `search_drafts` | 24 kB | ✅ Faible (brouillons recherche) |

---

## ❌ Tables Inutilisées / À Nettoyer

### **Legacy / Test (5 tables)**
| Table | Taille | Raison | Action |
|-------|--------|--------|--------|
| `ab_test_assignments` | 48 kB | A/B testing non utilisé | 🗑️ Supprimer |
| `ab_tests` | 48 kB | A/B testing non utilisé | 🗑️ Supprimer |
| `amenities` | 48 kB | Doublon de `amenities_reference` | 🗑️ Supprimer |
| `component_library` | 96 kB | Bibliothèque UI non utilisée | 🗑️ Supprimer |
| `design_system_config` | 48 kB | Config design non utilisée | 🗑️ Supprimer |

### **CRM/Pipeline (3 tables)**
| Table | Taille | Statut | Action |
|-------|--------|--------|--------|
| `lead_activities` | 16 kB | Pipeline leads non implémenté | ⚠️ Vérifier utilité |
| `pipeline_stages` | 40 kB | Pipeline leads non implémenté | ⚠️ Vérifier utilité |
| `checklists` | 48 kB | Feature checklists non active | ⚠️ Vérifier utilité |

### **AI Config (2 tables)**
| Table | Taille | Statut | Action |
|-------|--------|--------|--------|
| `ai_agents_config` | 112 kB | Config IA centralisée | ⚠️ Vérifier utilité |
| `ai_agents_logs` | 16 kB | Logs agents IA | 📊 Garder si IA active |

### **Favorites (1 table)**
| Table | Taille | Statut | Action |
|-------|--------|--------|--------|
| `favorites` | 32 kB | Favoris utilisateurs | ⚠️ Feature non visible |

---

## 🎯 Recommandations

### Priorité 1: Nettoyage (Gain: ~300 kB)
```sql
-- Supprimer tables legacy
DROP TABLE IF EXISTS ab_test_assignments CASCADE;
DROP TABLE IF EXISTS ab_tests CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS component_library CASCADE;
DROP TABLE IF EXISTS design_system_config CASCADE;
```

### Priorité 2: Vérification Features
- [ ] **Favorites:** Activer la feature ou supprimer la table
- [ ] **Checklists:** Implémenter ou supprimer
- [ ] **Pipeline/Activities:** Décider du CRM complet ou simplifier

### Priorité 3: Optimisation
- [ ] **Analytics_events (6 MB):** Archiver les événements > 90 jours
- [ ] **Analytics_rate_limits (2 MB):** Nettoyer les anciennes entrées
- [ ] **Properties (320 kB):** Vérifier index et requêtes

---

## 📊 Utilisation par Catégorie

```
Core Business:     9 tables (21%)  ████████████████████
Media:             4 tables (9%)   ████████
Amenities:         4 tables (9%)   ████████
Users:             3 tables (7%)   ██████
Analytics:         3 tables (7%)   ██████
Drafts:            8 tables (19%)  ████████████████
Legacy/Unused:    12 tables (28%)  ██████████████████████████
```

---

## 🔐 Sécurité RLS

**Vérifications nécessaires:**
- ✅ `profiles`: RLS activé
- ✅ `user_roles`: RLS activé avec fonction `has_role()`
- ✅ `projects`: RLS public read
- ✅ `properties`: RLS authenticated
- ⚠️ Vérifier les tables `drafts` (RLS par session/user)

---

## 💾 Taille Totale Base

**Total estimé:** ~11 MB  
**Top 3 volumétrie:**
1. `analytics_events`: 6 MB (55%)
2. `analytics_rate_limits`: 2 MB (18%)
3. `projects`: 488 kB (4%)

---

**Conclusion:** 28 tables activement utilisées, 15 à nettoyer/vérifier. Gain potentiel: ~300 kB + simplification maintenance.
