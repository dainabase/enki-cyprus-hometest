'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatPrice, formatArea } from '@/lib/utils/formatters';
import { MapPin, Calendar, Chrome as Home, Ruler, Euro, TrendingUp, Award, CircleCheck as CheckCircle } from 'lucide-react';

interface ProjectInfoProps {
  project: any;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  const description = project.detailed_description || project.description || '';
  const uspPoints = Array.isArray(project.unique_selling_points)
    ? project.unique_selling_points
    : (project.unique_selling_points ? JSON.parse(project.unique_selling_points) : []);

  const quickStats = [
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Location',
      value: `${project.city}${project.district ? `, ${project.district}` : ''}`,
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Completion',
      value: project.completion_date || project.expected_completion || 'To be announced',
    },
    {
      icon: <Home className="w-6 h-6" />,
      label: 'Units',
      value: `${project.total_units || 'Multiple'} units`,
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      label: 'Size Range',
      value: project.square_meters_min && project.square_meters_max
        ? `${formatArea(project.square_meters_min)} - ${formatArea(project.square_meters_max)}`
        : 'Various sizes',
    },
    {
      icon: <Euro className="w-6 h-6" />,
      label: 'Price From',
      value: project.price_from ? formatPrice(project.price_from) : 'On Request',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'ROI',
      value: project.roi_estimate_percent ? `${project.roi_estimate_percent}%` : 'N/A',
    },
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            About {project.title}
          </h2>
          {project.subtitle && (
            <p className="text-xl md:text-2xl text-black/60 font-light">
              {project.subtitle}
            </p>
          )}
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20 pb-20 border-b border-black/10"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3 text-black/40">
                {stat.icon}
              </div>
              <p className="text-xs uppercase tracking-wider text-black/40 mb-2 font-medium">
                {stat.label}
              </p>
              <p className="text-base md:text-lg font-light text-black">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Description & Features */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-light text-black mb-6">
              Project Overview
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-black/70 font-light leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </motion.div>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-light text-black mb-8">
              Key Features
            </h3>
            <div className="space-y-5">
              {uspPoints.length > 0 ? (
                uspPoints.map((point: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 transition-transform group-hover:scale-110" />
                    <span className="text-base md:text-lg text-black/80 font-light">
                      {point}
                    </span>
                  </motion.div>
                ))
              ) : (
                <p className="text-black/50 font-light italic">
                  Key features will be announced soon
                </p>
              )}
            </div>

            {/* Additional Info */}
            {(project.architect_name || project.builder_name) && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 pt-8 border-t border-black/10 space-y-4"
              >
                {project.architect_name && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black/40 mb-1">
                      Architect
                    </p>
                    <p className="text-lg font-light text-black">
                      {project.architect_name}
                    </p>
                  </div>
                )}
                {project.builder_name && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black/40 mb-1">
                      Builder
                    </p>
                    <p className="text-lg font-light text-black">
                      {project.builder_name}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
