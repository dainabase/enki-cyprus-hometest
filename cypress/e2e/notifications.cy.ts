describe('Notifications E2E Tests', () => {
  beforeEach(() => {
    // Mock SendGrid API to prevent real emails in tests
    cy.intercept('POST', '**/functions/v1/send-notification', {
      statusCode: 200,
      body: { success: true, message: 'Email logged to console (mock mode)' }
    }).as('sendNotification')
  })

  describe('Commission Notifications', () => {
    beforeEach(() => {
      // Login as admin to create commissions
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('admin@enki-realty.com')
      cy.get('[data-cy="password-input"]').type('AdminPassword123!')
      cy.get('[data-cy="login-button"]').click()
      cy.url().should('include', '/admin')
    })

    it('should trigger commission notification when commission is created', () => {
      cy.visit('/admin')
      cy.get('[data-cy="promoters-tab"]').click()
      
      // Trigger a mock commission creation
      cy.get('[data-cy="trigger-commission-button"]').click()
      
      // Should call notification API
      cy.wait('@sendNotification')
      
      // Should show success toast
      cy.get('[data-cy="toast-success"]')
        .should('be.visible')
        .and('contain', 'Commission')
      
      // Should appear in commission list
      cy.get('[data-cy="commission-row"]').should('have.length.gte', 1)
    })

    it('should show commission email content preview', () => {
      cy.visit('/admin')
      cy.get('[data-cy="promoters-tab"]').click()
      
      // Click on commission details
      cy.get('[data-cy="commission-row"]').first().click()
      
      // Should show email preview modal
      cy.get('[data-cy="email-preview-modal"]').should('be.visible')
      cy.get('[data-cy="email-subject"]').should('contain', 'Commission confirmée')
      cy.get('[data-cy="email-content"]').should('contain', 'Félicitations')
    })
  })

  describe('Checklist Notifications', () => {
    beforeEach(() => {
      // Login as regular user
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('user@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      cy.visit('/dashboard')
    })

    it('should trigger notification when checklist is updated', () => {
      cy.get('[data-cy="checklist-tab"]').click()
      
      // Add and complete a task
      cy.get('[data-cy="new-task-input"]').type('Test task for notification')
      cy.get('[data-cy="add-task-button"]').click()
      
      // Mark task as completed
      cy.get('[data-cy="task-checkbox"]').last().check()
      
      // Should trigger notification
      cy.wait('@sendNotification')
      
      // Should show progress toast
      cy.get('[data-cy="toast-info"]')
        .should('be.visible')
        .and('contain', 'Checklist')
    })

    it('should show checklist progress correctly', () => {
      cy.get('[data-cy="checklist-tab"]').click()
      
      // Check current progress
      cy.get('[data-cy="progress-bar"]').should('be.visible')
      cy.get('[data-cy="progress-text"]').should('match', /\d+\/\d+ tâches/)
      
      // Complete a task and verify progress update
      cy.get('[data-cy="task-checkbox"]').first().check()
      cy.get('[data-cy="progress-bar"]').should('have.attr', 'style')
      
      // Should show updated progress in toast
      cy.get('[data-cy="toast-info"]').should('contain', 'complétées')
    })
  })

  describe('Welcome Notifications', () => {
    it('should send welcome email on user registration', () => {
      cy.visit('/register')
      
      // Fill registration form
      const timestamp = Date.now()
      cy.get('[data-cy="name-input"]').type('Test User')
      cy.get('[data-cy="email-input"]').type(`test${timestamp}@example.com`)
      cy.get('[data-cy="password-input"]').type('TestPassword123!')
      cy.get('[data-cy="confirm-password-input"]').type('TestPassword123!')
      
      // Accept notifications consent
      cy.get('[data-cy="consent-notifications"]').check()
      cy.get('[data-cy="consent-terms"]').check()
      
      // Submit registration
      cy.get('[data-cy="register-button"]').click()
      
      // Should trigger welcome notification
      cy.wait('@sendNotification')
      
      // Should show welcome toast
      cy.get('[data-cy="toast-success"]')
        .should('be.visible')
        .and('contain', 'Bienvenue')
    })
  })

  describe('Toast Animations', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should display toasts with smooth animations', () => {
      // Trigger a favorite action to show toast
      cy.visit('/search')
      cy.waitForPageLoad()
      
      cy.get('[data-cy="property-card"]').first().within(() => {
        cy.get('[data-cy="favorite-button"]').click()
      })
      
      // Check toast animation
      cy.get('[data-cy="toast-success"]')
        .should('be.visible')
        .and('have.css', 'opacity', '1')
        .and('have.css', 'transform')
      
      // Should fade out after duration
      cy.get('[data-cy="toast-success"]', { timeout: 6000 }).should('not.exist')
    })

    it('should handle multiple toasts gracefully', () => {
      // Trigger multiple actions quickly
      cy.visit('/search')
      cy.waitForPageLoad()
      
      // Add multiple favorites
      cy.get('[data-cy="property-card"]').each(($card, index) => {
        if (index < 3) {
          cy.wrap($card).within(() => {
            cy.get('[data-cy="favorite-button"]').click()
          })
        }
      })
      
      // Should show multiple toasts stacked
      cy.get('[data-cy="toast-success"]').should('have.length.gte', 2)
      
      // Should not overlap
      cy.get('[data-cy="toast-success"]').each(($toast, index) => {
        if (index > 0) {
          cy.wrap($toast).should('have.css', 'transform')
        }
      })
    })
  })

  describe('GDPR Consent', () => {
    it('should respect notification preferences', () => {
      // Register without notification consent
      cy.visit('/register')
      
      const timestamp = Date.now()
      cy.get('[data-cy="name-input"]').type('No Notifications User')
      cy.get('[data-cy="email-input"]').type(`nonotif${timestamp}@example.com`)
      cy.get('[data-cy="password-input"]').type('TestPassword123!')
      cy.get('[data-cy="confirm-password-input"]').type('TestPassword123!')
      
      // Do NOT check notification consent
      cy.get('[data-cy="consent-notifications"]').should('not.be.checked')
      cy.get('[data-cy="consent-terms"]').check()
      
      cy.get('[data-cy="register-button"]').click()
      
      // Should NOT trigger welcome notification
      cy.get('@sendNotification.all').should('have.length', 0)
      
      // Should still show local welcome toast
      cy.get('[data-cy="toast-success"]').should('be.visible')
    })

    it('should allow updating notification preferences', () => {
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('user@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      
      cy.visit('/profile')
      
      // Should show consent management
      cy.get('[data-cy="notification-preferences"]').should('be.visible')
      
      // Update preferences
      cy.get('[data-cy="consent-notifications"]').uncheck()
      cy.get('[data-cy="save-preferences-button"]').click()
      
      // Should show confirmation
      cy.get('[data-cy="toast-success"]')
        .should('be.visible')
        .and('contain', 'Préférences')
    })
  })

  describe('Email Rate Limiting', () => {
    it('should handle email sending errors gracefully', () => {
      // Mock API error
      cy.intercept('POST', '**/functions/v1/send-notification', {
        statusCode: 500,
        body: { error: 'Rate limit exceeded' }
      }).as('sendNotificationError')
      
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('admin@enki-realty.com')
      cy.get('[data-cy="password-input"]').type('AdminPassword123!')
      cy.get('[data-cy="login-button"]').click()
      
      cy.visit('/admin')
      cy.get('[data-cy="promoters-tab"]').click()
      cy.get('[data-cy="trigger-commission-button"]').click()
      
      cy.wait('@sendNotificationError')
      
      // Should show error toast instead of crashing
      cy.get('[data-cy="toast-error"]')
        .should('be.visible')
        .and('contain', 'Erreur')
    })
  })
})