import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-black/5 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover select-none"
          loading="lazy"
          draggable={false}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 border border-black/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 border border-black/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </button>
        </>
      )}

      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/70 text-white px-2 py-1 text-xs sm:text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex gap-1.5 sm:gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`min-w-[24px] min-h-[24px] w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
