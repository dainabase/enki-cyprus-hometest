import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import Hero from './components/HeroSection';
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
    async function fetchProject() {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            developer:developer_id (
              id,
              name,
              logo_url,
              description,
              website,
              phone_numbers,
              email,
              projects_count,
              rating
            ),
            project_images (
              id,
              url,
              category,
              caption,
              is_primary,
              display_order
            ),
            project_amenities (
              amenity:amenity_id (
                id,
                name,
                icon,
                category
              )
            ),
            buildings (
              id,
              building_name,
              floors_above_ground,
              total_units,
              building_class,
              energy_certificate
            )
          `)
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
      transition={{ duration: 0.6 }}
      className="min-h-screen"
    >
      <Hero project={project} />
      <ProjectInfo project={project} />
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
