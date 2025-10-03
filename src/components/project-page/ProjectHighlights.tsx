import { motion } from 'framer-motion';
import { Building, Ruler, Star, Shield, MapPin, Zap } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import type { ProjectData } from '@/hooks/useProjectData';

interface ProjectHighlightsProps {
  project: ProjectData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function ProjectHighlights({ project }: ProjectHighlightsProps) {
  const highlights = [
    {
      icon: Building,
      metric: project.total_units,
      label: 'Unités résidentielles',
      animated: true
    },
    {
      icon: Ruler,
      metric: `${project.living_area_from}-${project.living_area_to}`,
      suffix: 'm²',
      label: 'Surfaces disponibles'
    },
    {
      icon: Star,
      metric: project.energy_rating || 'A+',
      label: 'Certification énergétique'
    },
    {
      icon: Shield,
      metric: '10',
      suffix: ' ans',
      label: 'Garantie constructeur',
      animated: true
    },
    {
      icon: MapPin,
      metric: project.proximity_sea_km || 0,
      suffix: ' km',
      label: 'Distance de la mer',
      animated: true
    },
    {
      icon: Zap,
      metric: project.completion_month?.split(' ')[0] || 'Q4',
      label: 'Livraison prévue'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="swaarg-large-title text-primary mb-4">
            Points Forts du Projet
          </h2>
          <p className="swaarg-subtitle text-muted-foreground max-w-2xl mx-auto">
            Découvrez les caractéristiques exceptionnelles qui font de ce projet une opportunité unique
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
              >
                <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Metric */}
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {highlight.animated && typeof highlight.metric === 'number' ? (
                      <AnimatedNumber
                        value={highlight.metric}
                        suffix={highlight.suffix || ''}
                      />
                    ) : (
                      <>
                        {highlight.metric}
                        {highlight.suffix || ''}
                      </>
                    )}
                  </div>

                  {/* Label */}
                  <div className="swaarg-body text-muted-foreground">
                    {highlight.label}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
