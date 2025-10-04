'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Download } from 'lucide-react';

interface FloorPlansProps {
  project: any;
}

export default function FloorPlans({ project }: FloorPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const floorPlans = project.floor_plans || [];
  const buildings = project.buildings || [];

  if (floorPlans.length === 0 && buildings.length === 0) {
    return null;
  }

  return (
    <section className="bg-neutral-50 py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            Floor Plans & Units
          </h2>
          <p className="text-lg text-black/60 font-light">
            Explore available unit types and configurations
          </p>
        </motion.div>

        {/* Buildings Overview */}
        {buildings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {buildings.map((building: any, index: number) => (
              <motion.div
                key={building.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-light text-black mb-4">
                  {building.building_name || `Building ${index + 1}`}
                </h3>
                <div className="space-y-3">
                  {building.floors_above_ground && (
                    <div className="flex justify-between text-sm">
                      <span className="text-black/50">Floors</span>
                      <span className="text-black font-light">{building.floors_above_ground}</span>
                    </div>
                  )}
                  {building.total_units && (
                    <div className="flex justify-between text-sm">
                      <span className="text-black/50">Total Units</span>
                      <span className="text-black font-light">{building.total_units}</span>
                    </div>
                  )}
                  {building.building_class && (
                    <div className="flex justify-between text-sm">
                      <span className="text-black/50">Class</span>
                      <span className="text-black font-light uppercase">{building.building_class}</span>
                    </div>
                  )}
                  {building.energy_certificate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-black/50">Energy</span>
                      <span className="text-black font-light uppercase">{building.energy_certificate}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Floor Plans Grid */}
        {floorPlans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {floorPlans.map((plan: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white overflow-hidden cursor-pointer group"
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                  {plan.image_url || plan.url ? (
                    <img
                      src={plan.image_url || plan.url}
                      alt={plan.name || `Floor plan ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/20">
                      <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-light text-black mb-2">
                    {plan.name || plan.unit_type || `Plan ${index + 1}`}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {plan.bedrooms && (
                      <span className="text-black/60">{plan.bedrooms} Bed</span>
                    )}
                    {plan.bathrooms && (
                      <span className="text-black/60">{plan.bathrooms} Bath</span>
                    )}
                    {plan.area_m2 && (
                      <span className="text-black/60">{plan.area_m2}m²</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-white hover:text-white/70 transition-colors"
                onClick={() => setSelectedPlan(null)}
              >
                <X className="w-8 h-8" />
              </button>

              <img
                src={selectedPlan.image_url || selectedPlan.url}
                alt={selectedPlan.name || 'Floor plan'}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              <div className="mt-6 text-center text-white">
                <h3 className="text-2xl font-light mb-4">
                  {selectedPlan.name || selectedPlan.unit_type}
                </h3>
                {(selectedPlan.bedrooms || selectedPlan.bathrooms || selectedPlan.area_m2) && (
                  <div className="flex justify-center gap-8 text-white/80">
                    {selectedPlan.bedrooms && (
                      <span>{selectedPlan.bedrooms} Bedrooms</span>
                    )}
                    {selectedPlan.bathrooms && (
                      <span>{selectedPlan.bathrooms} Bathrooms</span>
                    )}
                    {selectedPlan.area_m2 && (
                      <span>{selectedPlan.area_m2}m²</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
