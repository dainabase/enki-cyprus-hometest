import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { KPICard } from './KPICard';
import { Euro, Chrome as Home, Calendar, Award, MapPin } from 'lucide-react';
import type { ProjectData } from '@/hooks/useProjectData';

interface ProjectHeroProps {
  project: ProjectData;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const heroImage = project.hero_image || project.photos[0]?.url || '/placeholder.svg';

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Parallax Background - Optimisé avec <img> au lieu de background CSS */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={heroImage}
          alt={project.title}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center"
      >
        {/* Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-6 py-2 mb-6"
        >
          <MapPin className="w-4 h-4 text-white" />
          <span className="text-white font-medium">{project.city}, {project.region}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="swaarg-hero-title text-white mb-6 max-w-4xl"
        >
          {project.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="swaarg-subtitle text-white/90 mb-12 max-w-3xl"
        >
          {project.description}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-hover text-white px-8"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Réserver une visite virtuelle
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary backdrop-blur-md bg-white/10"
            onClick={() => document.getElementById('units')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Voir les disponibilités
          </Button>
        </motion.div>
      </motion.div>

      {/* KPI Cards - Fixed Bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon={<Euro className="w-8 h-8" />}
              label="À partir de"
              value={`€${project.price_from?.toLocaleString() || 'N/A'}`}
              delay={0.8}
            />
            <KPICard
              icon={<Home className="w-8 h-8" />}
              label="Unités disponibles"
              value={project.units_available || 0}
              delay={0.9}
            />
            <KPICard
              icon={<Calendar className="w-8 h-8" />}
              label="Livraison"
              value={project.completion_month || 'N/A'}
              delay={1.0}
            />
            <KPICard
              icon={<Award className="w-8 h-8" />}
              label="Golden Visa"
              value={project.golden_visa_eligible ? 'Éligible' : 'Non éligible'}
              highlight={project.golden_visa_eligible}
              delay={1.1}
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
