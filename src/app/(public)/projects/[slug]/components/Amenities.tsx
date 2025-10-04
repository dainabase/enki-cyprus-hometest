'use client';

import React from 'react';

interface AmenitiesProps {
  project: any;
}

export default function Amenities({ project }: AmenitiesProps) {
  const projectAmenities = project.project_amenities || [];

  const fallbackAmenities = [
    { amenity: { name: 'Swimming Pool' } },
    { amenity: { name: 'Fitness Center' } },
    { amenity: { name: 'Parking' } },
    { amenity: { name: 'Garden' } },
    { amenity: { name: 'WiFi' } },
    { amenity: { name: '24/7 Security' } }
  ];

  const displayAmenities = projectAmenities.length > 0 ? projectAmenities : fallbackAmenities;

  if (displayAmenities.length === 0) return null;

  return (
    <section className="bg-white py-32 lg:py-48">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            Amenities
          </h2>
        </div>

        {/* Simple List */}
        <div className="space-y-6">
          {displayAmenities.map((item: any, index: number) => (
            <div
              key={index}
              className="text-lg md:text-xl text-black/80 font-light border-b border-black/10 pb-6"
            >
              {item.amenity.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
