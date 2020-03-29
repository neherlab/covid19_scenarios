/// <reference types="cypress" />

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../src/helpers/localStorage'

const resultsCharts = ['DeterministicLinePlot', 'AgeBarChart', 'OutcomeRatesTable']

context('The results card', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(Cypress.env('BASE_URL'))
    cy.skipLandingPage()
    cy.closeDisclaimer()
  })

  describe('RunResults', () => {
    it('should have visible run button', () => {
      cy.findByTestId('RunResults').should('be.visible')
    })
  })

  describe(`when ${LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION} is disabled`, () => {
    describe('LogScaleSwitch', () => {
      it('should be invisible by default', () => {
        cy.findByTestId('LogScaleSwitch').should('be.not.visible')
      })

      it('should become visible after clicking RunResults button', () => {
        cy.findByTestId('RunResults').click()
        cy.findByTestId('LogScaleSwitch').should('be.visible')
      })
    })

    describe('results charts', () => {
      it('should have default invisible charts', () => {
        for (const testId of resultsCharts) {
          cy.findByTestId(testId).should('be.not.visible')
        }
      })

      it('should become visible charts after clicking RunResults button', () => {
        cy.findByTestId('RunResults').click()

        for (const testId of resultsCharts) {
          cy.findByTestId(testId).should('be.visible')
        }
      })
    })
  })

  describe(`when ${LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION} is enabled`, () => {
    describe('LogScaleSwitch', () => {
      it(`should be visible when ${LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION} is enabled`, () => {
        LocalStorage.set(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION, true)
        cy.visit(Cypress.env('BASE_URL'))
        cy.skipLandingPage()
        cy.findByTestId('LogScaleSwitch').should('be.visible')
      })
    })

    describe('results charts', () => {
      it('should have visible charts', () => {
        for (const testId of resultsCharts) {
          cy.findByTestId(testId).should('be.not.visible')
        }
      })
    })
  })
})
