import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CTAButton } from '../components/CTAButton';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

interface HeroPrestigeProps {
  projectSlug?: string;
}

export function HeroPrestige({ projectSlug }: HeroPrestigeProps) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectSlug]);

  async function loadProject() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          buildings (*)
        `)
        .eq('url_slug', projectSlug || 'azure-marina')
        .maybeSingle();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl font-light">Chargement...</div>
      </section>
    );
  }

  if (!project) {
    return null;
  }

  return <HeroContent project={project} />;
}

function HeroContent({ project }: { project: any }) {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const heroImage = project.main_image_url || '/lovable-uploads/marina-bay-hero.jpg';
  const availableUnits = project.buildings?.reduce((sum: number, b: any) => sum + (b.available_units || 0), 0) || 0;

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity, scale }}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0"
      >
        <img
          src={heroImage}
          alt={project.name}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.6)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-7xl mx-auto"
        >
          {project.golden_visa_eligible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <Badge className="bg-amber-600 text-white px-6 py-3 text-sm font-medium rounded-full border-2 border-amber-400">
                \u00c9ligible R\u00e9sidence Permanente UE
              </Badge>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 sm:mb-8 font-light text-white/70"
          >
            {project.location_city}, {project.location_country}
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-[0.95] mb-6 sm:mb-8 text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {project.name}
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto font-light leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {project.tagline || project.description?.split('.')[0]}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <CTAButton
              text="R\u00e9server Visite Priv\u00e9e"
              variant="primary"
              size="lg"
              location="hero"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {project.virtual_tour_url && (
              <CTAButton
                text="Visite Virtuelle 360\u00b0"
                variant="secondary"
                size="lg"
                location="hero-virtual-tour"
                onClick={() => window.open(project.virtual_tour_url, '_blank')}
              />
            )}
          </motion.div>

          {availableUnits > 0 && availableUnits < 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <Badge className="bg-red-600 text-white px-5 py-2 text-sm rounded-full animate-pulse">
                {availableUnits} unit\u00e9s restantes
              </Badge>
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div
        className="absolute top-6 right-6 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <Badge className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
          {project.status === 'in_construction' ? 'En Construction' :
           project.status === 'planning' ? 'En Planification' :
           project.status === 'completed' ? 'Livr\u00e9' : 'Disponible'}
        </Badge>
      </motion.div>

      {project.developer_experience_years && (
        <motion.div
          className="absolute bottom-24 left-6 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <Badge className="bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-xl border border-white/20">
            {project.developer_experience_years} ans d'excellence
          </Badge>
        </motion.div>
      )}

      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center text-white/60">
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </motion.div>
    </motion.section>
  );
}
