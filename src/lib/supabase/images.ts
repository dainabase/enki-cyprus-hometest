import { supabase } from "@/integrations/supabase/client";

// Project Images
export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  caption?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export async function fetchProjectImages(projectId: string): Promise<ProjectImage[]> {
  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

export async function createProjectImage(imageData: Omit<ProjectImage, 'id' | 'created_at'>): Promise<ProjectImage> {
  const { data, error } = await supabase
    .from('project_images')
    .insert([imageData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteProjectImage(imageId: string): Promise<void> {
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', imageId);
    
  if (error) throw error;
}

export async function updateProjectImagePrimary(imageId: string, projectId: string): Promise<void> {
  // First, remove primary flag from all images of this project
  await supabase
    .from('project_images')
    .update({ is_primary: false })
    .eq('project_id', projectId);
    
  // Then set the selected image as primary
  const { error } = await supabase
    .from('project_images')
    .update({ is_primary: true })
    .eq('id', imageId);
    
  if (error) throw error;
}

// Building Images
export interface BuildingImage {
  id: string;
  building_id: string;
  url: string;
  caption?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export async function fetchBuildingImages(buildingId: string): Promise<BuildingImage[]> {
  const { data, error } = await supabase
    .from('building_images')
    .select('*')
    .eq('building_id', buildingId)
    .order('display_order', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

export async function createBuildingImage(imageData: Omit<BuildingImage, 'id' | 'created_at'>): Promise<BuildingImage> {
  const { data, error } = await supabase
    .from('building_images')
    .insert([imageData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteBuildingImage(imageId: string): Promise<void> {
  const { error } = await supabase
    .from('building_images')
    .delete()
    .eq('id', imageId);
    
  if (error) throw error;
}

export async function updateBuildingImagePrimary(imageId: string, buildingId: string): Promise<void> {
  // First, remove primary flag from all images of this building
  await supabase
    .from('building_images')
    .update({ is_primary: false })
    .eq('building_id', buildingId);
    
  // Then set the selected image as primary
  const { error } = await supabase
    .from('building_images')
    .update({ is_primary: true })
    .eq('id', imageId);
    
  if (error) throw error;
}