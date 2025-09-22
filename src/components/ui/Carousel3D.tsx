import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property } from '@/lib/supabase';
import { trackCustomEvent } from '@/lib/analytics';

interface ProjectInterest {
  name: string;
  link: string;
  desc: string;
}

interface Carousel3DProps {
  properties: Property[];
  interests: Record<string, ProjectInterest[]>;
  onInterestClick: (interest: ProjectInterest) => void;
}

const Carousel3D: React.FC<Carousel3DProps> = ({ properties, interests, onInterestClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (properties.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % properties.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [properties.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % properties.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + properties.length) % properties.length);

  if (properties.length === 0) return null;

  const currentProperty = properties[currentSlide];
  const locationKey = (currentProperty as any).city?.toLowerCase() || 
                     (currentProperty as any).location?.toLowerCase() || 'limassol';
  const rawInterests = (interests && (interests as any)[locationKey]) ?? (interests as any)?.['limassol'];
  const currentInterests: ProjectInterest[] = Array.isArray(rawInterests) ? rawInterests : [];

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <div className="relative w-full h-full">
        {properties.map((property, index) => {
          const isActive = index === currentSlide;
          if (!isActive) return null;

          return (
            <motion.div key={property.id} className="absolute inset-0">
              <Card className="h-full shadow-2xl overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col lg:flex-row">
                  <div className="lg:w-2/3 relative overflow-hidden">
                    <img
                      src={property.photos?.[0] || `https://picsum.photos/800x600?random=${property.id}`}
                      alt={property.title}
                      className="w-full h-64 lg:h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <Badge className="mb-3 bg-primary text-white">
                        {property.type}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {(currentProperty as any).city || (currentProperty as any).location || 'Location non définie'}
                          </span>
                        </div>
                      <div className="text-xl font-bold">{property.price}</div>
                    </div>
                  </div>
                  <div className="lg:w-1/3 p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Centres d'intérêt
                    </h4>
                    <div className="space-y-3">
                      {currentInterests.map((interest, idx) => (
                        <button
                          key={idx}
                          onClick={() => onInterestClick(interest)}
                          className="w-full text-left p-3 rounded-lg border hover:border-primary/50 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm mb-1">{interest.name}</h5>
                              <p className="text-xs text-muted-foreground">{interest.desc}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={prevSlide}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="sm" onClick={nextSlide}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {properties.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full border-2 transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel3D;