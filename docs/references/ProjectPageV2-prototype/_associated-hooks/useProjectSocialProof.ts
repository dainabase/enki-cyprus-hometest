import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProjectSocialProof, Testimonial, Award, PressMention, DeveloperStats } from '@/types/socialProof';

export function useProjectSocialProof(projectId: string, developerId?: string) {
  return useQuery({
    queryKey: ['project-social-proof', projectId, developerId],
    queryFn: async () => {
      // Return empty data for non-existent tables
      const result: ProjectSocialProof = {
        testimonials: [],
        awards: [],
        press_mentions: [],
        developer_stats: null,
      };

      return result;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}
