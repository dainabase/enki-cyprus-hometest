import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ccsakftsslurjgnjwdci.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2FrZnRzc2x1cmpnbmp3ZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjQyNDIsImV4cCI6MjA3MjUwMDI0Mn0.HpJzpJC8d9H74Pqye-AoYIZWPLvT9iYNHx_4yeFrPnk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BASE_URL = 'https://enki-realty.com';

async function generateSitemap() {
  try {
    // Fetch all projects from Supabase
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, updated_at');

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/search', priority: '0.9', changefreq: 'daily' },
      { url: '/projects', priority: '0.9', changefreq: 'daily' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add project pages
    projects?.forEach(project => {
      const lastmod = project.updated_at ? new Date(project.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      sitemap += `
  <url>
    <loc>${BASE_URL}/project/${project.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    // Write sitemap to public directory
    fs.writeFileSync('public/sitemap.xml', sitemap);
    console.log(`Sitemap generated with ${projects?.length || 0} project pages`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();