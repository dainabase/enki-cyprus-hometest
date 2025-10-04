/**
 * Mock Data Validation & Testing Utilities
 * Validates that mock enrichment produces correct data structures
 */

import { enrichProjectData, enrichProjectDataMinimal } from './mockProjectEnrichment.js';

/**
 * Validates enriched project structure
 * @param {Object} enrichedProject - Enriched project to validate
 * @returns {Object} Validation result {valid: boolean, errors: string[]}
 */
export function validateEnrichedProject(enrichedProject) {
  const errors = [];
  
  // Check required sections
  const requiredSections = [
    'unitTypes',
    'investment',
    'financing',
    'testimonials',
    'developer',
    'architecture',
    'lifestyle',
    'specifications',
    'timeline',
    'meta'
  ];
  
  for (const section of requiredSections) {
    if (!enrichedProject[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  }
  
  // Validate unitTypes
  if (enrichedProject.unitTypes) {
    if (!Array.isArray(enrichedProject.unitTypes)) {
      errors.push('unitTypes must be an array');
    } else if (enrichedProject.unitTypes.length === 0) {
      errors.push('unitTypes array is empty');
    } else {
      enrichedProject.unitTypes.forEach((unit, i) => {
        if (!unit.floorPlan2D) errors.push(`unitTypes[${i}].floorPlan2D missing`);
        if (!unit.floorPlan3D) errors.push(`unitTypes[${i}].floorPlan3D missing`);
        if (!unit.surfaceTotal) errors.push(`unitTypes[${i}].surfaceTotal missing`);
        if (!unit.availableCount && unit.availableCount !== 0) errors.push(`unitTypes[${i}].availableCount missing`);
        if (!unit.status) errors.push(`unitTypes[${i}].status missing`);
      });
    }
  }
  
  // Validate investment
  if (enrichedProject.investment) {
    const inv = enrichedProject.investment;
    if (!inv.rentalPriceMonthly) errors.push('investment.rentalPriceMonthly missing');
    if (!inv.appreciationHistorical) errors.push('investment.appreciationHistorical missing');
    if (!inv.goldenVisaDetails) errors.push('investment.goldenVisaDetails missing');
    if (!inv.taxBenefits || !Array.isArray(inv.taxBenefits)) {
      errors.push('investment.taxBenefits must be an array');
    }
  }
  
  // Validate financing
  if (enrichedProject.financing) {
    const fin = enrichedProject.financing;
    if (!fin.partners || !Array.isArray(fin.partners)) {
      errors.push('financing.partners must be an array');
    }
    if (!fin.paymentPlan || !Array.isArray(fin.paymentPlan)) {
      errors.push('financing.paymentPlan must be an array');
    }
  }
  
  // Validate testimonials
  if (enrichedProject.testimonials) {
    if (!Array.isArray(enrichedProject.testimonials)) {
      errors.push('testimonials must be an array');
    } else if (enrichedProject.testimonials.length < 3) {
      errors.push('testimonials should have at least 3 items (recommended for conversion)');
    } else {
      enrichedProject.testimonials.forEach((t, i) => {
        if (!t.name) errors.push(`testimonials[${i}].name missing`);
        if (!t.text) errors.push(`testimonials[${i}].text missing`);
        if (!t.rating || t.rating < 1 || t.rating > 5) {
          errors.push(`testimonials[${i}].rating must be 1-5`);
        }
      });
    }
  }
  
  // Validate developer
  if (enrichedProject.developer) {
    const dev = enrichedProject.developer;
    if (!dev.stats) errors.push('developer.stats missing');
    if (!dev.awards || !Array.isArray(dev.awards)) {
      errors.push('developer.awards must be an array');
    }
    if (!dev.press || !Array.isArray(dev.press)) {
      errors.push('developer.press must be an array');
    }
  }
  
  // Validate meta
  if (enrichedProject.meta) {
    if (!enrichedProject.meta.mockDataSections || !Array.isArray(enrichedProject.meta.mockDataSections)) {
      errors.push('meta.mockDataSections must be an array');
    }
    if (!enrichedProject.meta.enrichmentVersion) {
      errors.push('meta.enrichmentVersion missing');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sectionsCount: requiredSections.length,
    validSectionsCount: requiredSections.length - errors.filter(e => e.includes('Missing required section')).length
  };
}

/**
 * Run complete validation test suite
 * @param {Object} baseProject - Base project from Supabase
 * @returns {Object} Test results
 */
export function runValidationTests(baseProject) {
  const results = {
    timestamp: new Date().toISOString(),
    baseProjectProvided: !!baseProject,
    tests: []
  };
  
  // Test 1: Basic enrichment
  try {
    const enriched = enrichProjectData(baseProject);
    const validation = validateEnrichedProject(enriched);
    
    results.tests.push({
      name: 'Basic Enrichment',
      passed: validation.valid,
      errors: validation.errors,
      details: `${validation.validSectionsCount}/${validation.sectionsCount} sections valid`
    });
  } catch (error) {
    results.tests.push({
      name: 'Basic Enrichment',
      passed: false,
      errors: [error.message]
    });
  }
  
  // Test 2: Minimal enrichment
  try {
    const enrichedMinimal = enrichProjectDataMinimal(baseProject);
    results.tests.push({
      name: 'Minimal Enrichment',
      passed: true,
      details: 'Minimal enrichment completed'
    });
  } catch (error) {
    results.tests.push({
      name: 'Minimal Enrichment',
      passed: false,
      errors: [error.message]
    });
  }
  
  // Test 3: Price calculations
  try {
    const enriched = enrichProjectData(baseProject);
    const priceTests = [];
    
    // Check rental price calculation
    if (enriched.investment.rentalPriceMonthly <= 0) {
      priceTests.push('Rental price should be > 0');
    }
    
    // Check unit prices
    enriched.unitTypes.forEach((unit, i) => {
      if (unit.priceFrom >= unit.priceTo) {
        priceTests.push(`Unit ${i}: priceFrom should be < priceTo`);
      }
      if (unit.pricePerSqm <= 0) {
        priceTests.push(`Unit ${i}: pricePerSqm should be > 0`);
      }
    });
    
    results.tests.push({
      name: 'Price Calculations',
      passed: priceTests.length === 0,
      errors: priceTests,
      details: `${enriched.unitTypes.length} unit types validated`
    });
  } catch (error) {
    results.tests.push({
      name: 'Price Calculations',
      passed: false,
      errors: [error.message]
    });
  }
  
  // Test 4: Required video testimonials
  try {
    const enriched = enrichProjectData(baseProject);
    const videoTestimonials = enriched.testimonials.filter(t => t.videoUrl);
    
    results.tests.push({
      name: 'Video Testimonials',
      passed: videoTestimonials.length >= 2,
      details: `${videoTestimonials.length} testimonials with videos (minimum 2 recommended)`,
      warning: videoTestimonials.length < 2 ? 'Add more video testimonials for +68% conversion' : null
    });
  } catch (error) {
    results.tests.push({
      name: 'Video Testimonials',
      passed: false,
      errors: [error.message]
    });
  }
  
  // Overall results
  results.summary = {
    totalTests: results.tests.length,
    passed: results.tests.filter(t => t.passed).length,
    failed: results.tests.filter(t => !t.passed).length,
    allPassed: results.tests.every(t => t.passed)
  };
  
  return results;
}

/**
 * Console logger for test results
 */
export function logTestResults(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 MOCK DATA VALIDATION RESULTS');
  console.log('='.repeat(60) + '\n');
  
  console.log(`Timestamp: ${results.timestamp}`);
  console.log(`Base Project: ${results.baseProjectProvided ? '✅ Provided' : '❌ Missing'}\n`);
  
  results.tests.forEach((test, i) => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} Test ${i + 1}: ${test.name}`);
    
    if (test.details) {
      console.log(`   ${test.details}`);
    }
    
    if (test.warning) {
      console.log(`   ⚠️  ${test.warning}`);
    }
    
    if (test.errors && test.errors.length > 0) {
      console.log(`   Errors:`);
      test.errors.forEach(err => console.log(`   - ${err}`));
    }
    
    console.log('');
  });
  
  console.log('='.repeat(60));
  console.log(`SUMMARY: ${results.summary.passed}/${results.summary.totalTests} tests passed`);
  
  if (results.summary.allPassed) {
    console.log('✅ ALL VALIDATION TESTS PASSED!');
  } else {
    console.log(`❌ ${results.summary.failed} test(s) failed`);
  }
  
  console.log('='.repeat(60) + '\n');
  
  return results.summary.allPassed;
}

/**
 * Quick validation check (returns boolean)
 */
export function quickValidate(baseProject) {
  try {
    const enriched = enrichProjectData(baseProject);
    const validation = validateEnrichedProject(enriched);
    return validation.valid;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

export default {
  validateEnrichedProject,
  runValidationTests,
  logTestResults,
  quickValidate
};