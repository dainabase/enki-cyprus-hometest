import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { verifyAuth } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  to: string;
  template: 'commission' | 'checklist' | 'welcome' | 'project_update';
  data: {
    name?: string;
    amount?: number;
    project?: string;
    promoter?: string;
    commission_rate?: number;
    checklist_title?: string;
    tasks_completed?: number;
    total_tasks?: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // JWT verification
  const { error: authError } = verifyAuth(req);
  if (authError) return authError;

  try {
    console.log('SendGrid Email Function started');
    
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { to, template, data }: NotificationRequest = await req.json();
    
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    
    if (!SENDGRID_API_KEY || SENDGRID_API_KEY === 'placeholder') {
      console.log('SENDGRID_API_KEY not configured, logging email to console');
      const mockEmail = generateEmailContent(template, data);
      console.log('Mock Email:', { to, subject: mockEmail.subject });
      return new Response(
        JSON.stringify({ success: true, message: 'Email logged to console (mock mode)', generated_at: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailContent = generateEmailContent(template, data);
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'noreply@enki-realty.com', name: 'ENKI Realty' },
        subject: emailContent.subject,
        content: [{ type: 'text/html', value: emailContent.html }]
      }),
    });
    if (!response.ok) { const err = await response.text(); throw new Error(`SendGrid error: ${response.status} - ${err}`); }
    console.log('Email sent successfully via SendGrid');
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully', generated_at: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in SendGrid Email function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error', generated_at: new Date().toISOString() }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateEmailContent(template: string, data: Record<string, unknown>) {
  const siteUrl = Deno.env.get('SITE_URL') || 'https://enki-realty.com';
  const s = { c: 'max-width:600px;margin:0 auto;font-family:Arial,sans-serif;', h: 'background:linear-gradient(135deg,#3b82f6,#1d4ed8);padding:32px;text-align:center;', ht: 'color:white;margin:0;font-size:24px;font-weight:bold;', ct: 'padding:32px;color:#374151;', hl: 'background:#eff6ff;padding:16px;border-radius:8px;border-left:4px solid #3b82f6;margin:16px 0;', b: 'display:inline-block;background:#3b82f6;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;margin:16px 0;', f: 'background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:14px;' };
  switch (template) {
    case 'commission': return { subject: `Commission confirmee - ${data.project}`, html: `<div style="${s.c}"><div style="${s.h}"><h1 style="${s.ht}">Commission Confirmee</h1></div><div style="${s.ct}"><h2>Felicitations ${data.promoter || data.name}!</h2><div style="${s.hl}"><p>Montant: ${(data.amount as number)?.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</p><p>Projet: ${data.project}</p></div><a href="${siteUrl}/admin" style="${s.b}">Dashboard</a></div><div style="${s.f}"><p>ENKI Realty</p></div></div>` };
    case 'welcome': return { subject: 'Bienvenue chez ENKI Realty!', html: `<div style="${s.c}"><div style="${s.h}"><h1 style="${s.ht}">Bienvenue</h1></div><div style="${s.ct}"><h2>Bonjour ${data.name}!</h2><a href="${siteUrl}/projects" style="${s.b}">Nos Projets</a></div><div style="${s.f}"><p>ENKI Realty</p></div></div>` };
    case 'checklist': return { subject: 'Checklist mise a jour', html: `<div style="${s.c}"><div style="${s.h}"><h1 style="${s.ht}">Checklist</h1></div><div style="${s.ct}"><p>${data.tasks_completed}/${data.total_tasks} taches</p><a href="${siteUrl}/dashboard" style="${s.b}">Voir</a></div><div style="${s.f}"><p>ENKI Realty</p></div></div>` };
    case 'project_update': return { subject: `Mise a jour - ${data.project}`, html: `<div style="${s.c}"><div style="${s.h}"><h1 style="${s.ht}">Mise a Jour</h1></div><div style="${s.ct}"><h2>${data.project}</h2><a href="${siteUrl}/projects" style="${s.b}">Voir</a></div><div style="${s.f}"><p>ENKI Realty</p></div></div>` };
    default: return { subject: 'Notification ENKI Realty', html: '<p>Nouvelle notification.</p>' };
  }
}
