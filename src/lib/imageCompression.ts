/**
 * Image compression utility using browser-image-compression
 * Requires: npm install browser-image-compression
 */

import type { Options } from 'browser-image-compression';

/**
 * Compresses an image file if it exceeds the minimum size threshold
 * @param file - The image file to compress
 * @param options - Optional compression options
 * @returns Compressed file or original if under threshold
 */
export async function compressImage(
  file: File,
  options?: Partial<Options>
): Promise<File> {
  // Skip compression for small files (< 100KB)
  if (file.size < 100 * 1024) {
    return file;
  }

  // Skip non-image files
  if (!file.type.startsWith('image/')) {
    return file;
  }

  try {
    // Lazy load browser-image-compression
    const imageCompression = (await import('browser-image-compression')).default;

    const defaultOptions: Options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type as Options['fileType'],
      ...options,
    };

    const compressedFile = await imageCompression(file, defaultOptions);

    // Return original if compression didn't help
    if (compressedFile.size >= file.size) {
      return file;
    }

    return compressedFile;
  } catch {
    // Return original file if compression fails
    return file;
  }
}

/**
 * Compresses multiple images in parallel
 * @param files - Array of image files
 * @param options - Optional compression options
 * @returns Array of compressed files
 */
export async function compressImages(
  files: File[],
  options?: Partial<Options>
): Promise<File[]> {
  return Promise.all(files.map(file => compressImage(file, options)));
}

/**
 * Converts an image file to WebP format with compression
 * @param file - The image file to convert
 * @returns WebP compressed file
 */
export async function convertToWebP(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  try {
    const imageCompression = (await import('browser-image-compression')).default;

    return await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    });
  } catch {
    return file;
  }
}
