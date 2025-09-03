// cypress/support/coverage.ts
export const coverageConfig = {
  // Coverage thresholds
  thresholds: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  },
  
  // Files to include in coverage
  include: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.cy.{ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  
  // Test result reporting
  reporters: ['text', 'html', 'json'],
  
  // Output directory
  outputDir: 'cypress/coverage'
};

// Helper to track test coverage
export const trackCoverage = (testName: string, coverage: any) => {
  cy.task('coverage', {
    testName,
    coverage,
    timestamp: new Date().toISOString()
  });
};

// Add coverage assertions
export const assertCoverage = () => {
  cy.task('getCoverage').then((coverage: any) => {
    expect(coverage.statements.pct).to.be.gte(coverageConfig.thresholds.statements);
    expect(coverage.branches.pct).to.be.gte(coverageConfig.thresholds.branches);
    expect(coverage.functions.pct).to.be.gte(coverageConfig.thresholds.functions);
    expect(coverage.lines.pct).to.be.gte(coverageConfig.thresholds.lines);
  });
};