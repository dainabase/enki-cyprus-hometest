import { describe, it, expect } from 'vitest';

// Cyprus Golden Visa: eligibility threshold at 300,000 EUR (official 2024-2025 rule)
// See CLAUDE.md > REGLES METIER CHYPRE
const GOLDEN_VISA_THRESHOLD_EUR = 300_000;

function isGoldenVisaEligible(priceFrom: number | null | undefined): boolean {
  if (typeof priceFrom !== 'number' || Number.isNaN(priceFrom)) return false;
  return priceFrom >= GOLDEN_VISA_THRESHOLD_EUR;
}

describe('Golden Visa eligibility', () => {
  it('returns true for price >= 300000 EUR', () => {
    expect(isGoldenVisaEligible(300000)).toBe(true);
    expect(isGoldenVisaEligible(500000)).toBe(true);
  });

  it('returns false for price < 300000 EUR', () => {
    expect(isGoldenVisaEligible(299999)).toBe(false);
    expect(isGoldenVisaEligible(100000)).toBe(false);
  });

  it('returns false for null price', () => {
    expect(isGoldenVisaEligible(null)).toBe(false);
  });

  it('returns false for undefined price', () => {
    expect(isGoldenVisaEligible(undefined)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isGoldenVisaEligible(NaN)).toBe(false);
  });

  it('exactly 300000 is eligible (inclusive threshold)', () => {
    expect(isGoldenVisaEligible(300_000)).toBe(true);
  });
});
