describe('UI/UX E2E Tests', () => {
  describe('Toast Animations and Interactions', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should show success toast with spring animation when adding favorite', () => {
      cy.visit('/search')
      cy.waitForPageLoad()

      // Add property to favorites
      cy.get('[data-cy="property-card"]').first().within(() => {
        cy.get('[data-cy="favorite-button"]').click()
      })

      // Check toast appears with animation
      cy.get('[data-cy="toast-success"]')
        .should('be.visible')
        .and('contain', 'Favori ajouté')
        .and('have.css', 'opacity', '1')

      // Check spring animation properties
      cy.get('[data-cy="toast-success"]')
        .should('have.css', 'transform')
        .and('have.css', 'transition')
    })

    it('should show error toast with appropriate styling', () => {
      // Trigger an error by trying to submit empty Lexaia form
      cy.visit('/dashboard')
      cy.get('[data-cy="lexaia-tab"]').click()
      
      cy.get('[data-cy="calculate-button"]').click()
      
      cy.get('[data-cy="toast-error"]')
        .should('be.visible')
        .and('contain', 'Erreur')
        .and('have.class', 'bg-red-50')
    })

    it('should show info toast for checklist updates', () => {
      cy.login('user@example.com', 'password123')
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-tab"]').click()
      
      // Toggle a checklist item
      cy.get('[data-cy="task-checkbox"]').first().check()
      
      cy.get('[data-cy="toast-info"]')
        .should('be.visible')
        .and('contain', 'Checklist')
        .and('have.class', 'bg-blue-50')
    })

    it('should handle multiple toasts with staggered animation', () => {
      cy.visit('/search')
      cy.waitForPageLoad()
      
      // Rapidly add multiple favorites
      cy.get('[data-cy="property-card"]').each(($card, index) => {
        if (index < 3) {
          cy.wrap($card).within(() => {
            cy.get('[data-cy="favorite-button"]').click()
            cy.wait(100) // Small delay to trigger multiple toasts
          })
        }
      })
      
      // Should show multiple toasts
      cy.get('[data-cy="toast-success"]').should('have.length.gte', 2)
      
      // Toasts should be stacked properly without overlap
      cy.get('[data-cy="toast-success"]').then($toasts => {
        let previousBottom = 0
        $toasts.each((index, toast) => {
          const rect = toast.getBoundingClientRect()
          if (index > 0) {
            expect(rect.top).to.be.greaterThan(previousBottom)
          }
          previousBottom = rect.bottom
        })
      })
    })

    it('should auto-dismiss toasts after duration', () => {
      cy.visit('/search')
      cy.waitForPageLoad()
      
      cy.get('[data-cy="property-card"]').first().within(() => {
        cy.get('[data-cy="favorite-button"]').click()
      })
      
      cy.get('[data-cy="toast-success"]').should('be.visible')
      
      // Should disappear after 5 seconds
      cy.get('[data-cy="toast-success"]', { timeout: 6000 }).should('not.exist')
    })

    it('should allow manual dismissal of toasts', () => {
      cy.visit('/search')
      cy.waitForPageLoad()
      
      cy.get('[data-cy="property-card"]').first().within(() => {
        cy.get('[data-cy="favorite-button"]').click()
      })
      
      cy.get('[data-cy="toast-success"]').should('be.visible')
      
      // Click dismiss button
      cy.get('[data-cy="toast-dismiss"]').click()
      
      // Should disappear immediately
      cy.get('[data-cy="toast-success"]').should('not.exist')
    })
  })

  describe('Framer Motion Animations', () => {
    it('should have smooth hero section animations', () => {
      cy.visit('/')
      
      // Check hero elements animate in
      cy.get('[data-cy="hero-title"]')
        .should('be.visible')
        .and('have.css', 'opacity', '1')
      
      cy.get('[data-cy="hero-description"]')
        .should('be.visible')
        .and('have.css', 'opacity', '1')
      
      cy.get('[data-cy="hero-cta"]')
        .should('be.visible')
        .and('have.css', 'opacity', '1')
    })

    it('should animate project cards on scroll', () => {
      cy.visit('/')
      
      // Scroll to featured projects
      cy.get('[data-cy="featured-projects"]').scrollIntoView()
      
      // Check stagger animation
      cy.get('[data-cy="project-card"]').each(($card, index) => {
        cy.wrap($card)
          .should('be.visible')
          .and('have.css', 'opacity', '1')
          .and('have.css', 'transform')
      })
    })

    it('should have smooth page transitions', () => {
      cy.visit('/')
      
      // Navigate to projects
      cy.get('[data-cy="projects-link"]').click()
      
      // Page should fade in
      cy.url().should('include', '/projects')
      cy.get('[data-cy="page-content"]')
        .should('be.visible')
        .and('have.css', 'opacity', '1')
    })

    it('should animate modals and overlays', () => {
      cy.visit('/search')
      cy.waitForPageLoad()
      
      // Open property modal
      cy.get('[data-cy="property-card"]').first().click()
      
      // Modal should scale in
      cy.get('[data-cy="property-modal"]')
        .should('be.visible')
        .and('have.css', 'opacity', '1')
        .and('have.css', 'transform')
      
      // Close modal
      cy.get('[data-cy="modal-close"]').click()
      
      // Should animate out
      cy.get('[data-cy="property-modal"]').should('not.exist')
    })

    it('should animate form interactions', () => {
      cy.visit('/contact')
      
      // Focus input should have subtle animation
      cy.get('[data-cy="name-input"]').focus()
      cy.get('[data-cy="name-input"]')
        .should('have.css', 'border-color')
        .and('have.css', 'transition')
      
      // Submit button should have hover animation
      cy.get('[data-cy="submit-button"]').trigger('mouseover')
      cy.get('[data-cy="submit-button"]')
        .should('have.css', 'transform')
        .and('have.css', 'transition')
    })
  })

  describe('Loading States and Spinners', () => {
    it('should show loading spinner during data fetching', () => {
      // Intercept API to add delay
      cy.intercept('GET', '**/rest/v1/projects*', { delay: 2000 }).as('getProjects')
      
      cy.visit('/search')
      
      // Should show loading spinner
      cy.get('[data-cy="loading-spinner"]').should('be.visible')
      
      // Should disappear when data loads
      cy.wait('@getProjects')
      cy.get('[data-cy="loading-spinner"]').should('not.exist')
      cy.get('[data-cy="property-card"]').should('be.visible')
    })

    it('should show skeleton loaders for property cards', () => {
      // Intercept with delay
      cy.intercept('GET', '**/rest/v1/projects*', { delay: 1500 }).as('getProjects')
      
      cy.visit('/projects')
      
      // Should show skeleton cards
      cy.get('[data-cy="skeleton-card"]').should('be.visible')
      cy.get('[data-cy="skeleton-card"]').should('have.length.gte', 3)
      
      // Should be replaced with real cards
      cy.wait('@getProjects')
      cy.get('[data-cy="skeleton-card"]').should('not.exist')
      cy.get('[data-cy="property-card"]').should('be.visible')
    })

    it('should show loading state on Lexaia calculation', () => {
      cy.login('user@example.com', 'password123')
      cy.visit('/dashboard')
      cy.get('[data-cy="lexaia-tab"]').click()
      
      // Fill form
      cy.get('[data-cy="country-select"]').click()
      cy.get('[data-value="Chypre"]').click()
      cy.get('[data-cy="budget-input"]').type('750000')
      
      // Submit and check loading state
      cy.get('[data-cy="calculate-button"]').click()
      cy.get('[data-cy="loading-spinner"]').should('be.visible')
      
      // Should show results
      cy.get('[data-cy="lexaia-results"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-cy="loading-spinner"]').should('not.exist')
    })
  })

  describe('Responsive Design', () => {
    it('should work well on mobile devices', () => {
      cy.viewport('iphone-6')
      cy.visit('/')
      
      // Mobile navigation should work
      cy.get('[data-cy="mobile-menu-button"]').should('be.visible').click()
      cy.get('[data-cy="mobile-nav"]').should('be.visible')
      
      // Content should be readable
      cy.get('[data-cy="hero-title"]').should('be.visible')
      cy.get('[data-cy="hero-description"]').should('be.visible')
      
      // Cards should stack properly
      cy.get('[data-cy="featured-projects"]').scrollIntoView()
      cy.get('[data-cy="project-card"]').should('be.visible')
    })

    it('should handle tablet layout', () => {
      cy.viewport('ipad-2')
      cy.visit('/search')
      cy.waitForPageLoad()
      
      // Grid should adjust for tablet
      cy.get('[data-cy="property-grid"]').should('be.visible')
      cy.get('[data-cy="property-card"]').should('be.visible')
      
      // Map should be visible
      cy.get('[data-cy="google-map"]').should('be.visible')
      
      // Filters should be accessible
      cy.get('[data-cy="filters-panel"]').should('be.visible')
    })

    it('should adapt to large screens', () => {
      cy.viewport(1920, 1080)
      cy.visit('/')
      
      // Content should not be too wide
      cy.get('[data-cy="main-content"]').should('have.css', 'max-width')
      
      // Should use available space efficiently
      cy.get('[data-cy="featured-projects"]').scrollIntoView()
      cy.get('[data-cy="project-card"]').should('have.length.gte', 3)
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully', () => {
      // Mock network failure
      cy.intercept('GET', '**/rest/v1/projects*', { forceNetworkError: true }).as('networkError')
      
      cy.visit('/search')
      
      // Should show error message
      cy.get('[data-cy="error-message"]').should('be.visible')
      cy.get('[data-cy="retry-button"]').should('be.visible')
      
      // Retry should work
      cy.intercept('GET', '**/rest/v1/projects*', { fixture: 'projects.json' }).as('retrySuccess')
      cy.get('[data-cy="retry-button"]').click()
      
      cy.wait('@retrySuccess')
      cy.get('[data-cy="property-card"]').should('be.visible')
    })

    it('should handle empty states', () => {
      // Mock empty response
      cy.intercept('GET', '**/rest/v1/projects*', { body: [] }).as('emptyProjects')
      
      cy.visit('/search')
      cy.wait('@emptyProjects')
      
      // Should show empty state
      cy.get('[data-cy="empty-state"]').should('be.visible')
      cy.get('[data-cy="empty-message"]').should('contain', 'Aucun projet trouvé')
      cy.get('[data-cy="clear-filters-button"]').should('be.visible')
    })

    it('should validate form inputs properly', () => {
      cy.visit('/contact')
      
      // Submit empty form
      cy.get('[data-cy="submit-button"]').click()
      
      // Should show validation errors
      cy.get('[data-cy="name-error"]').should('be.visible')
      cy.get('[data-cy="email-error"]').should('be.visible')
      cy.get('[data-cy="message-error"]').should('be.visible')
      
      // Fill with invalid data
      cy.get('[data-cy="email-input"]').type('invalid-email')
      cy.get('[data-cy="submit-button"]').click()
      
      // Should show email format error
      cy.get('[data-cy="email-error"]').should('contain', 'format')
    })
  })
})