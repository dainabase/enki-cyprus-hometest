describe('User Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Authentication Flow', () => {
    it('should register a new user successfully', () => {
      cy.visit('/register')
      
      // Fill registration form
      cy.get('[data-cy="name-input"]').type('John Doe')
      cy.get('[data-cy="email-input"]').type(`test${Date.now()}@example.com`)
      cy.get('[data-cy="password-input"]').type('TestPassword123!')
      cy.get('[data-cy="confirm-password-input"]').type('TestPassword123!')
      
      // Check consent checkboxes
      cy.get('[data-cy="consent-notifications"]').check()
      cy.get('[data-cy="consent-terms"]').check()
      
      cy.get('[data-cy="register-button"]').click()
      
      // Should redirect to home or dashboard
      cy.url().should('not.include', '/register')
    })

    it('should login existing user successfully', () => {
      cy.login('test@example.com', 'password123')
      cy.url().should('include', '/dashboard')
    })

    it('should handle failed login gracefully', () => {
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('wrong@example.com')
      cy.get('[data-cy="password-input"]').type('wrongpassword')
      cy.get('[data-cy="login-button"]').click()
      
      // Should show error message
      cy.contains('Erreur de connexion').should('be.visible')
      cy.url().should('include', '/login')
    })
  })

  describe('Property Search and Filtering', () => {
    it('should search and filter properties successfully', () => {
      cy.visit('/search')
      cy.waitForPageLoad()

      // Test type filter
      cy.get('[data-cy="property-type-filter"]').click()
      cy.get('[data-value="villa"]').click()

      // Test budget filter
      cy.get('[data-cy="budget-min-input"]').type('500000')
      cy.get('[data-cy="budget-max-input"]').type('1000000')

      // Test location filter
      cy.get('[data-cy="location-input"]').type('Limassol')

      // Apply filters
      cy.get('[data-cy="apply-filters-button"]').click()
      cy.waitForPageLoad()

      // Check results are filtered
      cy.get('[data-cy="property-card"]').should('exist')
      cy.get('[data-cy="property-type"]').should('contain', 'Villa')
    })

    it('should interact with map markers', () => {
      cy.visit('/search')
      cy.waitForPageLoad()

      // Wait for map to load
      cy.get('[data-cy="google-map"]', { timeout: 10000 }).should('be.visible')

      // Click on a map marker
      cy.get('[data-cy="map-marker"]').first().click()

      // Property details modal should open
      cy.get('[data-cy="property-modal"]').should('be.visible')
      cy.get('[data-cy="property-title"]').should('be.visible')
      cy.get('[data-cy="property-price"]').should('be.visible')
    })

    it('should add property to favorites', () => {
      cy.login('test@example.com', 'password123')
      cy.visit('/search')
      cy.waitForPageLoad()

      // Click on first property
      cy.get('[data-cy="property-card"]').first().click()
      
      // Add to favorites
      cy.get('[data-cy="favorite-button"]').click()
      
      // Should show success toast
      cy.get('[data-cy="toast-success"]').should('be.visible')
      cy.get('[data-cy="favorite-button"]').should('have.class', 'favorited')
    })
  })

  describe('Dashboard Functionality', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123')
      cy.visit('/dashboard')
      cy.waitForPageLoad()
    })

    it('should display user dashboard with all sections', () => {
      // Check tabs exist
      cy.get('[data-cy="favorites-tab"]').should('be.visible')
      cy.get('[data-cy="checklist-tab"]').should('be.visible')
      cy.get('[data-cy="lexaia-tab"]').should('be.visible')
      cy.get('[data-cy="promoters-tab"]').should('be.visible')
    })

    it('should manage checklist items', () => {
      cy.get('[data-cy="checklist-tab"]').click()
      
      // Add new checklist item
      cy.get('[data-cy="new-task-input"]').type('Test task from Cypress')
      cy.get('[data-cy="add-task-button"]').click()
      
      // Should show in list
      cy.contains('Test task from Cypress').should('be.visible')
      
      // Mark as completed
      cy.get('[data-cy="task-checkbox"]').last().check()
      
      // Should show as completed
      cy.get('[data-cy="task-text"]').last().should('have.class', 'line-through')
    })

    it('should use Lexaia calculator', () => {
      cy.get('[data-cy="lexaia-tab"]').click()
      
      // Fill form
      cy.get('[data-cy="country-select"]').click()
      cy.get('[data-value="Chypre"]').click()
      
      cy.get('[data-cy="budget-input"]').type('750000')
      
      cy.get('[data-cy="property-type-select"]').click()
      cy.get('[data-value="villa"]').click()
      
      // Submit calculation
      cy.get('[data-cy="calculate-button"]').click()
      
      // Should show results
      cy.get('[data-cy="lexaia-results"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-cy="tax-saved"]').should('contain', '€')
      cy.get('[data-cy="effective-rate"]').should('contain', '%')
    })
  })

  describe('Performance and UX', () => {
    it('should load pages within 2 seconds', () => {
      const start = Date.now()
      
      cy.visit('/projects')
      cy.waitForPageLoad()
      
      cy.then(() => {
        const loadTime = Date.now() - start
        expect(loadTime).to.be.lessThan(2000)
      })
    })

    it('should have smooth animations', () => {
      cy.visit('/')
      
      // Check hero animations
      cy.checkAnimation('[data-cy="hero-title"]')
      cy.checkAnimation('[data-cy="hero-description"]')
      
      // Check card animations on scroll
      cy.get('[data-cy="featured-projects"]').scrollIntoView()
      cy.checkAnimation('[data-cy="project-card"]')
    })

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-6')
      cy.visit('/')
      
      // Check mobile navigation
      cy.get('[data-cy="mobile-menu-button"]').should('be.visible')
      cy.get('[data-cy="mobile-menu-button"]').click()
      cy.get('[data-cy="mobile-nav"]').should('be.visible')
      
      // Check content is readable
      cy.get('[data-cy="hero-title"]').should('be.visible')
      cy.get('[data-cy="cta-button"]').should('be.visible')
    })
  })

  describe('Security and Access Control', () => {
    it('should redirect unauthorized users from protected routes', () => {
      cy.visit('/admin')
      cy.url().should('include', '/login')
    })

    it('should prevent access to admin features for regular users', () => {
      cy.login('user@example.com', 'password123')
      cy.visit('/admin')
      
      // Should show access denied or redirect
      cy.url().should('not.include', '/admin')
    })
  })
})