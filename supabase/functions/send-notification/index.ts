import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

  try {
    console.log('📧 SendGrid Email Function started');
    
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { to, template, data }: NotificationRequest = await req.json();
    
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    
    if (!SENDGRID_API_KEY || SENDGRID_API_KEY === 'placeholder') {
      console.log('🎭 SENDGRID_API_KEY not configured, logging email to console');
      
      // Mock email sending for development
      const mockEmail = generateEmailContent(template, data);
      console.log('📧 Mock Email:', {
        to,
        subject: mockEmail.subject,
        html: mockEmail.html
      });
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email logged to console (mock mode)',
          generated_at: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Real SendGrid implementation
    const emailContent = generateEmailContent(template, data);
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
          }
        ],
        from: {
          email: 'noreply@enki-realty.com',
          name: 'ENKI Realty'
        },
        subject: emailContent.subject,
        content: [
          {
            type: 'text/html',
            value: emailContent.html
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid error: ${response.status} - ${error}`);
    }

    console.log('✅ Email sent successfully via SendGrid');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        generated_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in SendGrid Email function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        generated_at: new Date().toISOString()
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateEmailContent(template: string, data: any) {
  const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
      .container { max-width: 600px; margin: 0 auto; background-color: white; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center; }
      .header h1 { color: white; margin: 0; font-size: 1.5rem; }
      .content { padding: 2rem; }
      .footer { background-color: #f1f5f9; padding: 1rem; text-align: center; color: #64748b; font-size: 0.875rem; }
      .button { display: inline-block; background-color: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 1rem 0; }
      .highlight { background-color: #e0f2fe; padding: 1rem; border-radius: 6px; border-left: 4px solid #0284c7; margin: 1rem 0; }
    </style>
  `;

  switch (template) {
    case 'commission':
      return {
        subject: `Nouvelle commission - ${data.project}`,
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>💰 Nouvelle Commission</h1>
            </div>
            <div class="content">
              <h2>Félicitations ${data.promoter || data.name}!</h2>
              <p>Une nouvelle commission a été générée pour votre promotion du projet <strong>${data.project}</strong>.</p>
              
              <div class="highlight">
                <h3>Détails de la commission :</h3>
                <p><strong>Montant :</strong> ${data.amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>Taux :</strong> ${(data.commission_rate || 0.05) * 100}%</p>
                <p><strong>Projet :</strong> ${data.project}</p>
              </div>
              
              <p>Vous pouvez consulter tous les détails dans votre dashboard promoteur.</p>
              <a href="${Deno.env.get('SITE_URL') || 'https://enki-realty.com'}/admin" class="button">Voir le Dashboard</a>
            </div>
            <div class="footer">
              <p>ENKI Realty - Immobilier Premium à Chypre</p>
            </div>
          </div>
        `
      };

    case 'checklist':
      return {
        subject: `Checklist mise à jour - ${data.checklist_title}`,
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>📋 Checklist Mise à Jour</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${data.name}!</h2>
              <p>Votre checklist <strong>${data.checklist_title}</strong> a été mise à jour.</p>
              
              <div class="highlight">
                <h3>Progression :</h3>
                <p><strong>${data.tasks_completed}/${data.total_tasks}</strong> tâches complétées</p>
                <div style="background-color: #e2e8f0; border-radius: 10px; height: 8px; margin: 1rem 0;">
                  <div style="background-color: #10b981; height: 8px; border-radius: 10px; width: ${((data.tasks_completed || 0) / (data.total_tasks || 1)) * 100}%;"></div>
                </div>
              </div>
              
              <p>Continuez votre excellent travail vers l'acquisition de votre propriété de rêve!</p>
              <a href="${Deno.env.get('SITE_URL') || 'https://enki-realty.com'}/dashboard" class="button">Voir la Checklist</a>
            </div>
            <div class="footer">
              <p>ENKI Realty - Votre partenaire immobilier</p>
            </div>
          </div>
        `
      };

    case 'welcome':
      return {
        subject: 'Bienvenue chez ENKI Realty!',
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>🏠 Bienvenue chez ENKI Realty</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${data.name}!</h2>
              <p>Bienvenue dans la famille ENKI Realty! Nous sommes ravis de vous accompagner dans votre projet immobilier à Chypre.</p>
              
              <div class="highlight">
                <h3>Prochaines étapes :</h3>
                <ul>
                  <li>Explorez nos projets premium</li>
                  <li>Utilisez le calculateur fiscal Lexaia</li>
                  <li>Créez votre checklist d'achat personnalisée</li>
                  <li>Contactez nos conseillers experts</li>
                </ul>
              </div>
              
              <a href="${Deno.env.get('SITE_URL') || 'https://enki-realty.com'}/projects" class="button">Découvrir nos Projets</a>
            </div>
            <div class="footer">
              <p>ENKI Realty - Excellence Immobilière à Chypre</p>
            </div>
          </div>
        `
      };

    case 'project_update':
      return {
        subject: `Mise à jour projet - ${data.project}`,
        html: `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>🏗️ Mise à Jour Projet</h1>
            </div>
            <div class="content">
              <h2>Nouveautés sur ${data.project}</h2>
              <p>Le projet que vous suivez a été mis à jour avec de nouvelles informations.</p>
              
              <div class="highlight">
                <p>Consultez les dernières photos, plans et détails mis à jour.</p>
              </div>
              
              <a href="${Deno.env.get('SITE_URL') || 'https://enki-realty.com'}/projects" class="button">Voir le Projet</a>
            </div>
            <div class="footer">
              <p>ENKI Realty</p>
            </div>
          </div>
        `
      };

    default:
      return {
        subject: 'Notification ENKI Realty',
        html: `
          ${baseStyles}
          <div class="container">
            <div class="content">
              <h2>Notification</h2>
              <p>Vous avez reçu une nouvelle notification.</p>
            </div>
          </div>
        `
      };
  }
}