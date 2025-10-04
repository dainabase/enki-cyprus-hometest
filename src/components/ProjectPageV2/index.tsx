import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { enrichProjectData } from '../../../utils/mockProjectEnrichment';
import { HeroPrestige } from './sections/HeroPrestige';
import { LocationInteractive } from './sections/LocationInteractive';
import { UnitTypologiesSection } from './sections/UnitTypologiesSection';
import { FinancingInvestmentSection } from './sections/FinancingInvestmentSection';
import { SocialProofSection } from './sections/SocialProofSection';
import { SEOHead } from '@/components/SEOHead';

export function ProjectPageV2() {
  const { slug } = useParams();
  const [enrichedProject, setEnrichedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAndEnrichProject();
  }, [slug]);

  async function loadAndEnrichProject() {
    try {
      const { data: baseProject, error } = await supabase
        .from('projects')
        .select('*, buildings (*)')
        .eq('url_slug', slug || 'azure-marina')
        .maybeSingle();

      if (error) throw error;

      if (baseProject) {
        const enriched = enrichProjectData(baseProject);
        setEnrichedProject(enriched);
        console.log('[ProjectPageV2] Data enriched with mock data:', enriched.meta);
      }
    } catch (error) {
      console.error('Error loading project:', error);
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
        <HeroPrestige projectSlug={slug} />

        <LocationInteractive projectSlug={slug} />

        <UnitTypologiesSection project={enrichedProject} />

        <FinancingInvestmentSection project={enrichedProject} />

        <SocialProofSection project={enrichedProject} />
      </div>
    </>
  );
}

export default ProjectPageV2;
