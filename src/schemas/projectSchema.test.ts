import { describe, it, expect } from 'vitest';
import { projectSchema } from './projectSchema';

describe('projectSchema', () => {
  const validProject = {
    title: 'Marina Bay Residences',
    developer_id: '00000000-0000-0000-0000-000000000001',
    description: 'Un projet residentiel de luxe face a la mer Mediterranee.',
    city: 'Limassol',
    statut_commercial: 'pre_commercialisation' as const,
  };

  it('accepts a minimal valid project', () => {
    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('rejects title shorter than 3 characters', () => {
    const result = projectSchema.safeParse({ ...validProject, title: 'ab' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const titleError = result.error.issues.find((i) => i.path[0] === 'title');
      expect(titleError).toBeDefined();
    }
  });

  it('rejects invalid UUID for developer_id', () => {
    const result = projectSchema.safeParse({ ...validProject, developer_id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 10 characters', () => {
    const result = projectSchema.safeParse({ ...validProject, description: 'short' });
    expect(result.success).toBe(false);
  });

  it('accepts valid launch_month format YYYY-MM', () => {
    const result = projectSchema.safeParse({ ...validProject, launch_month: '2026-06' });
    expect(result.success).toBe(true);
  });

  it('rejects launch_month with wrong format', () => {
    const result = projectSchema.safeParse({ ...validProject, launch_month: '06-2026' });
    expect(result.success).toBe(false);
  });

  it('accepts property_sub_type array', () => {
    const result = projectSchema.safeParse({
      ...validProject,
      property_sub_type: ['apartment', 'penthouse'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid property_sub_type enum value', () => {
    const result = projectSchema.safeParse({
      ...validProject,
      property_sub_type: ['invalid_type'],
    });
    expect(result.success).toBe(false);
  });
});
