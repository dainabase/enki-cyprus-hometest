// ensure-project-photos: Ensure each project has at least N photos by uploading reliable stock images to Supabase Storage
// Uses Picsum stable IDs to avoid upstream 503s and stores files in the public "media" bucket

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnsureOptions {
  minPhotos?: number;
  limit?: number; // optional cap on number of projects to process
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Authenticated client (to identify caller)
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('Authorization') || '' } },
    });

    // Admin client (to bypass RLS for updates/uploads)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Verify caller is admin
    const { data: userRes, error: userErr } = await authClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { data: profile, error: profileErr } = await authClient
      .from('profiles')
      .select('role')
      .eq('id', userRes.user.id)
      .single();

    if (profileErr || profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const body: EnsureOptions = await req.json().catch(() => ({}));
    const minPhotos = Math.max(1, Math.min(body.minPhotos ?? 4, 12));
    const limit = body.limit && body.limit > 0 ? body.limit : undefined;

    // Fetch projects
    let query = admin.from('projects').select('id, photos, title, type, location').order('created_at', { ascending: false });
    if (limit) {
      query = query.range(0, limit - 1);
    }
    const { data: projects, error: projErr } = await query;
    if (projErr) throw projErr;

    const picsumIds = [10, 12, 14, 16, 24, 29, 33, 37, 42, 45, 47, 51, 55, 60, 64, 68, 70, 72, 75, 77, 82, 86, 88, 90, 91, 95, 100, 101, 102, 103];
    const updated: Array<{ id: string; added: number }> = [];
    let processed = 0;

    for (const project of projects || []) {
      processed += 1;
      const current: string[] = Array.isArray(project.photos) ? project.photos : [];
      const need = minPhotos - current.length;
      if (need <= 0) continue;

      const seed = hashString(project.id);
      const newlyAdded: string[] = [];

      for (let i = 0; i < need; i++) {
        const idIndex = (seed + i) % picsumIds.length;
        const picId = picsumIds[idIndex];
        const srcUrl = `https://picsum.photos/id/${picId}/1280/853.jpg`;

        try {
          const resp = await fetch(srcUrl, { headers: { 'User-Agent': 'enki-realty/ensure-project-photos' } });
          if (!resp.ok) {
            console.warn('Upstream fetch failed', srcUrl, resp.status);
            continue;
          }
          const arrayBuf = await resp.arrayBuffer();
          const filePath = `projects-seed/${project.id}/img-${Date.now()}-${i}.jpg`;

          const { error: upErr } = await admin.storage.from('media').upload(
            filePath,
            new Blob([arrayBuf], { type: 'image/jpeg' }),
            { upsert: true, contentType: 'image/jpeg', cacheControl: '3600' }
          );
          if (upErr) {
            console.warn('Upload failed', upErr.message);
            continue;
          }

          const { data: pub } = admin.storage.from('media').getPublicUrl(filePath);
          if (pub?.publicUrl) newlyAdded.push(pub.publicUrl);
        } catch (e) {
          console.warn('Seed image step failed', e);
        }
      }

      if (newlyAdded.length > 0) {
        const nextPhotos = [...current, ...newlyAdded];
        const { error: updErr } = await admin
          .from('projects')
          .update({ photos: nextPhotos })
          .eq('id', project.id);
        if (!updErr) {
          updated.push({ id: project.id, added: newlyAdded.length });
        } else {
          console.warn('DB update failed for project', project.id, updErr.message);
        }
      }
    }

    return new Response(
      JSON.stringify({ processed, updated: updated.length, details: updated, minPhotos }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (e: any) {
    console.error('ensure-project-photos error', e?.message || e);
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});