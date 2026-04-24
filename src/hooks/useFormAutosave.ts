import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface AutosaveConfig {
  table: 'project_drafts' | 'developer_drafts' | 'building_drafts' | 'contact_drafts' | 'registration_drafts' | 'lexaia_drafts' | 'search_drafts';
  formData: Record<string, unknown>;
  entityId?: string | null; // For editing existing entities
  enabled?: boolean;
  debounceMs?: number;
  showToasts?: boolean;
}

export const useFormAutosave = ({
  table,
  formData,
  entityId = null,
  enabled = true,
  debounceMs = 800,
  showToasts = true
}: AutosaveConfig) => {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Generate unique ID for the session/entity combination
  const getUniqueKey = () => {
    if (entityId) return `${table}_${entityId}`;
    return `${table}_${sessionId}`;
  };

  // Auto-save mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id || null;

      const draftData: Record<string, unknown> = {
        form_data: data,
        session_id: sessionId,
        current_step: 'basics',
        step_index: 0,
        updated_at: new Date().toISOString()
      };

      // Add user_id for authenticated users
      if (userId) {
        draftData.user_id = userId;
      }

      // Add entity-specific fields
      if (table === 'project_drafts' && entityId) {
        draftData.project_id = entityId;
      } else if (table === 'developer_drafts' && entityId) {
        draftData.developer_id = entityId;
      } else if (table === 'building_drafts' && entityId) {
        draftData.building_id = entityId;
      } else if (table === 'registration_drafts' && typeof data.email === 'string') {
        draftData.email_attempted = data.email;
      }

      // For anonymous users on tables that require session_id
      const anonymousTables = ['contact_drafts', 'registration_drafts', 'lexaia_drafts', 'search_drafts'];
      if (!userId && anonymousTables.includes(table)) {
        // Remove user_id for anonymous tables
        delete draftData.user_id;
      }

      setIsAutoSaving(true);

      const { error } = await supabase
        .from(table)
        .upsert(draftData, {
          onConflict: entityId 
            ? userId ? (table === 'project_drafts' ? 'user_id,project_id' : 
                       table === 'building_drafts' ? 'user_id,building_id' : 
                       'user_id,developer_id') : 'session_id'
            : 'session_id'
        });

      if (error) {
        logger.error(`Error saving ${table} draft`, error, { component: 'useFormAutosave', table });
        throw error;
      }
    },
    onSuccess: () => {
      setIsAutoSaving(false);
      if (showToasts) {
        // Silently save - no success toast to avoid spam
      }
    },
    onError: (error) => {
      setIsAutoSaving(false);
      logger.error(`Error in ${table} auto-save`, error, { component: 'useFormAutosave', table });
      if (showToasts) {
        toast.error('Erreur lors de la sauvegarde automatique');
      }
    }
  });

  const debouncedSaveDraft = useDebounceCallback(
    (data: Record<string, unknown>) => {
      if (enabled && hasFormContent(data)) {
        saveDraftMutation.mutate(data);
      }
    },
    debounceMs
  );

  const hasFormContent = (data: Record<string, unknown>): boolean => {
    if (!data || typeof data !== 'object') return false;
    
    const values = Object.values(data);
    return values.some(value => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return value > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    });
  };

  // Load existing draft
  const loadDraft = async () => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();
      
      if (error) {
        logger.error(`Error loading ${table} draft`, error, { component: 'useFormAutosave', table });
        return null;
      }

      return data;
    } catch (error) {
      logger.error(`Error in load${table}Draft`, error, { component: 'useFormAutosave', table });
      return null;
    }
  };

  // Clear draft after successful save
  const clearDraft = async () => {
    try {
      await supabase
        .from(table)
        .delete()
        .eq('session_id', sessionId);
    } catch (error) {
      logger.error(`Error clearing ${table} draft`, error, { component: 'useFormAutosave', table });
    }
  };

  // Auto-save on form changes
  useEffect(() => {
    if (enabled) {
      debouncedSaveDraft(formData);
    }
  }, [formData, enabled, debouncedSaveDraft]);

  return {
    sessionId,
    isAutoSaving,
    loadDraft,
    clearDraft,
    getUniqueKey
  };
};