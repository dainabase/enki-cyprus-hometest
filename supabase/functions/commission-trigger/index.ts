import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { verifyAuth } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommissionTriggerRequest {
  project_id: string;
  user_id?: string;
  conversion_type: string;
  project_price: number;
  promoter_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // JWT verification
  const { error: authError } = verifyAuth(req);
  if (authError) return authError;

  try {
    console.log('Commission Trigger Function started');
    if (req.method !== 'POST') throw new Error('Method not allowed');

    const { project_id, user_id, conversion_type, project_price, promoter_id }: CommissionTriggerRequest = await req.json();
    console.log('Processing commission:', { project_id, conversion_type, project_price });

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    let selectedPromoterId = promoter_id;
    if (!selectedPromoterId) {
      const { data: promoters, error: pErr } = await supabase.from('promoters').select('id, commission_rate').limit(1);
      if (pErr) throw new Error('Failed to fetch promoters');
      if (!promoters?.length) return new Response(JSON.stringify({ success: true, message: 'No promoters available' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      selectedPromoterId = promoters[0].id;
    }

    const { data: promoter, error: prErr } = await supabase.from('promoters').select('commission_rate').eq('id', selectedPromoterId).single();
    if (prErr) throw new Error('Failed to fetch promoter');

    const rate = promoter.commission_rate || 0.05;
    const amount = project_price * rate;

    const { data: commission, error: cErr } = await supabase.from('commissions').insert({ promoter_id: selectedPromoterId, user_id: user_id || null, project_id, amount, status: 'pending', date: new Date().toISOString() }).select().single();
    if (cErr) throw new Error('Failed to create commission');

    console.log('Commission created:', commission.id);

    await supabase.from('analytics_events').insert({ event_name: 'commission_triggered', event_data: { commission_id: commission.id, promoter_id: selectedPromoterId, project_id, amount, conversion_type, commission_rate: rate }, user_id: user_id || null, page_url: '/commission-trigger', session_id: `trigger_${Date.now()}` });

    return new Response(JSON.stringify({ success: true, data: { commission_id: commission.id, amount, promoter_id: selectedPromoterId, status: 'pending' }, generated_at: new Date().toISOString() }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in Commission Trigger:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
