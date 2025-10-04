#!/usr/bin/env node
/**
 * Test Script - Mock Data Enrichment
 * Run: node scripts/test-mock-enrichment.js
 */

import { enrichProjectData } from '../utils/mockProjectEnrichment.js';
import { runValidationTests, logTestResults } from '../utils/mockValidation.js';

// Sample base project (mimics Supabase data structure)
const sampleBaseProject = {
  id: 'test-project-001',
  title: 'Mediterranean Heights',
  subtitle: 'Luxury Living with Panoramic Views',
  city: 'Limassol',
  region: 'Limassol District',
  
  // Base pricing
  price_from: 450000,
  price_to: 850000,
  price_per_m2: 3500,
  
  // Golden Visa
  golden_visa_eligible: true,
  rental_yield_percent: 7.03,
  
  // Developer
  developer_id: 'dev-123',
  developer: {
    name: 'Premium Developers Ltd',
    founded_year: 2001,
    total_projects: 12,
    rating_score: 8.5
  },
  
  // VAT
  vat_rate: 5.0,
  
  // Units
  total_units: 45,
  units_available: 23,
  units_sold: 15,
  
  // Coordinates
  gps_latitude: 34.7071,
  gps_longitude: 33.0226,
  
  // Photos
  photos: [
    { url: '/hero.jpg', category: 'hero', isPrimary: true },
    { url: '/exterior.jpg', category: 'exterior_1' }
  ],
  
  // Amenities (simplified)
  amenities: ['private_pool', 'gym', 'spa', 'playground'],
  
  // Payment plan (if exists)
  payment_plan: []
};

console.log('🚀 Starting Mock Data Enrichment Tests...\n');
console.log('Base Project:', sampleBaseProject.title);
console.log('ID:', sampleBaseProject.id);
console.log('Price Range:', `€${sampleBaseProject.price_from.toLocaleString()} - €${sampleBaseProject.price_to.toLocaleString()}`);
console.log('');

// Run enrichment
try {
  console.log('⏳ Enriching project data...');
  const enrichedProject = enrichProjectData(sampleBaseProject);
  
  console.log('✅ Enrichment completed!\n');
  
  // Display enriched sections
  console.log('📊 Enriched Sections:');
  console.log(`- Unit Types: ${enrichedProject.unitTypes.length} types`);
  console.log(`- Testimonials: ${enrichedProject.testimonials.length} items`);
  console.log(`- Awards: ${enrichedProject.developer.awards.length} items`);
  console.log(`- Press: ${enrichedProject.developer.press.length} mentions`);
  console.log(`- Timeline Phases: ${enrichedProject.timeline.phases.length} phases`);
  console.log(`- Tax Benefits: ${enrichedProject.investment.taxBenefits.length} items`);
  console.log(`- Bank Partners: ${enrichedProject.financing.partners.length} banks`);
  console.log(`- Payment Plan: ${enrichedProject.financing.paymentPlan.length} stages`);
  console.log('');
  
  // Sample data display
  console.log('🏗️ Sample Unit Type:');
  const sampleUnit = enrichedProject.unitTypes[0];
  console.log(JSON.stringify({
    name: sampleUnit.name,
    bedrooms: sampleUnit.bedrooms,
    surfaceTotal: sampleUnit.surfaceTotal,
    priceFrom: sampleUnit.priceFrom,
    availableCount: sampleUnit.availableCount,
    status: sampleUnit.status,
    floorPlan2D: sampleUnit.floorPlan2D,
    floorPlan3D: sampleUnit.floorPlan3D
  }, null, 2));
  console.log('');
  
  console.log('💰 Investment Details:');
  console.log(JSON.stringify({
    rentalYield: enrichedProject.investment.rentalYield,
    rentalMonthly: enrichedProject.investment.rentalPriceMonthly,
    appreciation: enrichedProject.investment.appreciationHistorical,
    goldenVisa: enrichedProject.investment.goldenVisa,
    taxBenefitsCount: enrichedProject.investment.taxBenefits.length
  }, null, 2));
  console.log('');
  
  console.log('💬 Sample Testimonial:');
  const sampleTestimonial = enrichedProject.testimonials[0];
  console.log(JSON.stringify({
    name: sampleTestimonial.name,
    nationality: sampleTestimonial.nationality,
    rating: sampleTestimonial.rating,
    hasVideo: !!sampleTestimonial.videoUrl,
    verified: sampleTestimonial.verified,
    text: sampleTestimonial.text.substring(0, 80) + '...'
  }, null, 2));
  console.log('');
  
  // Run validation tests
  console.log('🧪 Running Validation Tests...');
  const testResults = runValidationTests(sampleBaseProject);
  const allPassed = logTestResults(testResults);
  
  if (allPassed) {
    console.log('✅ SUCCESS: Mock enrichment system is working correctly!');
    process.exit(0);
  } else {
    console.log('❌ FAILURE: Some validation tests failed');
    process.exit(1);
  }
  
} catch (error) {
  console.error('\n❌ ERROR during enrichment:');
  console.error(error);
  process.exit(1);
}