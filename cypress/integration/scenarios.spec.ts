/// <reference types="cypress" />

import scenarios from '../../src/assets/data/scenarios/scenarios.json'

const scenariosKeys = Object.keys(scenarios);
// testing all the scenarios would be extremely long
const firstTenScenarios = scenariosKeys.slice(0, 10);

context('Language switcher', () => {
  before(() => {
    cy.visit(Cypress.env('BASE_URL'))
    cy.closeDisclaimer()
  })

  beforeEach(() => {
    cy.get('#scenarioName').as('ScenarioDropdown')
  })

  describe('The scenario selector', () => {
    it('should be present', () => {
      cy.get('@ScenarioDropdown')
        .should('be.visible')
    })

    it('should open when clicking on it', () => {
      cy.get('@ScenarioDropdown')
        .click()
        .find('[class$="-menu"]')
        .should('exist')
    })

    it(`should have ${scenariosKeys.length} options`, () => {
      cy.get('@ScenarioDropdown')
        .find('[class$="-menu"]')
        .find('[class$="-option"]')
        .should('have.length', scenariosKeys.length)
    })

    it('should close when clicking on it a second time', () => {
      cy.get('@ScenarioDropdown')
        .click()
        .find('[class$="-menu"]')
        .should('not.exist')
    })
  })

  for (const scenarioKey of firstTenScenarios) {
    describe(`Switching to "${scenarioKey}"`, () => {
      it(`should change the text on selector to "${scenarioKey}" correctly`, () => {
        cy.get('@ScenarioDropdown')
          .click()
          .find('[class$="-menu"]')
          .findByText(scenarioKey)
          .click()

        cy.get('@ScenarioDropdown')
          .find('[class$="singleValue"]')
          .should('have.text', scenarioKey)
      })
    })
  }
})
