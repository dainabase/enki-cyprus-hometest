describe('Admin Flow E2E Tests', () => {
  beforeEach(() => {
    // Login as admin
    cy.visit('/login')
    cy.get('[data-cy="email-input"]').type('admin@enki-realty.com')
    cy.get('[data-cy="password-input"]').type('AdminPassword123!')
    cy.get('[data-cy="login-button"]').click()
    cy.url().should('include', '/admin')
  })

  describe('Project Management', () => {
    it('should create a new project successfully', () => {
      cy.visit('/admin')
      cy.get('[data-cy="add-project-button"]').click()
      
      // Fill project form
      cy.get('[data-cy="project-title-input"]').type('Test Project from Cypress')
      cy.get('[data-cy="project-description-textarea"]').type('This is a test project created by Cypress automation')
      cy.get('[data-cy="project-price-input"]').type('850000')
      
      cy.get('[data-cy="project-type-select"]').click()
      cy.get('[data-value="apartment"]').click()
      
      // Location
      cy.get('[data-cy="city-input"]').type('Limassol')
      cy.get('[data-cy="country-input"]').type('Cyprus')
      
      // Features
      cy.get('[data-cy="add-feature-button"]').click()
      cy.get('[data-cy="feature-input"]').type('Sea view')
      cy.get('[data-cy="save-feature-button"]').click()
      
      // Save project
      cy.get('[data-cy="save-project-button"]').click()
      
      // Should redirect to projects list
      cy.get('[data-cy="project-list"]').should('contain', 'Test Project from Cypress')
      
      // Should show success toast
      cy.get('[data-cy="toast-success"]').should('be.visible')
    })

    it('should edit existing project', () => {
      cy.visit('/admin')
      
      // Find and edit first project
      cy.get('[data-cy="project-card"]').first().within(() => {
        cy.get('[data-cy="edit-project-button"]').click()
      })
      
      // Update title
      cy.get('[data-cy="project-title-input"]').clear().type('Updated Project Title')
      
      // Update price
      cy.get('[data-cy="project-price-input"]').clear().type('950000')
      
      // Save changes
      cy.get('[data-cy="save-project-button"]').click()
      
      // Should show updated data
      cy.get('[data-cy="project-list"]').should('contain', 'Updated Project Title')
      cy.get('[data-cy="project-price"]').should('contain', '950,000')
    })

    it('should delete project with confirmation', () => {
      cy.visit('/admin')
      
      // Count initial projects
      cy.get('[data-cy="project-card"]').then($cards => {
        const initialCount = $cards.length
        
        // Delete first project
        cy.get('[data-cy="project-card"]').first().within(() => {
          cy.get('[data-cy="delete-project-button"]').click()
        })
        
        // Confirm deletion
        cy.get('[data-cy="confirm-delete-button"]').click()
        
        // Should have one less project
        cy.get('[data-cy="project-card"]').should('have.length', initialCount - 1)
        
        // Should show success toast
        cy.get('[data-cy="toast-success"]').should('be.visible')
      })
    })

    it('should upload project media', () => {
      cy.visit('/admin')
      cy.get('[data-cy="add-project-button"]').click()
      
      // Fill basic info
      cy.get('[data-cy="project-title-input"]').type('Media Test Project')
      cy.get('[data-cy="project-description-textarea"]').type('Testing media upload')
      cy.get('[data-cy="project-price-input"]').type('600000')
      
      // Upload photos
      cy.get('[data-cy="photos-upload"]').selectFile([
        'cypress/fixtures/test-image-1.jpg',
        'cypress/fixtures/test-image-2.jpg'
      ], { force: true })
      
      // Should show uploaded images preview
      cy.get('[data-cy="photo-preview"]').should('have.length', 2)
      
      // Upload floor plans
      cy.get('[data-cy="plans-upload"]').selectFile([
        'cypress/fixtures/floor-plan.pdf'
      ], { force: true })
      
      cy.get('[data-cy="plan-preview"]').should('be.visible')
      
      // Save project
      cy.get('[data-cy="save-project-button"]').click()
      
      // Should save successfully with media
      cy.get('[data-cy="toast-success"]').should('be.visible')
    })
  })

  describe('Promoters Management', () => {
    it('should view promoters dashboard', () => {
      cy.visit('/admin')
      cy.get('[data-cy="promoters-tab"]').click()
      
      // Should display promoters stats
      cy.get('[data-cy="total-promoters"]').should('be.visible')
      cy.get('[data-cy="total-commissions"]').should('be.visible')
      cy.get('[data-cy="pending-amount"]').should('be.visible')
      cy.get('[data-cy="paid-amount"]').should('be.visible')
      
      // Should display top promoters list
      cy.get('[data-cy="top-promoters-list"]').should('be.visible')
      cy.get('[data-cy="promoter-card"]').should('have.length.gte', 1)
    })

    it('should filter commissions by status and date', () => {
      cy.visit('/admin')
      cy.get('[data-cy="promoters-tab"]').click()
      
      // Filter by status
      cy.get('[data-cy="status-filter"]').click()
      cy.get('[data-value="pending"]').click()
      
      // Should show only pending commissions
      cy.get('[data-cy="commission-row"]').each($row => {
        cy.wrap($row).get('[data-cy="commission-status"]').should('contain', 'En attente')
      })
      
      // Filter by date
      cy.get('[data-cy="date-filter"]').click()
      cy.get('[data-value="7"]').click()
      
      // Should filter results
      cy.get('[data-cy="commission-row"]').should('be.visible')
    })

    it('should export commissions to CSV', () => {
      cy.visit('/admin')
      cy.get('[data-cy="promoters-tab"]').click()
      
      // Click export button
      cy.get('[data-cy="export-csv-button"]').click()
      
      // Should trigger download
      cy.readFile('cypress/downloads/commissions_*.csv').should('exist')
    })

    it('should search promoters', () => {
      cy.visit('/admin')
      cy.get('[data-cy="promoters-tab"]').click()
      
      // Search for specific promoter
      cy.get('[data-cy="promoter-search"]').type('Premium')
      
      // Should filter results
      cy.get('[data-cy="commission-row"]').should('contain', 'Premium')
    })
  })

  describe('Analytics Dashboard', () => {
    it('should display analytics overview', () => {
      cy.visit('/admin')
      cy.get('[data-cy="analytics-tab"]').click()
      
      // Should show key metrics
      cy.get('[data-cy="total-users"]').should('be.visible')
      cy.get('[data-cy="total-sessions"]').should('be.visible')
      cy.get('[data-cy="conversion-rate"]').should('be.visible')
      
      // Should show charts
      cy.get('[data-cy="analytics-chart"]').should('be.visible')
      cy.get('[data-cy="revenue-chart"]').should('be.visible')
    })

    it('should filter analytics by date range', () => {
      cy.visit('/admin')
      cy.get('[data-cy="analytics-tab"]').click()
      
      // Change date range
      cy.get('[data-cy="date-range-selector"]').click()
      cy.get('[data-value="30"]').click()
      
      // Charts should update
      cy.get('[data-cy="analytics-chart"]').should('be.visible')
    })
  })

  describe('User Management', () => {
    it('should view users list', () => {
      cy.visit('/admin/users')
      
      // Should display users table
      cy.get('[data-cy="users-table"]').should('be.visible')
      cy.get('[data-cy="user-row"]').should('have.length.gte', 1)
      
      // Should show user details
      cy.get('[data-cy="user-email"]').should('be.visible')
      cy.get('[data-cy="user-role"]').should('be.visible')
      cy.get('[data-cy="user-status"]').should('be.visible')
    })

    it('should change user role', () => {
      cy.visit('/admin/users')
      
      // Find regular user and change role
      cy.get('[data-cy="user-row"]').first().within(() => {
        cy.get('[data-cy="role-select"]').click()
        cy.get('[data-value="moderator"]').click()
        cy.get('[data-cy="save-role-button"]').click()
      })
      
      // Should show success message
      cy.get('[data-cy="toast-success"]').should('be.visible')
    })
  })
})