// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('[data-cy="email-input"]').type(email)
  cy.get('[data-cy="password-input"]').type(password)
  cy.get('[data-cy="login-button"]').click()
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu"]').click()
  cy.get('[data-cy="logout-button"]').click()
  cy.url().should('include', '/')
})

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-cy="loading-spinner"]', { timeout: 10000 }).should('not.exist')
})

Cypress.Commands.add('checkAnimation', (selector: string) => {
  cy.get(selector)
    .should('be.visible')
    .and('have.css', 'animation-duration')
})
