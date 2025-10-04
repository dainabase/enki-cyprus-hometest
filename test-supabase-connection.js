#!/usr/bin/env node

/**
 * Script de Test de Connexion Supabase
 * Vérifie que l'application se connecte bien à la base de production
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ccsakftsslurjgnjwdci.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2FrZnRzc2x1cmpnbmp3ZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjQyNDIsImV4cCI6MjA3MjUwMDI0Mn0.HpJzpJC8d9H74Pqye-AoYIZWPLvT9iYNHx_4yeFrPnk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔍 TEST DE CONNEXION SUPABASE\n');
  console.log(`📍 URL: ${SUPABASE_URL}\n`);

  try {
    // Test 1: Compter les projets
    console.log('Test 1: Nombre de projets...');
    const { data: projectCount, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;
    console.log(`✅ Nombre de projets: ${projectCount?.length || 0}`);
    console.log(`   Attendu: 4 projets\n`);

    // Test 2: Lister les projets
    console.log('Test 2: Liste des projets...');
    const { data: projects, error: listError } = await supabase
      .from('projects')
      .select('title, location, url_slug')
      .order('title');

    if (listError) throw listError;
    console.log(`✅ Projets trouvés:`);
    projects?.forEach((p, i) => {
      const city = p.location?.city || 'N/A';
      console.log(`   ${i + 1}. ${p.title} (${city})`);
    });
    console.log('');

    // Test 3: Vérifier les tables critiques
    console.log('Test 3: Tables critiques...');
    const tables = ['developers', 'buildings', 'properties', 'leads', 'commissions'];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ Table ${table}: INTROUVABLE`);
      } else {
        console.log(`   ✅ Table ${table}: OK`);
      }
    }
    console.log('');

    // Résumé
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (projects?.length === 4) {
      console.log('✅ CONNEXION RÉUSSIE - Base de Production');
      console.log('   L\'application utilise la bonne base Supabase');
      process.exit(0);
    } else {
      console.log('⚠️  ATTENTION - Connexion Partielle');
      console.log(`   Seulement ${projects?.length || 0} projet(s) trouvé(s) au lieu de 4`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ ERREUR DE CONNEXION:', error.message);
    process.exit(1);
  }
}

testConnection();
