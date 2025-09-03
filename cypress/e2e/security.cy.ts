describe('Security and Auth E2E Tests', () => {
  describe('Authentication Security', () => {
    it('should handle invalid login attempts', () => {
      cy.visit('/login')
      
      // Test with invalid email format
      cy.get('[data-cy="email-input"]').type('invalid-email')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      
      cy.get('[data-cy="error-message"]').should('contain', 'format d\'email invalide')
      
      // Test with non-existent user
      cy.get('[data-cy="email-input"]').clear().type('nonexistent@example.com')
      cy.get('[data-cy="password-input"]').clear().type('wrongpassword')
      cy.get('[data-cy="login-button"]').click()
      
      cy.get('[data-cy="error-message"]').should('be.visible')
      cy.url().should('include', '/login')
    })

    it('should handle weak passwords during registration', () => {
      cy.visit('/register')
      
      cy.get('[data-cy="name-input"]').type('Test User')
      cy.get('[data-cy="email-input"]').type('test@example.com')
      
      // Test weak password
      cy.get('[data-cy="password-input"]').type('123')
      cy.get('[data-cy="confirm-password-input"]').type('123')
      
      cy.get('[data-cy="register-button"]').click()
      
      // Should show password strength error
      cy.get('[data-cy="error-message"]').should('contain', 'mot de passe trop faible')
    })

    it('should logout user properly', () => {
      // Login first
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('test@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      
      // Verify logged in
      cy.url().should('not.include', '/login')
      cy.get('[data-cy="user-menu"]').should('be.visible')
      
      // Logout
      cy.logout()
      
      // Should redirect to home and clear session
      cy.url().should('not.include', '/dashboard')
      cy.get('[data-cy="login-button"]').should('be.visible')
      
      // Try to access protected route
      cy.visit('/dashboard')
      cy.url().should('include', '/login')
    })
  })

  describe('Route Protection', () => {
    it('should redirect unauthenticated users from protected routes', () => {
      const protectedRoutes = ['/dashboard', '/admin', '/profile']
      
      protectedRoutes.forEach(route => {
        cy.visit(route)
        cy.url().should('include', '/login')
        cy.get('[data-cy="login-form"]').should('be.visible')
      })
    })

    it('should redirect non-admin users from admin routes', () => {
      // Login as regular user
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('user@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      
      // Try to access admin route
      cy.visit('/admin')
      
      // Should be redirected or show access denied
      cy.url().should('not.include', '/admin')
      cy.get('[data-cy="access-denied"]').should('be.visible')
        .or(cy.url().should('include', '/'))
    })

    it('should allow admin users to access admin routes', () => {
      // Login as admin
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('admin@enki-realty.com')
      cy.get('[data-cy="password-input"]').type('AdminPassword123!')
      cy.get('[data-cy="login-button"]').click()
      
      // Should access admin route successfully
      cy.visit('/admin')
      cy.url().should('include', '/admin')
      cy.get('[data-cy="admin-dashboard"]').should('be.visible')
    })
  })

  describe('Data Security', () => {
    it('should only show user own data in dashboard', () => {
      // Login as specific user
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('user1@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      
      cy.visit('/dashboard')
      
      // Check favorites only show this user's data
      cy.get('[data-cy="favorites-tab"]').click()
      cy.get('[data-cy="favorite-item"]').each($item => {
        // Should not contain other users' data
        cy.wrap($item).should('not.contain', 'user2@example.com')
      })
    })

    it('should prevent CSRF attacks', () => {
      // Login
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('test@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      
      // Try to make request without proper headers
      cy.request({
        method: 'POST',
        url: '/api/projects',
        body: { title: 'Malicious Project' },
        failOnStatusCode: false
      }).then(response => {
        // Should be rejected due to missing CSRF protection
        expect(response.status).to.not.equal(200)
      })
    })
  })

  describe('Session Management', () => {
    it('should handle expired sessions gracefully', () => {
      // Login
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('test@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      
      // Simulate expired session by clearing storage
      cy.clearLocalStorage()
      cy.clearCookies()
      
      // Try to access protected route
      cy.visit('/dashboard')
      
      // Should redirect to login
      cy.url().should('include', '/login')
      cy.get('[data-cy="session-expired-message"]').should('be.visible')
    })

    it('should prevent concurrent sessions if configured', () => {
      const email = 'test@example.com'
      const password = 'password123'
      
      // Login in first session
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type(email)
      cy.get('[data-cy="password-input"]').type(password)
      cy.get('[data-cy="login-button"]').click()
      
      // Open new incognito session and login
      cy.window().then(win => {
        const newWindow = win.open('/login', '_blank')
        
        // If concurrent sessions are prevented, should show warning
        cy.get('[data-cy="concurrent-session-warning"]').should('be.visible')
      })
    })
  })

  describe('Input Validation and XSS Protection', () => {
    it('should sanitize user inputs to prevent XSS', () => {
      // Login
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('test@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-button"]').click()
      
      // Try to inject script in checklist item
      cy.visit('/dashboard')
      cy.get('[data-cy="checklist-tab"]').click()
      
      const maliciousScript = '<script>alert("XSS")</script>'
      cy.get('[data-cy="new-task-input"]').type(maliciousScript)
      cy.get('[data-cy="add-task-button"]').click()
      
      // Script should be escaped, not executed
      cy.get('[data-cy="task-text"]').should('contain', '&lt;script&gt;')
      cy.get('[data-cy="task-text"]').should('not.contain', '<script>')
      
      // No alert should appear
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected!')
      })
    })

    it('should validate file uploads', () => {
      // Login as admin
      cy.visit('/login')
      cy.get('[data-cy="email-input"]').type('admin@enki-realty.com')
      cy.get('[data-cy="password-input"]').type('AdminPassword123!')
      cy.get('[data-cy="login-button"]').click()
      
      cy.visit('/admin')
      cy.get('[data-cy="add-project-button"]').click()
      
      // Try to upload invalid file type
      cy.get('[data-cy="photos-upload"]').selectFile([
        'cypress/fixtures/malicious.exe'
      ], { force: true })
      
      // Should show error for invalid file type
      cy.get('[data-cy="error-message"]').should('contain', 'type de fichier non autorisé')
    })
  })
})