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
        error: error instanceof Error ? error.message : 'Unknown error',
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
  // Simple inline styles for basic responsive emails
  const styles = {
    container: 'max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff;',
    header: 'background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 32px; text-align: center;',
    headerTitle: 'color: white; margin: 0; font-size: 24px; font-weight: bold;',
    content: 'padding: 32px; color: #374151;',
    highlight: 'background-color: #eff6ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 16px 0;',
    button: 'display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;',
    footer: 'background-color: #f9fafb; padding: 16px; text-align: center; color: #6b7280; font-size: 14px;'
  };

  switch (template) {
    case 'commission':
      return {
        subject: `Commission confirmée - ${data.project}`,
        html: `
          <div style="${styles.container}">
            <div style="${styles.header}">
              <h1 style="${styles.headerTitle}">💰 Commission Confirmée</h1>
            </div>
            <div style="${styles.content}">
              <h2>Félicitations ${data.promoter || data.name}!</h2>
              <p>Une nouvelle commission de <strong>5%</strong> a été confirmée pour votre promotion du projet <strong>${data.project}</strong>.</p>
              
              <div style="${styles.highlight}">
                <h3>Détails :</h3>
                <p><strong>Montant :</strong> ${data.amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>Projet :</strong> ${data.project}</p>
                <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              
              <p>Consultez votre dashboard pour plus de détails.</p>
              <a href="${Deno.env.get('SITE_URL') || 'https://enki-realty.com'}/admin" style="${styles.button}">Voir Dashboard</a>
            </div>
            <div style="${styles.footer}">
              <p>ENKI Realty - Immobilier Premium à Chypre</p>
            </div>
          </div>
        `
      };

    case 'checklist':
      return {
        subject: `Checklist mise à jour - Achat à Chypre`,
        html: `
          <div style="${styles.container}">
            <div style="${styles.header}">
              <h1 style="${styles.headerTitle}">📋 Checklist Mise à Jour</h1>
            </div>
            <div style="${styles.content}">
              <h2>Bonjour ${data.name}!</h2>
              <p>Votre checklist pour votre achat immobilier à Chypre a été mise à jour.</p>
              
              <div style="${styles.highlight}">
                <h3>Progression :</h3>
                <p><strong>${data.tasks_completed}/${data.total_tasks}</strong> tâches complétées</p>
                <div style="background-color: #e5e7eb; border-radius: 10px; height: 8px; margin: 16px 0;">
                  <div style="background-color: #10b981; height: 8px; border-radius: 10px; width: ${((data.tasks_completed || 0) / (data.total_tasks || 1)) * 100}%;"></div>
                </div>
              </div>
              
              <p>Continuez votre excellent travail vers l'acquisition de votre propriété de rêve à Chypre!</p>
              <a href="${Deno.env.get('SITE_URL') || 'https://enki-realty.com'}/dashboard" style="${styles.button}">Voir Checklist</a>
            </div>
            <div style="${styles.footer}">
              <p>ENKI Realty - Votre partenaire immobilier</p>
            </div>
          </div>
        `
      };

    case 'welcome':
      return {
        subject: 'Bienvenue chez ENKI Realty!',
        html: `
          <div style="${styles.container}">
            <div style="${styles.header}">
              <h1 style="${styles.headerTitle}">🏠 Bienvenue chez ENKI Realty</h1>
            </div>
            <div style="${styles.content}">
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