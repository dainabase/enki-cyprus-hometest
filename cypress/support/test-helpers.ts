// Rate limiting mock for testing
export const mockRateLimiting = () => {
  let emailCount = 0;
  const RATE_LIMIT = 5; // Max 5 emails per minute
  const RATE_WINDOW = 60000; // 1 minute

  cy.intercept('POST', '**/functions/v1/send-notification', (req) => {
    emailCount++;
    
    if (emailCount > RATE_LIMIT) {
      req.reply({
        statusCode: 429,
        body: {
          success: false,
          error: 'Rate limit exceeded. Too many emails sent.',
          retry_after: 60
        }
      });
    } else {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          message: 'Email logged to console (mock mode)',
          generated_at: new Date().toISOString()
        }
      });
    }
  }).as('sendNotificationWithRateLimit');

  // Reset counter after rate window
  setTimeout(() => {
    emailCount = 0;
  }, RATE_WINDOW);
};

// Mock notification preferences
export const mockNotificationPreferences = (preferences: any) => {
  cy.intercept('GET', '**/rest/v1/notification_preferences*', {
    statusCode: 200,
    body: preferences
  }).as('getNotificationPreferences');

  cy.intercept('POST', '**/rest/v1/notification_preferences', {
    statusCode: 201,
    body: preferences
  }).as('updateNotificationPreferences');
};

// Security test helpers
export const testCSRFProtection = () => {
  // Test CSRF token validation
  cy.request({
    method: 'POST',
    url: '/api/projects',
    body: { title: 'Malicious Project' },
    headers: {
      'Content-Type': 'application/json'
      // Intentionally omit CSRF token
    },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.not.equal(200);
  });
};

export const testXSSPrevention = (inputSelector: string, maliciousScript: string) => {
  cy.get(inputSelector).type(maliciousScript);
  cy.get(inputSelector).should('not.contain', '<script>');
  
  // Ensure script is escaped in display
  cy.get('[data-cy="displayed-content"]').should('contain', '&lt;script&gt;');
};

// Performance testing helpers
export const measurePageLoad = (pageName: string) => {
  cy.window().then((win) => {
    const perfData = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      page: pageName,
      loadTime: perfData.loadEventEnd - perfData.loadEventStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      firstPaint: perfData.responseEnd - perfData.requestStart,
      timestamp: new Date().toISOString()
    };
    
    cy.task('logPerformance', metrics);
    
    // Assert performance thresholds
    expect(metrics.loadTime).to.be.lessThan(2000); // Under 2 seconds
    expect(metrics.domContentLoaded).to.be.lessThan(1000); // Under 1 second
  });
};