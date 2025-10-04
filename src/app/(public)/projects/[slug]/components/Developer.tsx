'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Phone, Mail, Award, Building2 } from 'lucide-react';

interface DeveloperProps {
  project: any;
}

export default function Developer({ project }: DeveloperProps) {
  const developer = project.developer;

  if (!developer) return null;

  return (
    <section className="bg-neutral-50 py-32 lg:py-48">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
              Developer
            </h2>
            <p className="text-2xl md:text-3xl font-light text-black mb-12">
              {developer.name}
            </p>

            {developer.description && (
              <p className="text-lg md:text-xl text-black/60 font-light mb-12 leading-relaxed">
                {developer.description}
              </p>
            )}

            <div className="space-y-6 mb-12">
              {developer.projects_count && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <Building2 className="w-6 h-6 text-black/40" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black/40 mb-1 font-medium">
                      Total Projects
                    </p>
                    <p className="text-lg font-light text-black">
                      {developer.projects_count}+ Developments
                    </p>
                  </div>
                </motion.div>
              )}

              {developer.rating && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-center gap-4"
                >
                  <Award className="w-6 h-6 text-black/40" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black/40 mb-1 font-medium">
                      Rating
                    </p>
                    <p className="text-lg font-light text-black">
                      {developer.rating}/5.0
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {developer.website && (
                <motion.a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-black/90 transition-all duration-300"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}

              {developer.phone_numbers && (
                <motion.a
                  href={`tel:${developer.phone_numbers}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 px-8 py-3 border border-black text-black text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition-all duration-300"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </motion.a>
              )}

              {developer.email && (
                <motion.a
                  href={`mailto:${developer.email}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 px-8 py-3 border border-black text-black text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition-all duration-300"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </motion.a>
              )}
            </div>
          </motion.div>

          {developer.logo_url && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square lg:aspect-[4/5] bg-white"
            >
              <img
                src={developer.logo_url}
                alt={developer.name}
                className="w-full h-full object-contain p-12"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
