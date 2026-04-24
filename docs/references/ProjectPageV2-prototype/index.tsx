import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { HeroPrestige } from './sections/HeroPrestige';
import { LocationInteractive } from './sections/LocationInteractive';
import { logger } from '@/lib/logger';
// import { Section5TypologiesReal } from './sections/Section5TypologiesReal';
// import { FinancingInvestmentSection } from './sections/FinancingInvestmentSection';
// import { SocialProofSection } from './sections/SocialProofSection';
import { SEOHead } from '@/components/SEOHead';

export function ProjectPageV2() {
  const { slug } = useParams();
  const [enrichedProject, setEnrichedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAndEnrichProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadAndEnrichProject() {
    try {
      logger.info('[ProjectPageV2] Loading project with slug:', slug);

      const { data: baseProject, error } = await supabase
        .from('projects')
        .select('*, buildings (*)')
        .eq('url_slug', slug)
        .maybeSingle();

      if (error) {
        console.error('[ProjectPageV2] Supabase error:', error);
        throw error;
      }

      if (!baseProject) {
        console.warn('[ProjectPageV2] Projet non trouvé pour slug:', slug);
        setEnrichedProject(null);
        setLoading(false);
        return;
      }

      logger.info('[ProjectPageV2] Base project loaded:', baseProject.title);

      // Use real data from database instead of mock enrichment
      setEnrichedProject(baseProject);
      logger.info('[ProjectPageV2] Real data loaded successfully');
    } catch (error) {
      console.error('[ProjectPageV2] Error loading project:', error);
      setEnrichedProject(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-light text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!enrichedProject) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-light text-gray-600">Projet non trouve</div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${enrichedProject.name} - NKREALTY`}
        description={enrichedProject.description || "Decouvrez notre projet immobilier d'exception"}
        image={enrichedProject.main_image_url || "/og-image.jpg"}
      />

      <div className="min-h-screen bg-white">
        <HeroPrestige project={enrichedProject} />

        <LocationInteractive project={enrichedProject} />

        {/* Sections désactivées temporairement en attendant les migrations BDD */}
        {/* <Section5TypologiesReal projectId={enrichedProject.id} /> */}
        {/* <FinancingInvestmentSection project={enrichedProject} /> */}
        {/* <SocialProofSection project={enrichedProject} /> */}
      </div>
    </>
  );
}

export default ProjectPageV2;
