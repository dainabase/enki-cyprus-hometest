import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  fallbackSrc?: string;
  showSkeleton?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  objectFit = 'cover',
  onLoad,
  onError,
  fallbackSrc = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  showSkeleton = true,
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Reset state when src changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.error(`Failed to load image: ${currentSrc}`);
    setImageError(true);

    // Try fallback if not already using it
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      onError?.(new Error(`Image load failed: ${src}`));
    }
  };

  const imageProps = {
    src: currentSrc,
    alt,
    width,
    height,
    loading,
    onLoad: handleLoad,
    onError: handleError,
    className: cn(
      'transition-opacity duration-500',
      imageLoaded ? 'opacity-100' : 'opacity-0',
      className
    ),
    style: {
      objectFit,
    },
  };

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ width, height }}>
      {/* Skeleton Loader */}
      {showSkeleton && !imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}

      {/* Image */}
      {!imageError && (
        prefersReducedMotion ? (
          <img {...imageProps} />
        ) : (
          <motion.img
            {...imageProps}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        )
      )}

      {/* Error State */}
      {imageError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-2 text-neutral-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-xs text-neutral-500">Image non disponible</p>
          </div>
        </div>
      )}
    </div>
  );
}
