import { supabase } from '@/integrations/supabase/client';

export interface CriticalIssue {
  id: string;
  type: 'error' | 'warning';
  category: 'database' | 'ui' | 'performance' | 'security';
  title: string;
  description: string;
  fix?: () => Promise<void>;
  fixed?: boolean;
}

export const criticalIssues: CriticalIssue[] = [
  {
    id: 'missing-test-data',
    type: 'warning',
    category: 'database',
    title: 'Pas de données de test',
    description: 'La base de données est vide. Générer des données de test pour valider les fonctionnalités.',
    fix: async () => {
      // Import and run test data generation
      const { generateTestData } = await import('./testDataGenerator');
      await generateTestData();
    }
  },
  {
    id: 'three-js-errors',
    type: 'error', 
    category: 'ui',
    title: 'Erreurs Three.js Runtime',
    description: 'Les composants 3D causent des erreurs. Remplacés par des alternatives statiques.',
    fixed: true
  },
  {
    id: 'supabase-security',
    type: 'warning',
    category: 'security', 
    title: 'Protection mot de passe désactivée',
    description: 'La protection contre les mots de passe divulgués est désactivée dans Supabase.',
  },
  {
    id: 'missing-indexes',
    type: 'warning',
    category: 'performance',
    title: 'Index de recherche manquants',
    description: 'Ajouter des index sur les colonnes fréquemment filtrées pour améliorer les performances.',
  }
];

export async function detectCriticalIssues(): Promise<CriticalIssue[]> {
  const issues: CriticalIssue[] = [...criticalIssues];

  try {
    // Check if test data exists
    const { data: devCount } = await supabase
      .from('developers')
      .select('count')
      .limit(1);
    
    const { data: buildCount } = await supabase
      .from('buildings')
      .select('count')
      .limit(1);

    if (!devCount || devCount.length === 0 || !buildCount || buildCount.length === 0) {
      issues.find(i => i.id === 'missing-test-data')!.type = 'error';
    }

  } catch (error) {
    issues.push({
      id: 'database-connection',
      type: 'error',
      category: 'database',
      title: 'Erreur de connexion base de données',
      description: `Impossible de se connecter à Supabase: ${error}`,
    });
  }

  return issues.filter(issue => !issue.fixed);
}

export async function fixCriticalIssue(issueId: string): Promise<boolean> {
  const issue = criticalIssues.find(i => i.id === issueId);
  
  if (!issue || !issue.fix) {
    return false;
  }

  try {
    await issue.fix();
    issue.fixed = true;
    return true;
  } catch (error) {
    console.error(`Failed to fix issue ${issueId}:`, error);
    return false;
  }
}

export function generateIssuesReport(issues: CriticalIssue[]): string {
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');

  return `
=== RAPPORT PROBLÈMES CRITIQUES ===

🚨 ERREURS CRITIQUES (${errors.length}) :
${errors.map(e => `- ${e.title}: ${e.description}`).join('\n')}

⚠️ WARNINGS (${warnings.length}) :
${warnings.map(w => `- ${w.title}: ${w.description}`).join('\n')}

📊 RÉSUMÉ :
- Total problèmes : ${issues.length}
- Erreurs bloquantes : ${errors.length}
- Warnings : ${warnings.length}
- Corrigibles automatiquement : ${issues.filter(i => i.fix).length}

${errors.length === 0 ? '✅ Aucune erreur critique détectée' : '❌ Des erreurs critiques nécessitent une correction'}
  `;
}