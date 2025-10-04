import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProjectSocialProof, Testimonial, Award, PressMention, DeveloperStats } from '@/types/socialProof';

export function useProjectSocialProof(projectId: string, developerId?: string) {
  return useQuery({
    queryKey: ['project-social-proof', projectId, developerId],
    queryFn: async () => {
      const [testimonialsRes, awardsRes, pressRes, developerRes] = await Promise.all([
        supabase
          .from('testimonials')
          .select('*')
          .eq('project_id', projectId)
          .eq('featured', true)
          .order('display_order', { ascending: true }),

        supabase
          .from('awards')
          .select('*')
          .eq('project_id', projectId)
          .order('award_date', { ascending: false }),

        supabase
          .from('press_mentions')
          .select('*')
          .eq('project_id', projectId)
          .eq('featured', true)
          .order('published_date', { ascending: false }),

        developerId
          ? supabase
              .from('developers')
              .select(`
                revenue_annual,
                employees_count,
                families_satisfied,
                units_delivered,
                years_experience,
                projects_completed,
                certifications,
                accreditations,
                average_customer_rating,
                total_reviews,
                repeat_customer_rate
              `)
              .eq('id', developerId)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (testimonialsRes.error) throw testimonialsRes.error;
      if (awardsRes.error) throw awardsRes.error;
      if (pressRes.error) throw pressRes.error;
      if (developerRes.error) throw developerRes.error;

      const result: ProjectSocialProof = {
        testimonials: (testimonialsRes.data as Testimonial[]) || [],
        awards: (awardsRes.data as Award[]) || [],
        press_mentions: (pressRes.data as PressMention[]) || [],
        developer_stats: developerRes.data as DeveloperStats | null,
      };

      return result;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}
