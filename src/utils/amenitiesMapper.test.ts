import { describe, it, expect } from 'vitest';
import {
  amenitiesLegacyToCode,
  convertLegacyAmenities,
  convertPhotosToCategorized,
  prepareSurroundingAmenities,
} from './amenitiesMapper';

describe('amenitiesMapper', () => {
  describe('amenitiesLegacyToCode', () => {
    it('maps piscine to swimming_pool', () => {
      expect(amenitiesLegacyToCode['piscine']).toBe('swimming_pool');
    });

    it('maps conciergerie to concierge', () => {
      expect(amenitiesLegacyToCode['conciergerie']).toBe('concierge');
    });
  });

  describe('convertLegacyAmenities', () => {
    it('converts French amenity names to English codes', () => {
      const result = convertLegacyAmenities(['piscine', 'conciergerie']);
      expect(result).toContain('swimming_pool');
      expect(result).toContain('concierge');
    });

    it('keeps already-coded amenities unchanged', () => {
      const result = convertLegacyAmenities(['swimming_pool', 'gym']);
      expect(result).toEqual(['swimming_pool', 'gym']);
    });

    it('returns empty array for null input', () => {
      const result = convertLegacyAmenities(null as unknown as string[]);
      expect(result).toEqual([]);
    });

    it('returns empty array for non-array input', () => {
      const result = convertLegacyAmenities('piscine' as unknown as string[]);
      expect(result).toEqual([]);
    });

    it('filters out empty entries', () => {
      const result = convertLegacyAmenities(['piscine', '', 'gym']);
      expect(result.filter(Boolean).length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('convertPhotosToCategorized', () => {
    it('returns empty array for null input', () => {
      expect(convertPhotosToCategorized(null)).toEqual([]);
    });

    it('returns empty array for undefined input', () => {
      expect(convertPhotosToCategorized(undefined)).toEqual([]);
    });

    it('converts array of string URLs to CategorizedPhoto', () => {
      const urls = ['https://example.com/1.jpg', 'https://example.com/2.jpg'];
      const result = convertPhotosToCategorized(urls);
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('hero');
      expect(result[0].isPrimary).toBe(true);
      expect(result[1].category).toBe('exterior_1');
    });

    it('preserves category when provided', () => {
      const input = [
        { url: 'https://example.com/1.jpg', category: 'kitchen' as const, isPrimary: false },
      ];
      const result = convertPhotosToCategorized(input);
      expect(result[0].category).toBe('kitchen');
    });
  });

  describe('prepareSurroundingAmenities', () => {
    it('filters out invalid amenity objects', () => {
      const input = [
        { name: 'Hopital', type: 'hospital' },
        { name: '' },
        null,
        'string',
        { type: 'no-name' },
      ];
      const result = prepareSurroundingAmenities(input);
      expect(result.length).toBe(1);
      expect(result[0]).toMatchObject({ name: 'Hopital', type: 'hospital' });
    });

    it('returns empty array for null input', () => {
      expect(prepareSurroundingAmenities(null as unknown as unknown[])).toEqual([]);
    });
  });
});
