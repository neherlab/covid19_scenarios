/// <reference types="cypress" />

import scenarios from '../../src/assets/data/scenarios/scenarios.json'

const scenariosKeys = Object.keys(scenarios)
// testing all the scenarios would be extremely long
const firstTenScenarios = scenariosKeys.slice(0, 10)

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

    it(`should have ${scenariosKeys.length} options`, () => {
      cy.get('@ScenarioDropdown')
        .find('[class$="-menu"]')
        .find('[class$="-option"]')
        .should('have.length', scenariosKeys.length)
    })

    it('should close when clicking on it a second time', () => {
      cy.get('@ScenarioDropdown').click().find('[class$="-menu"]').should('not.exist')
    })
  })

  for (const scenarioKey of firstTenScenarios) {
    const { epidemiological, population } = scenarios[scenarioKey]

    describe(`Switching to "${scenarioKey}"`, () => {
      it(`should change the text on selector to "${scenarioKey}" correctly`, () => {
        cy.get('@ScenarioDropdown').click().findByText(scenarioKey).click()

        cy.wait(100) // updating the selectbox can take some time

        cy.get('@ScenarioDropdown').find('[class$="singleValue"]').should('have.text', scenarioKey)
      })

      it('should change the values for the "Population" card', () => {
        for (const key in population) {
          cy.get('@PopulationCard').find(`[name="population.${key}"]`).should('have.value', String(population[key]))
        }
      })

      it('should change the values for the "Epidemiology" card', () => {
        for (const key in epidemiological) {
          cy.get('@EpidemiologyCard')
            .find(`[name="epidemiological.${key}"]`)
            .should('have.value', String(epidemiological[key]))
        }
      })
    })
  }
})
