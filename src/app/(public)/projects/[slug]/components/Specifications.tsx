'use client';

import React from 'react';
import { formatPrice, formatArea, formatDistance } from '@/lib/utils/formatters';

interface SpecificationsProps {
  project: any;
}

export default function Specifications({ project }: SpecificationsProps) {
  const specs = [
    {
      label: 'Bedrooms',
      value: project.bedrooms_range || 'Studio - 3BR',
    },
    {
      label: 'Area',
      value: project.built_area_m2 ? formatArea(project.built_area_m2) : '50-200 m²',
    },
    {
      label: 'Price',
      value: `${formatPrice(project.price_from_new || project.price)} + ${project.vat_rate || 5}% VAT`,
    },
    {
      label: 'Sea Distance',
      value: project.proximity_sea_km ? formatDistance(project.proximity_sea_km) : 'N/A',
    },
    {
      label: 'Airport',
      value: project.proximity_airport_km ? formatDistance(project.proximity_airport_km) : 'N/A',
    },
    {
      label: 'Energy',
      value: project.energy_rating || 'A+',
    },
    {
      label: 'Completion',
      value: project.completion_date || 'Q4 2024',
    },
    {
      label: 'Units',
      value: project.total_units_new || project.total_units || 'N/A',
    },
  ];

  return (
    <section className="bg-neutral-50 py-32 lg:py-48">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            Specifications
          </h2>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {specs.map((spec, index) => (
            <div key={index} className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-black/40 font-medium">
                {spec.label}
              </p>
              <p className="text-xl md:text-2xl font-light text-black">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
