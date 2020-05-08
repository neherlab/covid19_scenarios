/// <reference types="cypress" />

import { getScenario, scenarioNames } from '../../src/components/Main/state/getScenario'

// testing all the scenarios would be extremely long
const someScenarios = ['Switzerland', 'Germany', 'France', 'Australia']

context('Scenario selector', () => {
  before(() => {
    cy.visit(Cypress.env('BASE_URL'))
    cy.closeDisclaimer()
  })

  beforeEach(() => {
    cy.get('#scenarioName').as('ScenarioDropdown')
    cy.get('.card--population').as('PopulationCard')
    cy.get('.card--epidemiology').as('EpidemiologyCard')
  })

  describe('The scenario selector', () => {
    it('should be present', () => {
      cy.get('@ScenarioDropdown').should('be.visible')
    })

    it('should open when clicking on it', () => {
      cy.get('@ScenarioDropdown').click().find('[class$="-menu"]').should('exist')
    })

    it(`should have ${scenarioNames.length} options`, () => {
      cy.get('@ScenarioDropdown')
        .find('[class$="-menu"]')
        .find('[class$="-option"]')
        .should('have.length', scenarioNames.length)
    })

    it('should close when clicking on it a second time', () => {
      cy.get('@ScenarioDropdown').click().find('[class$="-menu"]').should('not.exist')
    })
  })

  someScenarios.forEach((scenarioKey) => {
    const { epidemiological, population } = getScenario(scenarioKey)

    describe(`Switching to "${scenarioKey}"`, () => {
      it(`should change the text on selector to "${scenarioKey}" correctly`, () => {
        cy.get('@ScenarioDropdown').click().findByText(scenarioKey).click()

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100) // updating the selectbox can take some time

        cy.get('@ScenarioDropdown').find('[class$="singleValue"]').should('have.text', scenarioKey)
      })

      it('should change the values for the "Population" card', () => {
        Object.entries(population).forEach(([key, value]) => {
          cy.get('@PopulationCard').find(`[name="population.${key}"]`).should('have.value', value.toString())
        })
      })

      it('should change the values for the "Epidemiology" card', () => {
        Object.entries(epidemiological).forEach(([key, value]) => {
          cy.get('@EpidemiologyCard').find(`[name="epidemiological.${key}"]`).should('have.value', value.toString())
        })
      })
    })
  })
})
