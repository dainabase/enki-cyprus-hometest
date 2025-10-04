'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryProps {
  project: any;
}

export default function Gallery({ project }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Collect all images from different sources
  const allImages = [
    // Extract URLs from photos array (objects with url property)
    ...(project.photos?.map((p: any) => p.url || p) || []),
    // Direct URLs from photo_gallery_urls
    ...(project.photo_gallery_urls || []),
    // URLs from project_images table
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            Gallery
          </h2>
          <p className="text-lg text-black/40 font-light">{totalImages} Images</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-8"
        >
          <div
            className="relative w-full aspect-[16/9] bg-black cursor-pointer group overflow-hidden"
            onClick={() => setIsFullscreen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={allImages[currentIndex]}
                alt={`${project.title} - Image ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://picsum.photos/1200/675?random=${currentIndex + 1}`;
                }}
              />
            </AnimatePresence>

            {totalImages > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="w-5 h-5 text-black" />
                </motion.button>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute top-6 right-6 px-4 py-2 bg-white/90 text-black text-sm font-light"
            >
              {currentIndex + 1} / {totalImages}
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
          {allImages.slice(0, 10).map((image, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: index === currentIndex ? 1 : 0.4, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ opacity: 0.7 }}
              onClick={() => setCurrentIndex(index)}
              className={`aspect-square overflow-hidden transition-all duration-200`}
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
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white flex items-center justify-center"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-5 h-5 text-black" />
            </motion.button>

            <motion.img
              key={`fullscreen-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              src={allImages[currentIndex]}
              alt={`${project.title} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {totalImages > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white flex items-center justify-center"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6 text-black" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white flex items-center justify-center"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6 text-black" />
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
