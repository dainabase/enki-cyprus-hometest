'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Plane, Waves, Building2, ShoppingBag, GraduationCap, Heart } from 'lucide-react';
import { formatDistance } from '@/lib/utils/formatters';

interface LocationProps {
  project: any;
}

export default function Location({ project }: LocationProps) {
  const latitude = project.gps_latitude || 34.7768;
  const longitude = project.gps_longitude || 32.4245;

  const proximities = [
    {
      icon: <Waves className="w-6 h-6" />,
      label: 'Beach / Sea',
      distance: project.proximity_sea_km,
      color: 'text-blue-500',
    },
    {
      icon: <Plane className="w-6 h-6" />,
      label: 'Airport',
      distance: project.proximity_airport_km,
      color: 'text-purple-500',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      label: 'City Center',
      distance: project.proximity_city_center_km,
      color: 'text-gray-500',
    },
    {
      icon: <Navigation className="w-6 h-6" />,
      label: 'Highway',
      distance: project.proximity_highway_km,
      color: 'text-orange-500',
    },
  ].filter(item => item.distance);

  const nearbyAmenities = [
    { icon: <ShoppingBag className="w-5 h-5" />, name: 'Shopping', available: project.mini_market },
    { icon: <GraduationCap className="w-5 h-5" />, name: 'Schools', available: true },
    { icon: <Heart className="w-5 h-5" />, name: 'Healthcare', available: true },
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            Location & Accessibility
          </h2>
          <div className="flex items-center gap-3 text-lg text-black/60 font-light">
            <MapPin className="w-5 h-5" />
            <span>
              {project.full_address || `${project.street_address || ''} ${project.city}, ${project.cyprus_zone || 'Cyprus'}`}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24 h-[500px] lg:h-[600px]"
          >
            <div className="w-full h-full bg-neutral-100 overflow-hidden">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.${latitude}!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzM2LjUiTiAzMsKwMjUnMjguMiJF!5e0!3m2!1sen!2scy!4v1234567890123!5m2!1sen!2scy`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Proximities & Amenities */}
          <div className="space-y-12">
            {/* Proximities */}
            {proximities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl md:text-3xl font-light text-black mb-8">
                  Distance to Key Points
                </h3>
                <div className="space-y-6">
                  {proximities.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between pb-6 border-b border-black/10 group hover:border-black/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`${item.color} transition-transform group-hover:scale-110`}>
                          {item.icon}
                        </div>
                        <span className="text-lg font-light text-black">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-lg font-light text-black/60">
                        {formatDistance(item.distance)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Nearby Amenities */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl md:text-3xl font-light text-black mb-8">
                Nearby Amenities
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {nearbyAmenities.map((amenity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                  >
                    <div className="text-black/40">{amenity.icon}</div>
                    <span className="text-sm font-light text-black">{amenity.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Neighborhood Description */}
            {project.neighborhood_description && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-8 border-t border-black/10"
              >
                <h3 className="text-2xl font-light text-black mb-4">
                  About the Neighborhood
                </h3>
                <p className="text-base text-black/70 font-light leading-relaxed">
                  {project.neighborhood_description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
