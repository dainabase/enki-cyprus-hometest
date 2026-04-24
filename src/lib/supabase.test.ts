import { describe, it, expect } from 'vitest';
import { transformDatabaseProperty } from './supabase';

describe('transformDatabaseProperty', () => {
  const baseRow = {
    id: 'abc-123',
    title: 'Apartment A-101',
    description: 'Description',
    property_sub_type: ['apartment'],
    price_from: 350000,
    city: 'Limassol',
    bedrooms_count: 3,
    bathrooms_count: 2,
    internal_area: 120,
    features: ['pool', 'gym'],
    amenities: null,
    photos: ['https://cdn/1.jpg'],
  };

  it('maps id and title', () => {
    const result = transformDatabaseProperty(baseRow);
    expect(result.id).toBe('abc-123');
    expect(result.title).toBe('Apartment A-101');
  });

  it('formats price with EUR prefix', () => {
    const result = transformDatabaseProperty(baseRow);
    expect(result.price).toContain('EUR');
    expect(result.price).toContain('350');
  });

  it('falls back to "Prix sur demande" when price_from is null', () => {
    const result = transformDatabaseProperty({ ...baseRow, price_from: null });
    expect(result.price).toBe('Prix sur demande');
  });

  it('uses default Cyprus coordinates when GPS missing', () => {
    const result = transformDatabaseProperty(baseRow);
    expect(result.coordinates.lat).toBe(35.1264);
    expect(result.coordinates.lng).toBe(33.4299);
  });

  it('uses provided GPS when available', () => {
    const result = transformDatabaseProperty({
      ...baseRow,
      gps_latitude: 34.7,
      gps_longitude: 32.4,
    });
    expect(result.coordinates.lat).toBe(34.7);
    expect(result.coordinates.lng).toBe(32.4);
  });

  it('coerces features from object array to string array', () => {
    const result = transformDatabaseProperty({
      ...baseRow,
      features: [{ name: 'pool' }, { name: 'gym' }],
    });
    expect(result.features).toEqual(['pool', 'gym']);
  });

  it('falls back to amenities when features is empty', () => {
    const result = transformDatabaseProperty({
      ...baseRow,
      features: [],
      amenities: ['parking', 'security'],
    });
    expect(result.features).toEqual(['parking', 'security']);
  });
});
