/// <reference types="cypress" />

const resultsCharts = ['DeterministicLinePlot', 'AgeBarChart', 'OutcomeRatesTable']

context('The results card', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('BASE_URL'))
    cy.closeDisclaimer()
  })

  describe('RunResults', () => {
    it('should have visible run button', () => {
      cy.findByTestId('RunResults').should('be.visible')
    })
  })

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
      resultsCharts.forEach((testId) => {
        cy.findByTestId(testId).should('be.not.visible')
      })
    })

    it('should become visible charts after clicking RunResults button', () => {
      cy.findByTestId('RunResults').click()

      resultsCharts.forEach((testId) => {
        cy.findByTestId(testId).should('be.visible')
      })
    })
  })
})
