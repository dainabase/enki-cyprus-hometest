// supabase/functions/backfill-project-images/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface BackfillOptions {
  minPhotos?: number; // ensure at least this many
  onlyMissing?: boolean; // if true, skip projects that already meet min
  limit?: number; // max projects to process
}

// Utility to build query keywords from a project
function buildKeywords(project: any): string[] {
  const type = (project.type || '').toLowerCase();
  const features: string[] = Array.isArray(project.features) ? project.features : [];
  const city = project.location?.city || '';

  const kw = [city, 'Cyprus'];

  switch (type) {
    case 'villa':
    case 'maison':
      kw.push('villa', 'luxury', 'modern');
      break;
    case 'penthouse':
      kw.push('penthouse', 'rooftop', 'modern apartment');
      break;
    case 'commercial':
      kw.push('commercial building', 'office');
      break;
    default:
      kw.push('apartment', 'interior');
  }

  const f = features.map((s) => s.toLowerCase());
  if (f.some((x) => x.includes('piscine') || x.includes('pool'))) kw.push('swimming pool');
  if (f.some((x) => x.includes('vue mer') || x.includes('sea'))) kw.push('sea view', 'coast');
  if (f.some((x) => x.includes('jardin') || x.includes('garden'))) kw.push('garden');
  if (f.some((x) => x.includes('montagne') || x.includes('mountain'))) kw.push('mountain view');
  if (f.some((x) => x.includes('luxe') || x.includes('luxury'))) kw.push('luxury');

  // Ensure uniqueness and remove empties
  return Array.from(new Set(kw.filter(Boolean)));
}

async function fetchAndUploadImage(
  srcUrl: string,
  supabase: any,
  bucket: string,
  path: string,
): Promise<{ publicUrl: string } | null> {
  try {
    const res = await fetch(srcUrl, {
      headers: {
        'User-Agent': 'ENKI-REALTY-Backfill/1.0',
        'Accept': 'image/*,*/*;q=0.8',
        'Referer': '',
      },
      redirect: 'follow',
    });
    if (!res.ok || !res.body) {
      console.warn('Upstream image fetch failed', srcUrl, res.status);
      return null;
    }
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();
    const file = new Uint8Array(arrayBuffer);

    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
      contentType,
      upsert: true,
    });
    if (upErr) {
      console.error('Upload error', upErr.message);
      return null;
    }
    const url = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/${bucket}/${path}`;
    return { publicUrl: url };
  } catch (e) {
    console.error('fetchAndUploadImage error', e);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const admin = createClient(supabaseUrl, serviceKey);
    // Client bound to caller's JWT to know who is calling
    const authed = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization') || '' } },
    });

    // Verify requester is authenticated and admin
    const { data: userData, error: userErr } = await authed.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: profile, error: profErr } = await admin
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .maybeSingle();
    if (profErr) {
      console.error('Profile fetch error', profErr.message);
      return new Response(JSON.stringify({ error: 'Profile fetch failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body: BackfillOptions = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const minPhotos = Math.max(3, body.minPhotos ?? 3);
    const onlyMissing = body.onlyMissing ?? true;
    const limit = body.limit ?? 200;

    // Load projects
    const { data: projects, error: projErr } = await admin
      .from('projects')
      .select('id, type, features, location, photos, title')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (projErr) throw projErr;

    const bucket = 'media';
    let processed = 0;
    const results: any[] = [];

    for (const project of projects || []) {
      const currentPhotos: string[] = Array.isArray(project.photos) ? project.photos : [];
      const existingStorage = currentPhotos.filter((p) => p.includes('/storage/v1/object/public/'));
      if (onlyMissing && existingStorage.length >= minPhotos) {
        results.push({ id: project.id, skipped: true, reason: 'already has photos' });
        continue;
      }

      const needed = Math.max(0, minPhotos - existingStorage.length);
      const keywords = buildKeywords(project);
      const search = encodeURIComponent(keywords.join(','));

      const newUrls: string[] = [];
      for (let i = 0; i < (needed || minPhotos); i++) {
        const sig = `${i}-${project.id.substring(0, 8)}`;
        const src = `https://source.unsplash.com/1280x853/?${search}&sig=${sig}`;
        const path = `projects/${project.id}/photo-${Date.now()}-${i}.jpg`;
        const uploaded = await fetchAndUploadImage(src, admin, bucket, path);
        if (uploaded?.publicUrl) newUrls.push(uploaded.publicUrl);
        // small delay to vary randomization
        await new Promise((r) => setTimeout(r, 120));
      }

      const updatedPhotos = onlyMissing
        ? [...existingStorage, ...newUrls]
        : newUrls;

      const { error: updErr } = await admin
        .from('projects')
        .update({ photos: updatedPhotos })
        .eq('id', project.id);

      if (updErr) {
        console.error('Update project error', updErr.message);
        results.push({ id: project.id, error: updErr.message });
        continue;
      }

      processed += 1;
      results.push({ id: project.id, added: newUrls.length, total: updatedPhotos.length, keywords });
    }

    return new Response(
      JSON.stringify({ ok: true, processed, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    );
  } catch (e: any) {
    console.error('Backfill error', e?.message || e);
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || String(e) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
    );
  }
});