import { supabase } from '@/integrations/supabase/client';

export async function getProperties() {
  return supabase
    .from('properties_final')
    .select(`
      *,
      projects_clean (
        id,
        title,
        city
      ),
      buildings_enhanced (
        id,
        building_code
      )
    `)
    .order('created_at', { ascending: false });
}

export async function getProperty(id: string) {
  return supabase
    .from('properties_final')
    .select(`
      *,
      projects_clean (*),
      buildings_enhanced (*)
    `)
    .eq('id', id)
    .single();
}

export async function createProperty(data: any) {
  return supabase
    .from('properties_final')
    .insert(data)
    .select()
    .single();
}

export async function updateProperty(id: string, data: any) {
  return supabase
    .from('properties_final')
    .update(data)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteProperty(id: string) {
  return supabase
    .from('properties_final')
    .delete()
    .eq('id', id);
}