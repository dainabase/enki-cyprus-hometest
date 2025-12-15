# 🔧 PROMPT DE CORRECTION POUR BOLT - CONNEXION SUPABASE

**Date :** 4 octobre 2025  
**Problème :** Bolt est connecté à une mauvaise base de données

---

## 🎯 CONSTAT

**Ce que Bolt voit actuellement :**
- 1 seul projet : "Marina Bay Residences"
- 1 seule table `projects`
- 15 colonnes dans `projects`

**Ce qui existe RÉELLEMENT dans la vraie base :**
- **4 projets :** Azure Marina Paradise, Mountain View Villas, Skyline Tower, Marina Bay Residences
- **42 tables :** developers, projects, buildings, properties, leads, commissions, etc.
- **219 colonnes dans `projects`**

---

## ⚠️ CONCLUSION

**Bolt est connecté à une base temporaire/de développement**, PAS à la base de production Supabase.

---

## 📋 PROMPT POUR BOLT

Copie-colle ce prompt à Bolt :

```markdown
# 🔍 CORRECTION CONNEXION BASE DE DONNÉES

## PROBLÈME IDENTIFIÉ

Tu es actuellement connecté à une **mauvaise base de données**.

**Preuve :** Tu ne vois que 1 projet (Marina Bay Residences), mais la vraie base en contient 4 :
1. Azure Marina Paradise (Germasogeia)
2. Mountain View Villas (Limassol Hills)
3. Skyline Tower (Nicosia)
4. Marina Bay Residences (Limassol)

## BASE DE DONNÉES CIBLE

Tu dois te connecter à la base Supabase **PRODUCTION** :

```
Project ID: ccsakftsslurjgnjwdci
URL: https://ccsakftsslurjgnjwdci.supabase.co
```

## VÉRIFICATION IMMÉDIATE

Exécute cette requête SQL pour vérifier ta connexion :

```sql
SELECT 
  title,
  city,
  url_slug
FROM projects 
ORDER BY created_at DESC;
```

**Résultat attendu si tu es sur la BONNE base :**

| title | city | url_slug |
|-------|------|----------|
| Azure Marina Paradise | Germasogeia | azure-marina-paradise-limassol |
| Mountain View Villas | Limassol Hills | mountain-view-villas-limassol |
| Skyline Tower | Nicosia | skyline-tower-nicosia |
| Marina Bay Residences | Limassol | marina-bay-residences-limassol |

**Si tu vois autre chose :** Tu es sur la mauvaise base !

## STRUCTURE ATTENDUE

Après correction, tu dois voir :

```sql
-- Nombre de tables
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
-- Résultat attendu : 42

-- Nombre de colonnes dans projects
SELECT COUNT(*) FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'projects';
-- Résultat attendu : 219
```

## CONFIGURATION REQUISE

Vérifie que tes MCP Tools "Bolt Database" utilisent bien ces credentials :

```
SUPABASE_URL=https://ccsakftsslurjgnjwdci.supabase.co
SUPABASE_ANON_KEY=[clé fournie dans le .env du projet]
```

⚠️ **NE PAS** utiliser la base temporaire `0ec90b57d6e95fcbda19832f.supabase.co`

## ACTION REQUISE

1. ✅ Exécute la requête de vérification ci-dessus
2. ✅ Montre-moi les résultats
3. ✅ Si tu ne vois pas les 4 projets, **STOP** et demande de l'aide pour reconfigurer la connexion
4. ❌ **NE FAIS AUCUNE MIGRATION** tant que tu n'es pas sur la bonne base

## CHECKLIST DE VALIDATION

- [ ] Je vois 4 projets dans la table `projects`
- [ ] Je vois 42 tables dans le schema public
- [ ] La table `projects` a 219 colonnes
- [ ] Je vois les tables : developers, buildings, properties, leads, commissions

**Si tous les ✅ sont cochés :** Tu es sur la bonne base, tu peux travailler.

**Si un seul ❌ apparaît :** STOP, tu es sur la mauvaise base.
```

---

## 🔐 CREDENTIALS À VÉRIFIER

Bolt doit utiliser les credentials du fichier `.env` du projet :

```bash
VITE_SUPABASE_URL=https://ccsakftsslurjgnjwdci.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ ATTENTION :** Ces variables commencent par `VITE_` car c'est pour l'app React.

Les MCP Tools de Bolt utilisent probablement d'autres noms de variables comme :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `DATABASE_URL`

Il faut vérifier que Bolt pointe vers `ccsakftsslurjgnjwdci`, pas vers `0ec90b57d6e95fcbda19832f`.

---

## 📊 COMPARAISON DES BASES

| Caractéristique | Base TEMPORAIRE (mauvaise) | Base PRODUCTION (correcte) |
|-----------------|----------------------------|----------------------------|
| **URL** | `0ec90b57d6e95fcbda19832f.supabase.co` | `ccsakftsslurjgnjwdci.supabase.co` |
| **Projets** | 1 (Marina Bay seul) | 4 (tous les projets) |
| **Tables** | 1 | 42 |
| **Colonnes projects** | 15 | 219 |
| **Données** | Test minimal | Production complète |

---

## ✅ VALIDATION FINALE

Après avoir corrigé la connexion, Bolt doit exécuter ceci et te montrer les résultats :

```sql
-- 1. Lister tous les projets
SELECT id, title, city FROM projects ORDER BY created_at DESC;

-- 2. Compter les tables
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';

-- 3. Compter les colonnes de projects
SELECT COUNT(*) as column_count FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'projects';

-- 4. Vérifier la présence des tables principales
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('developers', 'projects', 'buildings', 'properties', 'leads', 'commissions')
ORDER BY table_name;
```

**Résultats attendus :**
1. 4 projets listés
2. 42 tables
3. 219 colonnes
4. Les 6 tables principales présentes

---

**Créé par :** Claude (MCP Diagnostic)  
**Dernière mise à jour :** 4 octobre 2025
