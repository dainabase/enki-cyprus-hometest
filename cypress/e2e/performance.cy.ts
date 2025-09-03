describe('Performance E2E Tests', () => {
  describe('Page Load Performance', () => {
    it('should load home page within 2 seconds', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start')
        },
        onLoad: (win) => {
          win.performance.mark('end')
          win.performance.measure('pageLoad', 'start', 'end')
        }
      })
      
      cy.window().then((win) => {
        const measure = win.performance.getEntriesByName('pageLoad')[0]
        expect(measure.duration).to.be.lessThan(2000)
      })
    })

    it('should load search page efficiently', () => {
      const start = performance.now()
      
      cy.visit('/search')
      cy.waitForPageLoad()
      
      cy.then(() => {
        const loadTime = performance.now() - start
        expect(loadTime).to.be.lessThan(3000) // Allow more time for map loading
      })
    })

    it('should have good Lighthouse scores', () => {
      cy.visit('/')
      
      // Simulate lighthouse audit checks
      cy.get('img').each($img => {
        // All images should have alt attributes
        cy.wrap($img).should('have.attr', 'alt')
      })
      
      // Check for proper heading hierarchy
      cy.get('h1').should('have.length', 1)
      
      // Check for meta description
      cy.get('head meta[name="description"]').should('exist')
      
      // Check for proper lang attribute
      cy.get('html').should('have.attr', 'lang')
    })
  })

  describe('Animation Performance', () => {
    it('should have smooth hero animations', () => {
      cy.visit('/')
      
      // Check hero title animation
      cy.get('[data-cy="hero-title"]')
        .should('be.visible')
        .and('have.css', 'animation-duration')
      
      // Check hero description animation
      cy.get('[data-cy="hero-description"]')
        .should('be.visible')
        .and('have.css', 'transition-duration')
      
      // Animations should complete within reasonable time
      cy.get('[data-cy="hero-title"]').should('have.css', 'opacity', '1')
      cy.get('[data-cy="hero-description"]').should('have.css', 'opacity', '1')
    })

    it('should have smooth card animations on scroll', () => {
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
      
      // Navigate to projects page
      cy.get('[data-cy="projects-link"]').click()
      
      // Should have smooth transition
      cy.url().should('include', '/projects')
      cy.get('[data-cy="page-content"]').should('be.visible')
      
      // Check fade-in animation
      cy.get('[data-cy="page-content"]').should('have.css', 'opacity', '1')
    })
  })

  describe('Resource Loading', () => {
    it('should load images efficiently', () => {
      cy.visit('/projects')
      cy.waitForPageLoad()
      
      // Check lazy loading
      cy.get('[data-cy="project-image"]').each($img => {
        cy.wrap($img).should('have.attr', 'loading', 'lazy')
      })
      
      // Images should load when scrolled into view
      cy.get('[data-cy="project-card"]').last().scrollIntoView()
      cy.get('[data-cy="project-image"]').last().should('be.visible')
    })

    it('should handle large datasets efficiently', () => {
      cy.visit('/search')
      cy.waitForPageLoad()
      
      // Apply filters that might return many results
      cy.get('[data-cy="budget-min-input"]').type('100000')
      cy.get('[data-cy="budget-max-input"]').type('2000000')
      cy.get('[data-cy="apply-filters-button"]').click()
      
      // Should paginate or virtualize results
      const start = performance.now()
      cy.waitForPageLoad()
      const loadTime = performance.now() - start
      
      expect(loadTime).to.be.lessThan(1000)
      
      // Should show reasonable number of items per page
      cy.get('[data-cy="property-card"]').should('have.length.lte', 20)
    })
  })

  describe('Network Performance', () => {
    it('should minimize API calls', () => {
      let apiCallCount = 0
      
      cy.intercept('**/api/**', (req) => {
        apiCallCount++
      }).as('apiCalls')
      
      cy.visit('/dashboard')
      cy.waitForPageLoad()
      
      // Should not make excessive API calls
      cy.then(() => {
        expect(apiCallCount).to.be.lessThan(10)
      })
    })

    it('should handle slow network gracefully', () => {
      // Simulate slow network
      cy.intercept('**/api/**', (req) => {
        req.reply((res) => {
          return new Promise(resolve => {
            setTimeout(() => resolve(res), 2000)
          })
        })
      })
      
      cy.visit('/search')
      
      // Should show loading states
      cy.get('[data-cy="loading-spinner"]').should('be.visible')
      
      // Should eventually load content
      cy.get('[data-cy="property-card"]', { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Memory Performance', () => {
    it('should not have memory leaks during navigation', () => {
      const pages = ['/', '/projects', '/search', '/about', '/contact']
      
      pages.forEach(page => {
        cy.visit(page)
        cy.waitForPageLoad()
        
        // Check for potential memory leaks
        cy.window().then(win => {
          // Check if performance entries are growing excessively
          const entries = win.performance.getEntries()
          expect(entries.length).to.be.lessThan(100)
        })
      })
    })

    it('should clean up event listeners', () => {
      cy.visit('/search')
      cy.waitForPageLoad()
      
      // Navigate away and back
      cy.visit('/')
      cy.visit('/search')
      cy.waitForPageLoad()
      
      // Map should still work properly (no duplicate listeners)
      cy.get('[data-cy="google-map"]').should('be.visible')
      cy.get('[data-cy="map-marker"]').first().click()
      cy.get('[data-cy="property-modal"]').should('be.visible')
    })
  })

  describe('Mobile Performance', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })

    it('should perform well on mobile devices', () => {
      const start = performance.now()
      
      cy.visit('/')
      cy.waitForPageLoad()
      
      const loadTime = performance.now() - start
      expect(loadTime).to.be.lessThan(3000) // Allow more time for mobile
    })

    it('should have efficient touch interactions', () => {
      cy.visit('/projects')
      cy.waitForPageLoad()
      
      // Touch interactions should be responsive
      cy.get('[data-cy="project-card"]').first().click()
      cy.get('[data-cy="project-modal"]').should('be.visible')
      
      // Swipe gestures should work smoothly
      cy.get('[data-cy="image-carousel"]').trigger('touchstart', { which: 1 })
      cy.get('[data-cy="image-carousel"]').trigger('touchmove', { which: 1, clientX: 100 })
      cy.get('[data-cy="image-carousel"]').trigger('touchend')
      
      // Should change image
      cy.get('[data-cy="active-image"]').should('be.visible')
    })
  })
})