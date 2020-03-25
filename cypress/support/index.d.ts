/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    closeDisclaimer: () => void;
  }
}
