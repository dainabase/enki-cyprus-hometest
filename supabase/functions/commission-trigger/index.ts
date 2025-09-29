import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

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

  try {
    console.log('🏦 Commission Trigger Function started');
    
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { project_id, user_id, conversion_type, project_price, promoter_id }: CommissionTriggerRequest = await req.json();
    
    console.log('📊 Processing commission trigger:', { 
      project_id, 
      user_id, 
      conversion_type, 
      project_price, 
      promoter_id 
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get a promoter for this commission (random if not specified)
    let selectedPromoterId = promoter_id;
    
    if (!selectedPromoterId) {
      const { data: promoters, error: promotersError } = await supabase
        .from('promoters')
        .select('id, commission_rate')
        .limit(1);
      
      if (promotersError) {
        console.error('Error fetching promoters:', promotersError);
        throw new Error('Failed to fetch promoters');
      }
      
      if (promoters && promoters.length > 0) {
        selectedPromoterId = promoters[0].id;
      } else {
        console.log('No promoters found, skipping commission creation');
        return new Response(
          JSON.stringify({
            success: true,
            message: 'No promoters available for commission',
            generated_at: new Date().toISOString()
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Get promoter commission rate
    const { data: promoter, error: promoterError } = await supabase
      .from('promoters')
      .select('commission_rate')
      .eq('id', selectedPromoterId)
      .single();

    if (promoterError) {
      console.error('Error fetching promoter:', promoterError);
      throw new Error('Failed to fetch promoter');
    }

    // Calculate commission amount
    const commissionRate = promoter.commission_rate || 0.05; // Default 5%
    const commissionAmount = project_price * commissionRate;

    // Create commission record
    const { data: commission, error: commissionError } = await supabase
      .from('commissions')
      .insert({
        promoter_id: selectedPromoterId,
        user_id: user_id || null,
        project_id,
        amount: commissionAmount,
        status: 'pending',
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (commissionError) {
      console.error('Error creating commission:', commissionError);
      throw new Error('Failed to create commission');
    }

    console.log('✅ Commission created successfully:', commission);

    // Log analytics event
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        event_name: 'commission_triggered',
        event_data: {
          commission_id: commission.id,
          promoter_id: selectedPromoterId,
          project_id,
          amount: commissionAmount,
          conversion_type,
          commission_rate: commissionRate
        },
        user_id: user_id || null,
        page_url: '/commission-trigger',
        session_id: `trigger_${Date.now()}`
      });

    if (analyticsError) {
      console.warn('Failed to log analytics event:', analyticsError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          commission_id: commission.id,
          amount: commissionAmount,
          promoter_id: selectedPromoterId,
          status: 'pending'
        },
        generated_at: new Date().toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('❌ Error in Commission Trigger function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        generated_at: new Date().toISOString()
      }),
      {
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});