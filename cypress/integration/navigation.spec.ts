/// <reference types="cypress" />

import links from '../../src/links'

context('The navigation bar', () => {
  const navLinks = Object.entries(links)

  beforeEach(() => {
    cy.visit(Cypress.env('BASE_URL'));
  })

  it(`should have ${navLinks.length} links`, () => {
    cy.findByTestId('NavigationBar')
      .get('.nav-link')
      .should('have.length', navLinks.length)
  })

  navLinks.forEach(([url, text]) => {
    describe(`Clicking on "${text}" link`, () => {
      it(`should open the ${url} page correctly`, () => {
        cy.findByTestId('NavigationBar')
          .findByText(text)
          .click()
        cy.location('pathname')
          .should('include', url)
      })
    })
  })
})
