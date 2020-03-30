/// <reference types="cypress" />

import languages  from '../../src/langs'

const availableLanguages = Object.keys(languages)
const languageMap: Record<string, string> = {
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
    cy.skipLandingPage()
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

      cy.findByTestId('LanguageSwitcher')
        .should('not.have.class', 'show')
    })

    it(`should have ${availableLanguages.length} languages`, () => {
      cy.findByTestId('LanguageSwitcher')
        .get('[role="menu"] button')
        .should('have.length', availableLanguages.length)
    })
  })

  for (const language of availableLanguages) {
    describe(`Switching to "${languages[language].name}"`, () => {
      it(`should change the language to "${languages[language].lang}" correctly`, () => {
        cy.findByTestId('LanguageSwitcher')
          .get('.dropdown-toggle')
          .click()
          .parent()
          .get('.dropdown-menu')
          .findByText(languages[language].name)
          .click()

        cy.findByTestId('LanguageSwitcher').get('.dropdown-toggle').should('have.text', languages[language].name)

        cy.findByTestId('ResultsCardTitle').should('have.text', languageMap[language])
      })
    })
  }
})
