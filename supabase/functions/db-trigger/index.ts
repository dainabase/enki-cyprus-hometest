import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

// This function will be triggered by database changes
serve(async (req) => {
  try {
    console.log('🔔 Database Trigger Function called');
    
    const { table, record, old_record, event_type } = await req.json();
    
    console.log('📊 Trigger event:', { table, event_type });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (table) {
      case 'commissions':
        if (event_type === 'INSERT') {
          await handleCommissionNotification(supabase, record);
        }
        break;
        
      case 'checklists':
        if (event_type === 'UPDATE') {
          await handleChecklistNotification(supabase, record, old_record);
        }
        break;
        
      case 'profiles':
        if (event_type === 'INSERT') {
          await handleWelcomeNotification(supabase, record);
        }
        break;
    }

    return new Response(
      JSON.stringify({ success: true, processed: true }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error in DB trigger function:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function handleCommissionNotification(supabase: any, commission: any) {
  try {
    // Get promoter info
    const { data: promoter } = await supabase
      .from('promoters')
      .select('name, contact')
      .eq('id', commission.promoter_id)
      .single();

    // Get project info
    const { data: project } = await supabase
      .from('projects')
      .select('title')
      .eq('id', commission.project_id)
      .single();

    if (promoter?.contact?.email) {
      await supabase.functions.invoke('send-notification', {
        body: {
          to: promoter.contact.email,
          template: 'commission',
          data: {
            promoter: promoter.name,
            amount: commission.amount,
            project: project?.title || 'Projet inconnu',
            commission_rate: 0.05
          }
        }
      });
      
      console.log('✅ Commission notification sent to promoter:', promoter.name);
    }
  } catch (error) {
    console.error('❌ Error sending commission notification:', error);
  }
}

async function handleChecklistNotification(supabase: any, checklist: any, oldChecklist: any) {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, profile')
      .eq('id', checklist.user_id)
      .single();

    if (profile?.email) {
      const items = checklist.items || [];
      const tasksCompleted = items.filter((item: any) => item.done).length;
      const totalTasks = items.length;
      
      // Only send notification if progress changed significantly
      const oldItems = oldChecklist?.items || [];
      const oldCompleted = oldItems.filter((item: any) => item.done).length;
      
      if (tasksCompleted !== oldCompleted) {
        await supabase.functions.invoke('send-notification', {
          body: {
            to: profile.email,
            template: 'checklist',
            data: {
              name: profile.profile?.name || 'Utilisateur',
              checklist_title: checklist.title,
              tasks_completed: tasksCompleted,
              total_tasks: totalTasks
            }
          }
        });
        
        console.log('✅ Checklist notification sent to user:', profile.email);
      }
    }
  } catch (error) {
    console.error('❌ Error sending checklist notification:', error);
  }
}

async function handleWelcomeNotification(supabase: any, profile: any) {
  try {
    if (profile.email) {
      await supabase.functions.invoke('send-notification', {
        body: {
          to: profile.email,
          template: 'welcome',
          data: {
            name: profile.profile?.name || 'Nouveau utilisateur'
          }
        }
      });
      
      console.log('✅ Welcome notification sent to new user:', profile.email);
    }
  } catch (error) {
    console.error('❌ Error sending welcome notification:', error);
  }
}