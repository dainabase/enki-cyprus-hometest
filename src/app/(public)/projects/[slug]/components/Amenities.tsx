'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Waves,
  Dumbbell,
  Car,
  Trees,
  Wifi,
  Shield,
  Utensils,
  ShoppingBag,
  Heart,
  Sun
} from 'lucide-react';

interface AmenitiesProps {
  project: any;
}

const iconMap: any = {
  pool: Waves,
  gym: Dumbbell,
  parking: Car,
  garden: Trees,
  wifi: Wifi,
  security: Shield,
  restaurant: Utensils,
  shopping: ShoppingBag,
  spa: Heart,
  terrace: Sun
};

export default function Amenities({ project }: AmenitiesProps) {
  const projectAmenities = project.project_amenities || [];

  const fallbackAmenities = [
    { amenity: { name: 'Swimming Pool', icon: 'pool' } },
    { amenity: { name: 'Fitness Center', icon: 'gym' } },
    { amenity: { name: 'Parking', icon: 'parking' } },
    { amenity: { name: 'Garden', icon: 'garden' } },
    { amenity: { name: 'High-Speed WiFi', icon: 'wifi' } },
    { amenity: { name: '24/7 Security', icon: 'security' } },
    { amenity: { name: 'Restaurant', icon: 'restaurant' } },
    { amenity: { name: 'Spa & Wellness', icon: 'spa' } }
  ];

  const displayAmenities = projectAmenities.length > 0 ? projectAmenities : fallbackAmenities;

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Amenities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium facilities designed for your lifestyle
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {displayAmenities.slice(0, 8).map((item: any, index: number) => {
            const amenity = item.amenity;
            const Icon = iconMap[amenity.icon] || Shield;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{amenity.name}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
