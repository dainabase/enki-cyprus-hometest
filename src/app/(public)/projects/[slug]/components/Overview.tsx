'use client';

import React from 'react';

interface OverviewProps {
  project: any;
}

export default function Overview({ project }: OverviewProps) {
  const description = project.detailed_description || project.description || '';

  let uspPoints = [];
  if (project.unique_selling_points) {
    uspPoints = Array.isArray(project.unique_selling_points)
      ? project.unique_selling_points
      : JSON.parse(project.unique_selling_points);
  }

  const latitude = project.gps_latitude || 34.7768;
  const longitude = project.gps_longitude || 32.4245;
  const city = project.location?.city || project.location?.address || 'Cyprus';

  return (
    <section className="bg-white py-32 lg:py-48">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            Overview
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32">
          {/* Left: Description */}
          <div className="space-y-16">
            <div>
              <p className="text-lg md:text-xl text-black/60 font-light leading-relaxed">
                {description}
              </p>
            </div>

            {/* Features */}
            {uspPoints.length > 0 && (
              <div className="space-y-4">
                {uspPoints.slice(0, 5).map((point, index) => (
                  <div
                    key={index}
                    className="text-base md:text-lg text-black/80 font-light border-b border-black/10 pb-4"
                  >
                    {point}
                  </div>
                ))}
              </div>
            )}

            {/* Location */}
            <div>
              <p className="text-sm uppercase tracking-wider text-black/40 mb-2 font-medium">
                Location
              </p>
              <p className="text-lg text-black font-light">{city}</p>
            </div>
          </div>

          {/* Right: Map */}
          <div className="lg:sticky lg:top-24 h-[500px] lg:h-[600px]">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.${latitude}!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzM2LjUiTiAzMsKwMjUnMjguMiJF!5e0!3m2!1sen!2scy!4v1234567890123!5m2!1sen!2scy`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
