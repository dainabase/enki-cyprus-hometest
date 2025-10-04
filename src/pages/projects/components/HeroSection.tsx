'use client';

import React, { useState } from 'react';
import { formatPrice, formatArea } from '@/lib/utils/formatters';
import { MapPin, Calendar, Chrome as Home, Ruler, Euro } from 'lucide-react';

interface HeroSectionProps {
  project: any;
}

export default function HeroSection({ project }: HeroSectionProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageFallback, setImageFallback] = useState<string | null>(null);

  // Extract hero image URL from various sources
  const getHeroImage = () => {
    // Check project_images table first
    const primaryImage = project.project_images?.find((i: any) => i.is_primary);
    if (primaryImage?.url) return primaryImage.url;

    // Check photos array (objects with url property)
    const primaryPhoto = project.photos?.find((p: any) => p.isPrimary);
    if (primaryPhoto?.url) return primaryPhoto.url;
    if (project.photos?.[0]?.url) return project.photos[0].url;

    // Check photo_gallery_urls array (direct URLs)
    if (project.photo_gallery_urls?.[0]) return project.photo_gallery_urls[0];

    // Fallback
    return project.main_image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200';
  };

  const heroImage = getHeroImage();
  const videoUrl = project.video_url || project.drone_footage_urls?.[0];

  const quickStats = [
    {
      icon: <Euro className="w-6 h-6" />,
      label: 'Price From',
      value: project.price_from ? formatPrice(project.price_from) : 'On Request',
    },
    {
      icon: <Home className="w-6 h-6" />,
      label: 'Units',
      value: `${project.total_units || 'Multiple'} units`,
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Completion',
      value: project.completion_date || project.expected_completion || 'To be announced',
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      label: 'Size Range',
      value: project.square_meters_min && project.square_meters_max
        ? `${formatArea(project.square_meters_min)} - ${formatArea(project.square_meters_max)}`
        : 'Various sizes',
    },
  ];

  return (
    <section className="relative w-full h-screen bg-black flex flex-col">
      {/* Background */}
      <div className="absolute inset-0">
        {videoUrl && !videoError ? (
          <video
            className="w-full h-full object-cover opacity-60"
            autoPlay
            muted
            loop
            playsInline
            poster={heroImage}
            onError={() => setVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : heroImage ? (
          <img
            src={imageFallback || heroImage}
            alt={project.title}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              if (!imageFallback) {
                setImageFallback('/og-image.jpg');
              } else {
                e.currentTarget.onerror = null;
              }
            }}
          />
        ) : null}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="flex items-center gap-2 mb-8">
          <MapPin className="w-4 h-4 text-white/60" />
          <p className="text-white/60 text-sm tracking-[0.2em] uppercase font-light">
            {project.city}{project.district && `, ${project.district}`}, Cyprus
          </p>
        </div>

        <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-[0.95] mb-16 max-w-7xl">
          {project.title}
        </h1>

        <button
          className="px-12 py-4 bg-white text-black text-sm tracking-wider uppercase font-medium hover:bg-white/90 transition-all duration-300"
          onClick={() => {
            document.getElementById('contact-form')?.scrollIntoView({
              behavior: 'smooth'
            });
          }}
        >
          Inquire
        </button>
      </div>

      {/* KPI Stats cards */}
      <div className="absolute bottom-24 left-0 right-0 z-10">
        <div className="max-w-[1190px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-[2px] p-6 text-center shadow-lg"
              >
                <div className="flex justify-center mb-3 text-black/60">
                  {stat.icon}
                </div>
                <p className="text-xs uppercase tracking-wider text-black/60 mb-2 font-medium">
                  {stat.label}
                </p>
                <p className="text-sm md:text-base font-medium text-black">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
