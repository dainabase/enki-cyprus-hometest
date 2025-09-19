import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import HeroSection from './components/HeroSection';
import Overview from './components/Overview';
import Specifications from './components/Specifications';
import Gallery from './components/Gallery';
import Amenities from './components/Amenities';
import Investment from './components/Investment';
import ContactForm from './components/ContactForm';
import Testimonials from './components/Testimonials';
import StickyBar from './components/StickyBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProjectData {
  id: string;
  title: string;
  description?: string;
  // ... other basic fields
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;
      
      try {
        const { data, error } = await supabase
          .from('projects_clean')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) {
          console.error('Error fetching project:', error);
          return;
        }

        if (data) {
          setProject(data as ProjectData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Projet non trouvé</h1>
            <p className="text-muted-foreground">Le projet que vous recherchez n'existe pas.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        <HeroSection project={project} />
        <Overview project={project} />
        <Specifications project={project} />
        <Gallery project={project} />
        <Amenities project={project} />
        <Investment project={project} />
        <Testimonials project={project} />
        <ContactForm project={project} />
        <StickyBar project={project} />
      </div>
    </Layout>
  );
}
