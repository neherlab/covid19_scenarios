/// <reference types="cypress" />

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../src/helpers/localStorage'
import links from '../../src/links'

context('The navigation bar', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(Cypress.env('BASE_URL'))
  })

  describe('Initial entry page', () => {
    it('should be landing page for the first time', () => {
      cy.findByTestId('LandingPage').should('be.visible')
      cy.findByTestId('MainPage').should('be.not.visible')
    })

    it('should not be landing page after click Simulate', () => {
      cy.findByTestId('LandingPage').should('be.visible')
      cy.findByTestId('Simulate').should('be.visible').click()
      cy.findByTestId('MainPage').should('be.visible')
    })

    it(`should be landing page when ${LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE} is falsy`, () => {
      LocalStorage.set(LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE, false)
      cy.visit(Cypress.env('BASE_URL'))
      cy.findByTestId('LandingPage').should('be.visible')
    })

    it(`should be main page when ${LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE} is truthy`, () => {
      LocalStorage.set(LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE, true)
      cy.visit(Cypress.env('BASE_URL'))
      cy.findByTestId('MainPage').should('be.visible')
    })
  })

  describe('Navigation Bar', () => {
    const navLinks = Object.keys(links)

    beforeEach(() => {
      cy.skipLandingPage()
      cy.closeDisclaimer()
    })

    it(`should have ${navLinks.length} links`, () => {
      cy.findByTestId('NavigationBar').get('.nav-link').should('have.length', navLinks.length)
    })

    for (const url of navLinks) {
      describe(`Clicking on "${url}" link`, () => {
        it(`should open the ${url} page correctly`, () => {
          cy.findByTestId('NavigationBar').get(`[href="${url}"]`).first().click()

          cy.location('pathname').should('include', url)
        })
      })
    }
  })
})
