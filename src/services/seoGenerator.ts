import { supabase } from '@/integrations/supabase/client';

export async function generateSEOContent(projectData: any) {
  try {
    console.log('🔍 Generating SEO content for:', projectData.title);
    
    // Appel à votre Edge Function
    const { data, error } = await supabase.functions.invoke('generate-seo', {
      body: {
        title: projectData.title,
        description: projectData.description,
        city: projectData.city,
        zone: projectData.cyprus_zone,
        price_from: projectData.price_from,
        total_units: projectData.total_units,
        golden_visa: projectData.golden_visa_eligible,
        developer: projectData.developer_name,
        amenities: projectData.amenities
      }
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      throw error;
    }

    console.log('✅ SEO content generated:', data);
    
    return {
      meta_title: data.meta_title || `${projectData.title} - Immobilier Chypre`,
      meta_description: data.meta_description || projectData.description,
      meta_keywords: data.meta_keywords || [],
      url_slug: data.url_slug || projectData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    
  } catch (error) {
    console.error('❌ Erreur génération SEO:', error);
    
    // Fallback avec génération basique
    return {
      meta_title: `${projectData.title || 'Projet'} - Investissement Immobilier Chypre ${projectData.golden_visa_eligible ? '| Golden Visa' : ''}`,
      meta_description: `Découvrez ${projectData.title} à ${projectData.city || 'Chypre'}. ${projectData.total_units || 'Plusieurs'} unités disponibles à partir de ${projectData.price_from || 0}€. ${projectData.golden_visa_eligible ? 'Éligible Golden Visa.' : ''}`,
      meta_keywords: [
        'immobilier chypre', 
        'golden visa cyprus', 
        projectData.city?.toLowerCase(), 
        projectData.cyprus_zone, 
        'investissement immobilier', 
        'residence permit'
      ].filter(Boolean),
      url_slug: projectData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'projet-immobilier'
    };
  }
}