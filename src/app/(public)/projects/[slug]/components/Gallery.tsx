'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  X, 
  Play,
  Eye
} from 'lucide-react';
import { motion, useMotionValue } from 'framer-motion';

interface GalleryProps {
  project: any;
}

export default function Gallery({ project }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  // Combine all media sources
  const allImages = [
    ...(project.photos || []),
    ...(project.photo_gallery_urls || []),
    ...(project.project_images?.map((img: any) => img.url) || [])
  ].filter(Boolean);

  const totalImages = allImages.length;
  const hasVirtualTour = project.virtual_tour_url || project.virtual_tour_url_new;

  // Swipe carousel setup (auto-advance + drag)
  const ONE_SECOND = 1000;
  const AUTO_DELAY = ONE_SECOND * 10;
  const DRAG_BUFFER = 50;
  const SPRING_OPTIONS = {
    type: 'spring' as const,
    mass: 3,
    stiffness: 400,
    damping: 50,
  };
  const [imgIndex, setImgIndex] = useState(0);
  const dragX = useMotionValue(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();
      if (x === 0 && totalImages > 0) {
        setImgIndex((pv) => (pv === totalImages - 1 ? 0 : pv + 1));
      }
    }, AUTO_DELAY);
    return () => clearInterval(intervalRef);
  }, [dragX, totalImages]);

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -DRAG_BUFFER && imgIndex < totalImages - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };


  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };
  if (!totalImages || totalImages === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Photo Gallery</h2>
            <p className="text-muted-foreground">Photos coming soon...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Photo Gallery</h2>
          <p className="text-muted-foreground">
            Explore {totalImages} high-quality images of the property
          </p>
        </div>

        {/* Main Gallery - Swipe Carousel */}
        <div className="relative overflow-hidden bg-neutral-950 py-8 rounded-[40px]">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x: dragX }}
            animate={{ translateX: `-${imgIndex * 100}%` }}
            transition={SPRING_OPTIONS}
            onDragEnd={onDragEnd}
            className="flex cursor-grab items-center active:cursor-grabbing"
          >
            {allImages.map((imgSrc, idx) => (
              <motion.div
                key={idx}
                style={{
                  backgroundImage: `url(${imgSrc})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                animate={{ scale: imgIndex === idx ? 0.95 : 0.85 }}
                transition={SPRING_OPTIONS}
                className="aspect-video w-screen shrink-0 rounded-xl bg-neutral-800 object-cover"
              />
            ))}
          </motion.div>

          {/* Dots */}
          <div className="mt-4 flex w-full justify-center gap-2">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setImgIndex(idx)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  idx === imgIndex ? 'bg-neutral-50' : 'bg-neutral-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Gradient Edges */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />
        </div>

        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 z-10"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <img
              src={allImages[currentIndex]}
              alt={`${project.title} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {totalImages > 1 && (
              <>
                <Button
                  variant="secondary"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="secondary"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
        )}

        {/* Virtual Tour Modal */}
        {showVirtualTour && hasVirtualTour && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl h-[80vh] bg-white rounded-lg overflow-hidden">
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 z-10"
                onClick={() => setShowVirtualTour(false)}
              >
                <X className="w-4 h-4" />
              </Button>
              
              <iframe
                src={project.virtual_tour_url || project.virtual_tour_url_new}
                className="w-full h-full"
                allowFullScreen
                title="Virtual Tour"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}