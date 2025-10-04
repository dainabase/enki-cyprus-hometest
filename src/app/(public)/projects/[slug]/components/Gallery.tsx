'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryProps {
  project: any;
}

export default function Gallery({ project }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  const allImages = [
    ...(project.photos || []),
    ...(project.photo_gallery_urls || []),
    ...(project.project_images?.map((img: any) => img.url) || [])
  ].filter(Boolean);

  const hasVirtualTour = project.virtual_tour_url || project.virtual_tour_url_new;

  if (!allImages.length) return null;

  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Gallery
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-white/60">{allImages.length} Images</p>
            {hasVirtualTour && (
              <Button
                onClick={() => setShowVirtualTour(true)}
                className="bg-white text-black hover:bg-white/90 rounded-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Virtual Tour
              </Button>
            )}
          </div>
        </motion.div>

        {/* Grid - Asymmetric Wild Layout */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Large Featured Image */}
          {allImages[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="col-span-12 md:col-span-8 row-span-2 group cursor-pointer relative overflow-hidden rounded-3xl aspect-[16/10]"
              onClick={() => setSelectedImage(allImages[0])}
            >
              <img
                src={allImages[0]}
                alt="Project main"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-black" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Right Column - Two Stacked */}
          {allImages[1] && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="col-span-12 md:col-span-4 group cursor-pointer relative overflow-hidden rounded-3xl aspect-[4/3]"
              onClick={() => setSelectedImage(allImages[1])}
            >
              <img
                src={allImages[1]}
                alt="Project"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          )}

          {allImages[2] && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="col-span-12 md:col-span-4 group cursor-pointer relative overflow-hidden rounded-3xl aspect-[4/3]"
              onClick={() => setSelectedImage(allImages[2])}
            >
              <img
                src={allImages[2]}
                alt="Project"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          )}

          {/* Bottom Row - Three Equal */}
          {allImages.slice(3, 6).map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="col-span-12 md:col-span-4 group cursor-pointer relative overflow-hidden rounded-3xl aspect-video"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt="Project"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          ))}

          {/* More Images Indicator */}
          {allImages.length > 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="col-span-12 md:col-span-4 group cursor-pointer relative overflow-hidden rounded-3xl aspect-video"
              onClick={() => setSelectedImage(allImages[6])}
            >
              <img
                src={allImages[6]}
                alt="More"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-5xl font-bold mb-2">+{allImages.length - 6}</p>
                  <p className="text-lg">More Images</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 p-0"
            >
              <X className="w-6 h-6" />
            </Button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImage}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtual Tour Modal */}
      <AnimatePresence>
        {showVirtualTour && hasVirtualTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
            onClick={() => setShowVirtualTour(false)}
          >
            <div className="relative w-full max-w-7xl h-[80vh] bg-black rounded-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <Button
                onClick={() => setShowVirtualTour(false)}
                className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 p-0"
              >
                <X className="w-6 h-6" />
              </Button>
              <iframe
                src={project.virtual_tour_url || project.virtual_tour_url_new}
                className="w-full h-full"
                allowFullScreen
                title="Virtual Tour"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
