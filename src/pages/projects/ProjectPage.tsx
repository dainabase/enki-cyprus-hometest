import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import Hero from './components/HeroSection';
import Overview from './components/Overview';
import ProjectInfo from './components/ProjectInfo';
import Gallery from './components/Gallery';
import FloorPlans from './components/FloorPlans';
import Features from './components/Features';
import Location from './components/Location';
import Investment from './components/Investment';
import Developer from './components/Developer';
import ContactForm from './components/ContactForm';

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;

      try {
        // Fetch main project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('url_slug', slug)
          .maybeSingle();

        if (projectError) throw projectError;
        if (!projectData) throw new Error('Project not found');

        // Fetch developer data
        let developerData = null;
        if (projectData.developer_id) {
          const { data: dev } = await supabase
            .from('developers')
            .select('id, name, logo, history, website, phone_numbers, email_primary, total_projects, rating_score')
            .eq('id', projectData.developer_id)
            .maybeSingle();
          
          if (dev) {
            developerData = {
              id: dev.id,
              name: dev.name,
              logo_url: dev.logo,
              description: dev.history,
              website: dev.website,
              phone_numbers: dev.phone_numbers,
              email: dev.email_primary,
              projects_count: dev.total_projects,
              rating: dev.rating_score
            };
          }
        }

        // Fetch project images
        const { data: images } = await supabase
          .from('project_images')
          .select('id, url, caption, is_primary, display_order')
          .eq('project_id', projectData.id)
          .order('display_order');

        // Fetch buildings
        const { data: buildings } = await supabase
          .from('buildings')
          .select('id, building_name, total_floors, total_units, building_class, energy_certificate')
          .eq('project_id', projectData.id)
          .order('display_order');

        // Combine all data
        const completeProject = {
          ...projectData,
          developer: developerData,
          project_images: images || [],
          buildings: buildings || []
        };

        setProject(completeProject);
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-2xl font-light"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-4xl font-light mb-4">Project Not Found</h1>
          <p className="text-white/60">{error || 'The requested project could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      <Hero project={project} />
      <Overview project={project} />
      <Gallery project={project} />
      <FloorPlans project={project} />
      <Features project={project} />
      <Location project={project} />
      <Investment project={project} />
      <Developer project={project} />
      <ContactForm project={project} />
    </motion.div>
  );
}
