'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Chrome as Home, TreePine, Calendar, Ruler, CircleCheck as CheckCircle, Layers } from 'lucide-react';
import { buildGalleryFromProject } from '@/utils/gallery';

interface OverviewProps {
  project: any;
}

export default function Overview({ project }: OverviewProps) {
  const description = project.detailed_description || project.description || '';
  const developerVision = project.developer_vision || '';
  const architecturalConcept = project.architectural_concept || '';

  // Get panoramic view image from gallery
  const gallery = buildGalleryFromProject(project);
  const overviewImage = gallery.find(img => img.category === 'panoramic_view')?.url || 
                       gallery[0]?.url;

  const uspPoints = Array.isArray(project.unique_selling_points)
    ? project.unique_selling_points
    : (project.unique_selling_points ? JSON.parse(project.unique_selling_points) : []);

  const projectSpecs = [
    {
      icon: <Home className="w-6 h-6" />,
      label: 'Total Unités',
      value: project.total_units || 'N/A',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      label: 'Bâtiments',
      value: project.number_of_buildings || 'N/A',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      label: 'Types de logements',
      value: project.unit_types || 'Studio, 1-3 BR, Penthouse',
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      label: 'Surface terrain',
      value: project.plot_area ? `${project.plot_area} m²` : 'N/A',
    },
    {
      icon: <TreePine className="w-6 h-6" />,
      label: 'Espaces verts',
      value: project.green_spaces_percentage ? `${project.green_spaces_percentage}%` : 'N/A',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Début construction',
      value: project.construction_start_year || 'TBA',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Livraison prévue',
      value: project.expected_completion || project.completion_date || 'TBA',
    },
  ];

  return (
    <section className="w-full bg-neutral-50 py-20 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 lg:mb-20"
        >
          <div className="h-[1px] w-20 bg-black mb-6" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight">
            Vue d'ensemble du projet
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-20">

          {/* Left Column - Image + Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Overview Image */}
            {overviewImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full h-[480px] overflow-hidden shadow-sm"
              >
                <img
                  src={overviewImage}
                  alt={`${project.title} - Vue d'ensemble`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Main Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg md:text-xl text-black/80 font-light leading-relaxed">
                {description}
              </p>
            </div>

            {/* Developer Vision */}
            {developerVision && (
              <div className="pt-6 border-t border-black/10">
                <h3 className="text-sm uppercase tracking-[0.2em] text-black/50 mb-4">
                  Vision du développeur
                </h3>
                <p className="text-base md:text-lg text-black/70 font-light leading-relaxed">
                  {developerVision}
                </p>
              </div>
            )}

            {/* Architectural Concept */}
            {architecturalConcept && (
              <div className="pt-6 border-t border-black/10">
                <h3 className="text-sm uppercase tracking-[0.2em] text-black/50 mb-4">
                  Concept architectural
                </h3>
                <p className="text-base md:text-lg text-black/70 font-light leading-relaxed">
                  {architecturalConcept}
                </p>
              </div>
            )}
          </motion.div>

          {/* Right Column - Key Characteristics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-white p-8 lg:p-10 shadow-sm">
              <h3 className="text-2xl md:text-3xl font-light text-black mb-8">
                Caractéristiques clés
              </h3>
              <div className="space-y-6">
                {projectSpecs.map((spec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between pb-4 border-b border-black/5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-black/40">
                        {spec.icon}
                      </div>
                      <span className="text-sm text-black/60 font-light">
                        {spec.label}
                      </span>
                    </div>
                    <span className="text-base font-normal text-black">
                      {spec.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Unique Selling Points */}
        {uspPoints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="border-t border-black/10 pt-16"
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-black mb-10">
              Ce qui rend ce projet unique
            </h3>

            {/* USP Grid - Full Width Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {uspPoints.map((point: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110 duration-300" />
                    <span className="text-sm md:text-base text-black/80 font-light leading-relaxed">
                      {point}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
