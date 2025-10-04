import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from './components/HeroSection';
import Overview from './components/Overview';
import Gallery from './components/Gallery';
import Amenities from './components/Amenities';
import ContactForm from './components/ContactForm';

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
          .select('*')
          .eq('url_slug', slug)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Project not found');

        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
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
    <div className="min-h-screen bg-black">
      <HeroSection project={project} />
      <Overview project={project} />
      <Gallery project={project} />
      <Amenities project={project} />
      <ContactForm project={project} />
    </div>
  );
}