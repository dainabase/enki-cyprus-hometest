'use client';

import React, { useState } from 'react';
import { formatPrice } from '@/lib/utils/formatters';

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

  const city = project.city || project.location?.city || project.location?.address || 'Cyprus';
  const price = project.price_from || project.price_from_new || project.price;

  return (
    <section className="relative w-full h-screen bg-black">
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
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/60 text-sm tracking-[0.2em] uppercase mb-8 font-light">
          {city}
        </p>

        <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-[0.95] mb-12 max-w-7xl">
          {project.title}
        </h1>

        {price && (
          <p className="text-white/80 text-lg sm:text-xl md:text-2xl font-light mb-16">
            From {formatPrice(price)}
          </p>
        )}

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

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-[1px] h-16 bg-white/30" />
      </div>
    </section>
  );
}
