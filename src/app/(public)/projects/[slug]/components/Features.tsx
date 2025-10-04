'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Zap, Droplet, Wind, Shield, Wifi,
  Car, Trees, Dumbbell, Home, Sun, Lock
} from 'lucide-react';

interface FeaturesProps {
  project: any;
}

export default function Features({ project }: FeaturesProps) {
  const categories = [
    {
      title: 'Energy & Sustainability',
      items: [
        project.energy_certificate && { label: 'Energy Certificate', value: project.energy_certificate },
        project.solar_panels && { label: 'Solar Panels', value: 'Yes' },
        project.photovoltaic_system && { label: 'Photovoltaic System', value: 'Yes' },
        project.thermal_insulation && { label: 'Thermal Insulation', value: project.thermal_insulation },
        project.eco_friendly && { label: 'Eco-Friendly', value: 'Yes' },
      ].filter(Boolean),
    },
    {
      title: 'Security & Safety',
      items: [
        project.security_24_7 && { label: '24/7 Security', value: 'Yes' },
        project.gated_community && { label: 'Gated Community', value: 'Yes' },
        project.cctv && { label: 'CCTV', value: 'Yes' },
        project.fire_safety && { label: 'Fire Safety System', value: 'Yes' },
        project.earthquake_resistant && { label: 'Earthquake Resistant', value: 'Yes' },
      ].filter(Boolean),
    },
    {
      title: 'Infrastructure',
      items: [
        project.elevators && { label: 'Elevators', value: project.elevators },
        project.parking_spaces && { label: 'Parking Spaces', value: project.parking_spaces },
        project.storage_rooms && { label: 'Storage Rooms', value: project.storage_rooms },
        project.fiber_optic && { label: 'Fiber Optic', value: 'Yes' },
        project.smart_home && { label: 'Smart Home System', value: 'Yes' },
      ].filter(Boolean),
    },
    {
      title: 'Facilities',
      items: [
        project.swimming_pool && { label: 'Swimming Pool', value: 'Yes' },
        project.gym && { label: 'Fitness Center', value: 'Yes' },
        project.spa && { label: 'Spa', value: 'Yes' },
        project.playground && { label: 'Playground', value: 'Yes' },
        project.common_garden && { label: 'Common Garden', value: 'Yes' },
      ].filter(Boolean),
    },
  ].filter(cat => cat.items.length > 0);

  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-32 lg:py-48">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            Features & Facilities
          </h2>
          <p className="text-lg md:text-xl text-black/60 font-light max-w-3xl">
            {project.title} offers a comprehensive range of modern amenities designed for comfortable living.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-24">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-2xl font-light text-black mb-8 tracking-tight">
                {category.title}
              </h3>
              <div className="space-y-6">
                {category.items.map((item: any, itemIndex: number) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                    className="flex items-start justify-between border-b border-black/5 pb-4"
                  >
                    <span className="text-base md:text-lg text-black/70 font-light">
                      {item.label}
                    </span>
                    <span className="text-base md:text-lg text-black font-light">
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
