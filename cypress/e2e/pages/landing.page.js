export const landing = {
  visit() {
    return cy.visit('/');
  },

  startGameLink() {
    return cy.get('[data-testid="links"]>[href="/play"]');
  },

  apiLink() {
    return cy.get('[href="/api"]');
  },
};
