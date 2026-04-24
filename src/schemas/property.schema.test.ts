import { describe, it, expect } from 'vitest';
import { propertySchema } from './property.schema';

describe('property.schema', () => {
  const validProperty = {
    project_id: '00000000-0000-0000-0000-000000000001',
    unit_number: 'A-101',
    property_type: 'apartment' as const,
    property_status: 'available' as const,
    bedrooms_count: 2,
    bathrooms_count: 1,
    internal_area: 85,
    price_excluding_vat: 280000,
    vat_rate: 5,
    commission_rate: 5,
    deposit_percentage: 30,
    reservation_fee: 5000,
    payment_plan_available: false,
    finance_available: false,
    title_deed_status: 'pending' as const,
  };

  it('accepts a minimal valid property', () => {
    const result = propertySchema.safeParse(validProperty);
    if (!result.success) {
      console.error(result.error.issues);
    }
    expect(result.success).toBe(true);
  });

  it('rejects invalid project_id UUID', () => {
    const result = propertySchema.safeParse({ ...validProperty, project_id: 'not-uuid' });
    expect(result.success).toBe(false);
  });

  it('rejects empty unit_number', () => {
    const result = propertySchema.safeParse({ ...validProperty, unit_number: '' });
    expect(result.success).toBe(false);
  });

  it('rejects bedrooms_count out of range (21)', () => {
    const result = propertySchema.safeParse({ ...validProperty, bedrooms_count: 21 });
    expect(result.success).toBe(false);
  });

  it('accepts building_id = null (villa individuelle)', () => {
    const result = propertySchema.safeParse({ ...validProperty, building_id: null });
    expect(result.success).toBe(true);
  });

  it('transforms empty string building_id to null', () => {
    const result = propertySchema.safeParse({ ...validProperty, building_id: '' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.building_id).toBe(null);
    }
  });

  it('rejects internal_area = 0', () => {
    const result = propertySchema.safeParse({ ...validProperty, internal_area: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid property_type', () => {
    const result = propertySchema.safeParse({
      ...validProperty,
      property_type: 'mansion',
    });
    expect(result.success).toBe(false);
  });
});
