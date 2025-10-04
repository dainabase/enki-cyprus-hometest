/**
 * Safely extracts an image URL from a project object
 * Handles different photo formats (object with url property vs direct URL string)
 */
export const getProjectImageUrl = (project: any): string | null => {
  // Try photos array first (objects with url property)
  if (Array.isArray(project.photos) && project.photos.length > 0) {
    const firstPhoto = project.photos[0];
    
    // If it's an object with url property, extract url
    if (typeof firstPhoto === 'object' && firstPhoto !== null && 'url' in firstPhoto) {
      return firstPhoto.url;
    }
    
    // If it's already a string URL
    if (typeof firstPhoto === 'string') {
      return firstPhoto;
    }
  }

  // Try photo_gallery_urls array (direct URLs)
  if (Array.isArray(project.photo_gallery_urls) && project.photo_gallery_urls.length > 0) {
    return project.photo_gallery_urls[0];
  }

  // Fallback to main_image_url if exists
  if (project.main_image_url) {
    return project.main_image_url;
  }

  // No valid image found
  return null;
};
