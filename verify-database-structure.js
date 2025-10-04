#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://ccsakftsslurjgnjwdci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2FrZnRzc2x1cmpnbmp3ZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjQyNDIsImV4cCI6MjA3MjUwMDI0Mn0.HpJzpJC8d9H74Pqye-AoYIZWPLvT9iYNHx_4yeFrPnk"
);

async function verify() {
  console.log('📊 AUDIT DE LA BASE DE DONNÉES\n');

  // 1. Lister TOUTES les tables
  const { data: tables, error: tablesError } = await supabase
    .rpc('get_all_tables');

  // Workaround: Essayer de requêter des tables connues
  const knownTables = ['projects', 'developers', 'buildings', 'properties', 'leads'];

  console.log('1️⃣  TABLES DISPONIBLES:\n');
  for (const tableName of knownTables) {
    const { error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`   ✅ ${tableName}`);
    }
  }

  // 2. Contenu de la table projects
  console.log('\n2️⃣  CONTENU TABLE PROJECTS:\n');
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .limit(10);

  if (projectsError) {
    console.log(`   ❌ Erreur: ${projectsError.message}`);
  } else {
    console.log(`   📦 Nombre de projets: ${projects?.length || 0}`);
    if (projects && projects.length > 0) {
      console.log(`   🔑 Colonnes disponibles: ${Object.keys(projects[0]).join(', ')}`);
      console.log('\n   📋 Projets:');
      projects.forEach((p, i) => {
        console.log(`      ${i + 1}. ${JSON.stringify(p, null, 2)}`);
      });
    } else {
      console.log('   ⚠️  La table est VIDE');
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Audit terminé');
}

verify().catch(console.error);
