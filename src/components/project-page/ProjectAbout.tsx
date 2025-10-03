import { motion } from 'framer-motion';
import type { ProjectData } from '@/hooks/useProjectData';

interface ProjectAboutProps {
  project: ProjectData;
}

export function ProjectAbout({ project }: ProjectAboutProps) {
  const architectureImages = project.photos_categorized?.exterior?.slice(0, 2) || [];

  return (
    <section className="py-24 md:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Text Content - 60% */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3 space-y-6"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
              >
                À Propos du Projet
              </motion.div>

              <h2 className="swaarg-large-title text-primary mb-6">
                {project.title}
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="swaarg-body text-muted-foreground leading-relaxed text-lg">
                {project.detailed_description || project.description}
              </p>
            </div>

            {project.project_highlights && project.project_highlights.length > 0 && (
              <div className="space-y-4 mt-8">
                <h3 className="swaarg-card-title">Points Clés</h3>
                <ul className="space-y-3">
                  {project.project_highlights.map((highlight, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="swaarg-body text-foreground">{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {project.architecture_style && (
              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Style Architectural:</span> {project.architecture_style}
                </p>
              </div>
            )}
          </motion.div>

          {/* Images - 40% */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="relative">
              {architectureImages.length > 0 && (
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-80 rounded-2xl overflow-hidden shadow-xl"
                  >
                    <img
                      src={architectureImages[0]?.url || '/placeholder.svg'}
                      alt="Architecture"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {architectureImages[1] && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-64 rounded-2xl overflow-hidden shadow-xl"
                    >
                      <img
                        src={architectureImages[1]?.url || '/placeholder.svg'}
                        alt="Architecture Detail"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
