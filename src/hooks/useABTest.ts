import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ABTest {
  id: string;
  test_name: string;
  variant_a: string;
  variant_b: string;
  description?: string;
  active: boolean;
}

interface ABTestAssignment {
  variant: string;
}

export const useABTest = (testName: string) => {
  const [variant, setVariant] = useState<string>('A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assignVariant = async () => {
      try {
        // Get session ID
        const sessionId = getSessionId();
        
        // First, get the test configuration
        const { data: test, error: testError } = await supabase
          .from('ab_tests')
          .select('*')
          .eq('test_name', testName)
          .eq('active', true)
          .single();

        if (testError || !test) {
          console.log(`A/B test '${testName}' not found or inactive`);
          setLoading(false);
          return;
        }

        // Try to get existing assignment first
        const { data: existingAssignment } = await supabase
          .from('ab_test_assignments')
          .select('variant')
          .eq('test_id', test.id)
          .eq('user_session', sessionId)
          .maybeSingle();

        if (existingAssignment) {
          setVariant(existingAssignment.variant);
          setLoading(false);
          return;
        }

        // Create new assignment using upsert function
        const randomVariant = Math.random() < 0.5 ? 'A' : 'B';
        
        await supabase.rpc('upsert_ab_test_assignment', {
          p_test_id: test.id,
          p_user_session: sessionId,
          p_variant: randomVariant
        });

        setVariant(randomVariant);
        console.log(`🧪 A/B Test '${testName}': Assigned variant ${randomVariant}`);
      } catch (error) {
        console.error('Error in A/B test assignment:', error);
      } finally {
        setLoading(false);
      }
    };

    assignVariant();
  }, [testName]);

  const getVariantValue = (test: ABTest): string => {
    return variant === 'A' ? test.variant_a : test.variant_b;
  };

  return { variant, loading, getVariantValue };
};

// Get or create session ID for A/B testing
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('ab_test_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('ab_test_session_id', sessionId);
  }
  return sessionId;
};

// Hook to get specific variant values
export const useABTestVariant = (testName: string, defaultA: string, defaultB: string) => {
  const { variant, loading } = useABTest(testName);
  
  const value = variant === 'B' ? defaultB : defaultA;
  
  return { value, variant, loading };
};