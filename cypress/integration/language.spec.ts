/// <reference types="cypress" />

import langs from '../../src/langs'

const availableLangs = Object.entries(langs)
const languageMap: { [key: string]: string } = {
  en: 'Results',
  fr: 'Resultats',
  pt: 'Resultados',
  de: 'Ergebnisse',
  es: 'Resultados',
  pl: 'Wyniki',
}

context('Language switcher', () => {
  before(() => {
    cy.visit(Cypress.env('BASE_URL'))
    cy.closeLanding()
    cy.closeDisclaimer()
  })

  describe('The switcher', () => {
    it('should be present', () => {
      cy.findByTestId('LanguageSwitcher').should('be.visible')
    })

    it('should open when clicking on it', () => {
      cy.findByTestId('LanguageSwitcher')
        .should('not.have.class', 'show')
        .get('.dropdown-toggle')
        .click()
        .parent()
        .should('have.class', 'show')
        .get('.dropdown-menu')
        .first()
        .click()

      cy.findByTestId('LanguageSwitcher').should('not.have.class', 'show')
    })

    it(`should have ${availableLangs.length} languages`, () => {
      cy.findByTestId('LanguageSwitcher').get('[role="menu"] button').should('have.length', availableLangs.length)
    })
  })

  availableLangs.forEach(([key, value]: [string, { lang: string; name: string }]) => {
    describe(`Switching to "${value.name}"`, () => {
      it(`should change the language to "${value.lang}" correctly`, () => {
        cy.findByTestId('LanguageSwitcher')
          .get('.dropdown-toggle')
          .click()
          .parent()
          .get('.dropdown-menu')
          .findByText(value.name)
          .click()

        cy.findByTestId('LanguageSwitcher').get('.dropdown-toggle').should('have.text', value.name)

        cy.findByTestId('ResultsCardTitle').should('have.text', languageMap[key])
      })
    })
  })
})
