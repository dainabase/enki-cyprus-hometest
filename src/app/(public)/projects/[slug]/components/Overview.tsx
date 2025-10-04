'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building, Home, Calendar, MapPin, TrendingUp, Shield } from 'lucide-react';

interface OverviewProps {
  project: any;
}

export default function Overview({ project }: OverviewProps) {
  const stats = [
    {
      icon: Building,
      label: 'Property Type',
      value: project.type || 'Residential'
    },
    {
      icon: Home,
      label: 'Units Available',
      value: project.total_units || 'Multiple'
    },
    {
      icon: Calendar,
      label: 'Completion',
      value: project.completion_date || project.delivery_date_q || '2025'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: project.location?.city || project.location?.address || 'Cyprus'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: About */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              About the <br />
              <span className="text-orange-600">Project</span>
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-xl mb-6">
                {project.description || project.short_description || 'Discover luxury living at its finest.'}
              </p>

              {project.long_description && (
                <p className="text-base text-gray-600">
                  {project.long_description}
                </p>
              )}
            </div>

            {project.developer_name && (
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-500 mb-1">Developed by</p>
                <p className="text-xl font-semibold text-gray-900">{project.developer_name}</p>
              </div>
            )}
          </motion.div>

          {/* Right: Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-50 p-8 rounded-2xl hover:bg-gray-100 transition-colors duration-300"
                >
                  <Icon className="w-8 h-8 text-orange-600 mb-4" />
                  <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </motion.div>
              );
            })}

            {/* Investment Highlights */}
            {project.golden_visa_eligible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200"
              >
                <Shield className="w-8 h-8 text-amber-600 mb-4" />
                <p className="text-sm text-amber-700 mb-2 uppercase tracking-wider">Investment</p>
                <p className="text-2xl font-bold text-amber-900">Golden Visa Eligible</p>
                <p className="text-sm text-amber-700 mt-2">Qualify for Cyprus residency</p>
              </motion.div>
            )}

            {project.rental_yield && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200"
              >
                <TrendingUp className="w-8 h-8 text-green-600 mb-4" />
                <p className="text-sm text-green-700 mb-2 uppercase tracking-wider">Returns</p>
                <p className="text-2xl font-bold text-green-900">{project.rental_yield}% Rental Yield</p>
                <p className="text-sm text-green-700 mt-2">Expected annual return</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
