import { supabase } from "@/integrations/supabase/client";

export type BucketType = 'projects' | 'buildings' | 'properties' | 'building-photos';

export async function uploadImage(
  bucket: BucketType,
  file: File,
  path: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${path}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
    
  return publicUrl;
}

export async function deleteImage(bucket: BucketType, path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
    
  if (error) throw error;
}

export function getImagePath(url: string): string {
  // Extract path from Supabase storage URL
  const urlParts = url.split('/');
  const bucketIndex = urlParts.findIndex(part => part === 'object');
  if (bucketIndex !== -1) {
    return urlParts.slice(bucketIndex + 3).join('/');
  }
  return '';
}