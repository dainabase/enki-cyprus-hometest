'use client';

import React, { useState } from 'react';
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

        {/* Main Gallery */}
        <div className="relative">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-muted">
                <img
                  src={allImages[currentIndex]}
                  alt={`${project.title} - Image ${currentIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsFullscreen(true)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://picsum.photos/1200/675?random=${currentIndex + 1}`;
                  }}
                />
                
                {/* Navigation Arrows */}
                {totalImages > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {/* Counter */}
                <Badge className="absolute top-4 right-4 bg-black/70 text-white">
                  {currentIndex + 1} / {totalImages}
                </Badge>

                {/* Fullscreen Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Maximize className="w-4 h-4" />
                </Button>

                {/* Virtual Tour Button */}
                {hasVirtualTour && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 left-4 bg-primary hover:bg-primary/90 text-white"
                    onClick={() => setShowVirtualTour(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Virtual Tour
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Thumbnails */}
          <div className="mt-4 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {allImages.slice(0, 10).map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-primary shadow-lg' 
                    : 'border-transparent hover:border-muted-foreground'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://picsum.photos/200/200?random=${index + 1}`;
                  }}
                />
              </button>
            ))}
            
          </div>
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