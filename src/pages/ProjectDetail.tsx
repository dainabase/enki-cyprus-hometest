import { useParams } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useProjectData } from '@/hooks/useProjectData';
import { ProjectHero } from '@/components/project-page/ProjectHero';
import { ProjectHeroSkeleton } from '@/components/project-page/ProjectHeroSkeleton';
import { ProjectHighlights } from '@/components/project-page/ProjectHighlights';
import { ProjectAbout } from '@/components/project-page/ProjectAbout';
import { ProjectLocation } from '@/components/project-page/ProjectLocation';
import { ProjectUnits } from '@/components/project-page/ProjectUnits';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProjectData(slug || '');

  useEffect(() => {
    if (project) {
      trackPageView(`/projects/${slug}`, `${project.title} - Enki Reality`);
    }
  }, [project, slug]);

  if (isLoading) {
    return <ProjectHeroSkeleton />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Projet non trouvé</h1>
          <p className="text-muted-foreground">Le projet que vous recherchez n'existe pas.</p>
        </div>
      </div>
    );
  }

  const metadata = {
    title: `${project.title} - Investissement Immobilier ${project.city} | Enki Reality`,
    description: project.meta_description || `Découvrez ${project.title}, programme neuf à ${project.city}. ${project.units_available} unités disponibles à partir de €${project.price_from?.toLocaleString()}. ${project.golden_visa_eligible ? 'Éligible Golden Visa Cyprus.' : ''}`,
    keywords: [
      project.title,
      `immobilier ${project.city}`,
      `appartement neuf ${project.city}`,
      project.golden_visa_eligible ? 'golden visa cyprus' : '',
      `investissement ${project.city}`,
      'programme neuf chypre',
      project.property_category
    ].filter(Boolean).join(', '),
    url: `https://enki-reality.com/projects/${project.slug}`,
    canonical: `https://enki-reality.com/projects/${project.slug}`,
    image: project.hero_image || project.photos[0]?.url || '/og-image.jpg'
  };

  return (
    <>
      <SEOHead {...metadata} />

      <div className="min-h-screen bg-white">
        {/* Hero avec Parallax */}
        <ProjectHero project={project} />

        {/* Highlights */}
        <ProjectHighlights project={project} />

        {/* About */}
        <ProjectAbout project={project} />

        {/* Location */}
        <ProjectLocation project={project} />

        {/* Units */}
        <ProjectUnits project={project} />

        {/* CTA Section */}
        <section id="contact" className="py-24 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="swaarg-large-title mb-6">
              Intéressé par {project.title} ?
            </h2>
            <p className="swaarg-subtitle mb-12 opacity-90">
              Contactez-nous pour planifier une visite ou obtenir plus d'informations
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors">
                Réserver une visite
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Télécharger la brochure
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
