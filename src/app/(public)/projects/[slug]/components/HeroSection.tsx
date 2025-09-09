'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatArea } from '@/lib/utils/formatters';
import { MapPin, Crown, Bed, Home, Calendar } from 'lucide-react';

interface HeroSectionProps {
  project: any;
}

export default function HeroSection({ project }: HeroSectionProps) {
  const [videoError, setVideoError] = useState(false);
  
  const heroImage = project.photos?.[0] || project.photo_gallery_urls?.[0];
  const videoUrl = project.video_url || project.drone_footage_urls?.[0];

  const specs = [
    {
      icon: <Bed className="w-4 h-4" />,
      label: project.bedrooms_range || 'Studio - 3BR',
    },
    {
      icon: <Home className="w-4 h-4" />,
      label: project.built_area_m2 ? formatArea(project.built_area_m2) : '50-200 m²',
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: `${project.city || project.cyprus_zone}, Chypre`,
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: project.completion_date || 'Q4 2024',
    },
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        {videoUrl && !videoError ? (
          <video
            className="w-full h-full object-cover"
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
            src={heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Golden Visa Badge */}
        {project.golden_visa_eligible && (
          <Badge className="mb-4 bg-amber-600 hover:bg-amber-700 text-white">
            <Crown className="w-4 h-4 mr-2" />
            Golden Visa Eligible
          </Badge>
        )}

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          {project.title}
        </h1>

        {/* Tagline with Price */}
        <div className="text-xl sm:text-2xl lg:text-3xl mb-8 text-white/90">
          {project.subtitle && (
            <p className="mb-2">{project.subtitle}</p>
          )}
          <p className="font-semibold">
            From {formatPrice(project.price_from_new || project.price)}
            {project.vat_rate && (
              <span className="text-lg ml-2 text-white/80">+ {project.vat_rate}% VAT</span>
            )}
          </p>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center justify-center space-x-2 text-sm sm:text-base">
              {spec.icon}
              <span>{spec.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Principal */}
        <Button 
          size="lg" 
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold"
          onClick={() => {
            // Scroll to contact form
            document.getElementById('contact-form')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        >
          Book a Viewing
        </Button>

      </div>
    </section>
  );
}