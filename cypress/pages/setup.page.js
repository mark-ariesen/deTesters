export const setup = {
  // Element getters
  visit() {
    return cy.visit('/play');
  },

  name() {
    return cy.get('[data-testid="character-card"] input[name="name"]'); //Suggest to dev to improve with data-testid attribute
  },

  startButton() {
    return cy.get('[data-testid="character-card"] form button').eq(1); //Suggest to dev to improve with data-testid attribute
  },

  // Utilities
  getAllCharacterOptions() {
    return cy.get('select[aria-hidden="true"] option').then(($options) => {
      return [...$options].map((opt) => ({
        value: opt.value,
        label: opt.textContent.trim(),
      }));
    });
  },

  selectRandomCharacter() {
    return cy.get('select[aria-hidden="true"] option').then(($options) => {
      const options = [...$options]
        .map((o) => ({
          value: o.value,
          label: (o.textContent || '').trim(),
        }))

      if (!options.length) {
        throw new Error('No character options found in hidden select');
      }

      const choice = Cypress._.sample(options);

      return cy
        .get('[role="combobox"]').click()
        .then(() => cy.contains('[role="option"]', choice.label).click())
        .then(() => {
          cy.log(`🧙 Character selected: ${choice.label} (${choice.value})`);
          return cy.wrap(choice, { log: false });
        });
    });
  },
};