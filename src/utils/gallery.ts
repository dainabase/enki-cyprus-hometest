/**
 * Utilitaire pour gérer les images de projets immobiliers
 * Gère la priorité entre categorized_photos, project_images et photos (legacy)
 */

export interface GalleryImage {
  url: string;
  caption?: string;
  category?: string;
  isPrimary?: boolean;
}

export interface ProjectImageData {
  categorized_photos?: any;
  project_images?: any[];
  photos?: string[];
}

/**
 * Mapping des catégories d'images avec ordre de priorité pour l'affichage
 */
const CATEGORY_ORDER = [
  'hero',
  'exterior_1', 
  'exterior_2',
  'interior_1',
  'interior_2', 
  'kitchen',
  'bedroom',
  'bathroom',
  'balcony',
  'garden',
  'panoramic_view',
  'sea_view',
  'mountain_view',
  'amenities',
  'plans'
];

/**
 * Normalise les catégories d'images depuis différents formats
 */
function mapCategory(category: string): string {
  const k = (category || '').toLowerCase();
  const dict: Record<string, string> = {
    'principale': 'hero',
    'principal': 'hero',
    'hero': 'hero',
    'exterieure': 'exterior_1',
    'exterieur': 'exterior_1',
    'exterior_1': 'exterior_1',
    'exterior_2': 'exterior_2',
    'interieure': 'interior_1',
    'interieur': 'interior_1',
    'interior_1': 'interior_1',
    'interior_2': 'interior_2',
    'cuisine': 'kitchen',
    'kitchen': 'kitchen',
    'chambre': 'bedroom',
    'bedroom': 'bedroom',
    'salle_de_bain': 'bathroom',
    'bathroom': 'bathroom',
    'balcon': 'balcony',
    'balcony': 'balcony',
    'jardin': 'garden',
    'garden': 'garden',
    'vue_panoramique': 'panoramic_view',
    'panoramic_view': 'panoramic_view',
    'vue_mer': 'sea_view',
    'sea_view': 'sea_view',
    'vue_montagne': 'mountain_view',
    'mountain_view': 'mountain_view',
    'prestations': 'amenities',
    'amenities': 'amenities',
    'plans': 'plans'
  };
  return dict[k] || 'interior_1';
}

/**
 * Construit une galerie d'images normalisée depuis les données projet
 * Priorité : categorized_photos > project_images > photos (legacy)
 */
export function buildGalleryFromProject(project: ProjectImageData): GalleryImage[] {
  const gallery: GalleryImage[] = [];

  // 1. Priorité : categorized_photos (format admin moderne)
  if (project.categorized_photos) {
    const cp = Array.isArray(project.categorized_photos) 
      ? project.categorized_photos 
      : [];
    
    cp.forEach((item: any) => {
      if (item?.url) {
        gallery.push({
          url: item.url,
          category: mapCategory(item.category),
          isPrimary: mapCategory(item.category) === 'hero',
          caption: item.caption || ''
        });
      } else if (Array.isArray(item?.urls)) {
        const cat = mapCategory(item.category);
        item.urls.forEach((url: string, idx: number) => {
          gallery.push({
            url,
            category: cat,
            isPrimary: cat === 'hero' && idx === 0,
            caption: ''
          });
        });
      }
    });
  }

  // 2. Fallback : project_images (table relationnelle)
  if (gallery.length === 0 && Array.isArray(project.project_images)) {
    project.project_images
      .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .forEach((img: any, idx: number) => {
        gallery.push({
          url: img.url,
          category: img.is_primary ? 'hero' : 'interior_1',
          isPrimary: !!img.is_primary || idx === 0,
          caption: img.caption || ''
        });
      });
  }

  // 3. Fallback : photos (legacy array)
  if (gallery.length === 0 && Array.isArray(project.photos)) {
    project.photos.forEach((url: string, idx: number) => {
      gallery.push({
        url,
        category: idx === 0 ? 'hero' : 'interior_1',
        isPrimary: idx === 0,
        caption: ''
      });
    });
  }

  // Déduplication par catégorie (garder le premier)
  const seen = new Set<string>();
  const deduped = gallery.filter(img => {
    if (seen.has(img.category!)) return false;
    seen.add(img.category!);
    return true;
  });

  // Tri par ordre de priorité des catégories
  deduped.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a.category!) ?? 999;
    const indexB = CATEGORY_ORDER.indexOf(b.category!) ?? 999;
    return indexA - indexB;
  });

  return deduped;
}

/**
 * Retourne l'image hero (principale) du projet
 */
export function getHeroImage(project: ProjectImageData): string | null {
  const gallery = buildGalleryFromProject(project);
  const hero = gallery.find(img => img.category === 'hero' || img.isPrimary);
  return hero?.url || gallery[0]?.url || null;
}

/**
 * Retourne toutes les URLs d'images pour l'affichage en slider/galerie
 */
export function getGalleryUrls(project: ProjectImageData): string[] {
  return buildGalleryFromProject(project).map(img => img.url);
}

/**
 * Retourne les images par catégorie pour l'affichage organisé
 */
export function getImagesByCategory(project: ProjectImageData): Record<string, GalleryImage[]> {
  const gallery = buildGalleryFromProject(project);
  const byCategory: Record<string, GalleryImage[]> = {};
  
  gallery.forEach(img => {
    const category = img.category || 'other';
    if (!byCategory[category]) {
      byCategory[category] = [];
    }
    byCategory[category].push(img);
  });
  
  return byCategory;
}