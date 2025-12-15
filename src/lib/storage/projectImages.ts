/**
 * ================================================
 * PHASE 4: SUPABASE STORAGE UPLOAD HELPER
 * ================================================
 * Helper pour uploader des images vers Supabase Storage
 * et les lier automatiquement à project_images
 * ================================================
 */

import { supabase } from '@/integrations/supabase/client';

export interface UploadImageOptions {
  projectId: string;
  file: File;
  isPrimary?: boolean;
  caption?: string;
  displayOrder?: number;
}

export interface UploadImageResult {
  success: boolean;
  publicUrl?: string;
  imageId?: string;
  error?: string;
}

/**
 * Upload une image vers Supabase Storage et l'enregistre dans project_images
 * 
 * @example
 * ```tsx
 * const result = await uploadProjectImage({
 *   projectId: 'uuid-xxx',
 *   file: selectedFile,
 *   isPrimary: true,
 *   caption: 'Vue extérieure du projet'
 * });
 * 
 * if (result.success) {
 *   console.log('Image uploadée:', result.publicUrl);
 * }
 * ```
 */
export async function uploadProjectImage(
  options: UploadImageOptions
): Promise<UploadImageResult> {
  const { projectId, file, isPrimary = false, caption, displayOrder } = options;

  try {
    // 1. Validation du fichier
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Le fichier doit être une image (JPEG, PNG, WebP)'
      };
    }

    // Limite taille: 5MB
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'L\'image ne doit pas dépasser 5 MB'
      };
    }

    // 2. Générer nom de fichier unique
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // 3. Upload vers Supabase Storage bucket 'projects'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('projects')
      .upload(fileName, file, {
        cacheControl: '31536000', // 1 an de cache
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Erreur upload Storage:', uploadError);
      return {
        success: false,
        error: `Erreur upload: ${uploadError.message}`
      };
    }

    // 4. Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('projects')
      .getPublicUrl(fileName);

    // 5. Déterminer display_order automatiquement si non fourni
    let finalDisplayOrder = displayOrder;
    if (finalDisplayOrder === undefined) {
      const { data: existingImages } = await supabase
        .from('project_images')
        .select('display_order')
        .eq('project_id', projectId)
        .order('display_order', { ascending: false })
        .limit(1);

      finalDisplayOrder = existingImages && existingImages.length > 0
        ? (existingImages[0].display_order || 0) + 1
        : 1;
    }

    // 6. Si isPrimary=true, désactiver les autres primary
    if (isPrimary) {
      await supabase
        .from('project_images')
        .update({ is_primary: false })
        .eq('project_id', projectId)
        .eq('is_primary', true);
    }

    // 7. Insérer dans project_images
    const { data: imageData, error: insertError } = await supabase
      .from('project_images')
      .insert({
        project_id: projectId,
        url: publicUrl,
        is_primary: isPrimary,
        caption: caption || file.name,
        display_order: finalDisplayOrder
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur insertion project_images:', insertError);
      
      // Rollback: supprimer le fichier uploadé
      await supabase.storage.from('projects').remove([fileName]);
      
      return {
        success: false,
        error: `Erreur base de données: ${insertError.message}`
      };
    }

    return {
      success: true,
      publicUrl,
      imageId: imageData.id
    };

  } catch (error) {
    console.error('Erreur inattendue uploadProjectImage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Supprimer une image de project_images et du Storage
 * 
 * @example
 * ```tsx
 * await deleteProjectImage('image-uuid');
 * ```
 */
export async function deleteProjectImage(imageId: string): Promise<boolean> {
  try {
    // 1. Récupérer l'URL de l'image
    const { data: imageData, error: fetchError } = await supabase
      .from('project_images')
      .select('url')
      .eq('id', imageId)
      .single();

    if (fetchError || !imageData) {
      console.error('Image non trouvée:', fetchError);
      return false;
    }

    // 2. Extraire le path du Storage depuis l'URL
    const url = new URL(imageData.url);
    const pathParts = url.pathname.split('/projects/');
    const storagePath = pathParts.length > 1 ? pathParts[1] : null;

    // 3. Supprimer de project_images
    const { error: deleteError } = await supabase
      .from('project_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Erreur suppression project_images:', deleteError);
      return false;
    }

    // 4. Supprimer du Storage
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('projects')
        .remove([storagePath]);

      if (storageError) {
        console.warn('Erreur suppression Storage (non bloquant):', storageError);
      }
    }

    return true;

  } catch (error) {
    console.error('Erreur deleteProjectImage:', error);
    return false;
  }
}

/**
 * Réorganiser l'ordre d'affichage des images
 * 
 * @example
 * ```tsx
 * await reorderProjectImages([
 *   { id: 'uuid1', displayOrder: 1 },
 *   { id: 'uuid2', displayOrder: 2 },
 *   { id: 'uuid3', displayOrder: 3 }
 * ]);
 * ```
 */
export async function reorderProjectImages(
  images: Array<{ id: string; displayOrder: number }>
): Promise<boolean> {
  try {
    const updates = images.map(img => 
      supabase
        .from('project_images')
        .update({ display_order: img.displayOrder })
        .eq('id', img.id)
    );

    await Promise.all(updates);
    return true;

  } catch (error) {
    console.error('Erreur reorderProjectImages:', error);
    return false;
  }
}

/**
 * Définir une image comme principale (is_primary=true)
 * 
 * @example
 * ```tsx
 * await setPrimaryImage('project-uuid', 'image-uuid');
 * ```
 */
export async function setPrimaryImage(
  projectId: string,
  imageId: string
): Promise<boolean> {
  try {
    // 1. Désactiver toutes les primary du projet
    await supabase
      .from('project_images')
      .update({ is_primary: false })
      .eq('project_id', projectId)
      .eq('is_primary', true);

    // 2. Activer la nouvelle primary
    const { error } = await supabase
      .from('project_images')
      .update({ is_primary: true })
      .eq('id', imageId);

    if (error) {
      console.error('Erreur setPrimaryImage:', error);
      return false;
    }

    return true;

  } catch (error) {
    console.error('Erreur setPrimaryImage:', error);
    return false;
  }
}

/**
 * Récupérer toutes les images d'un projet
 * 
 * @example
 * ```tsx
 * const images = await getProjectImages('project-uuid');
 * console.log('Nombre d\'images:', images.length);
 * ```
 */
export async function getProjectImages(projectId: string) {
  try {
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Erreur getProjectImages:', error);
      return [];
    }

    return data || [];

  } catch (error) {
    console.error('Erreur getProjectImages:', error);
    return [];
  }
}

/**
 * Hook React pour uploader et gérer les images
 * 
 * @example
 * ```tsx
 * function ProjectImagesUploader({ projectId }: { projectId: string }) {
 *   const [uploading, setUploading] = useState(false);
 *   
 *   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0];
 *     if (!file) return;
 *     
 *     setUploading(true);
 *     const result = await uploadProjectImage({
 *       projectId,
 *       file,
 *       isPrimary: false
 *     });
 *     setUploading(false);
 *     
 *     if (result.success) {
 *       toast.success('Image uploadée avec succès!');
 *     } else {
 *       toast.error(result.error);
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       <input 
 *         type="file" 
 *         accept="image/*"
 *         onChange={handleFileSelect}
 *         disabled={uploading}
 *       />
 *       {uploading && <p>Upload en cours...</p>}
 *     </div>
 *   );
 * }
 * ```
 */