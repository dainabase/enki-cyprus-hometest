'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryProps {
  project: any;
}

export default function Gallery({ project }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const allImages = [
    ...(project.photos || []),
    ...(project.photo_gallery_urls || []),
    ...(project.project_images?.map((img: any) => img.url) || [])
  ].filter(Boolean);

  const totalImages = allImages.length;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  if (!totalImages || totalImages === 0) {
    return null;
  }

  return (
    <section className="bg-white py-32 lg:py-48">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            Gallery
          </h2>
          <p className="text-lg text-black/40 font-light">{totalImages} Images</p>
        </div>

        {/* Main Image */}
        <div className="relative mb-8">
          <div
            className="relative w-full aspect-[16/9] bg-black cursor-pointer group overflow-hidden"
            onClick={() => setIsFullscreen(true)}
          >
            <img
              src={allImages[currentIndex]}
              alt={`${project.title} - Image ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://picsum.photos/1200/675?random=${currentIndex + 1}`;
              }}
            />

            {/* Navigation */}
            {totalImages > 1 && (
              <>
                <button
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </button>

                <button
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="w-5 h-5 text-black" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 text-black text-sm font-light">
              {currentIndex + 1} / {totalImages}
            </div>
          </div>
        </div>

        {/* Thumbnails Grid */}
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
          {allImages.slice(0, 10).map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`aspect-square overflow-hidden transition-all duration-200 ${
                index === currentIndex
                  ? 'opacity-100'
                  : 'opacity-40 hover:opacity-70'
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
          <button
            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-5 h-5 text-black" />
          </button>

          <img
            src={allImages[currentIndex]}
            alt={`${project.title} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {totalImages > 1 && (
            <>
              <button
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white flex items-center justify-center"
                onClick={prevImage}
              >
                <ChevronLeft className="w-6 h-6 text-black" />
              </button>

              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white flex items-center justify-center"
                onClick={nextImage}
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
