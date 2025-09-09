import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from './components/HeroSection';
import Overview from './components/Overview';
import Specifications from './components/Specifications';
import Gallery from './components/Gallery';
import Amenities from './components/Amenities';
import Investment from './components/Investment';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import StickyBar from './components/StickyBar';

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            developer:developers(*),
            project_amenities(
              amenity:amenities(*)
            ),
            project_nearby_amenities(
              amenity:nearby_amenities(*),
              distance_km,
              distance_minutes_walk,
              distance_minutes_drive
            ),
            project_documents(*),
            project_images(*)
          `)
          .eq('url_slug', slug)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Project not found');

        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground">{error || 'The requested project could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION (100vh) */}
      <HeroSection project={project} />

      {/* 2. QUICK OVERVIEW (50/50 desktop, stack mobile) */}
      <Overview project={project} />

      {/* 3. SPECIFICATIONS GRID */}
      <Specifications project={project} />

      {/* 4. MEDIA GALLERY */}
      <Gallery project={project} />

      {/* 5. AMENITIES GRID */}
      <Amenities project={project} />

      {/* 6. INVESTMENT/FINANCIAL BLOCK */}
      <Investment project={project} />

      {/* 7. TESTIMONIALS SLIDER */}
      <Testimonials project={project} />

      {/* 8. FOOTER CONVERSION ZONE */}
      <ContactForm project={project} />

      {/* 9. STICKY CTA BAR */}
      <StickyBar project={project} />
    </div>
  );
}