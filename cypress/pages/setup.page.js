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
    return cy.get('[data-testid="character-card"] form button[role="combobox"]')
      .click()
      .should('have.attr', 'aria-expanded', 'true')
      .then(() => {
        return cy.get('select[aria-hidden="true"] option')
          .should('have.length.greaterThan', 1)
          .then(($options) => {
            return [...$options].map((opt) => ({
              value: opt.value,
              label: (opt.textContent || '').trim(),
            }));
          });
      });
  },

  selectRandomCharacter() {
    const combo = '[data-testid="character-card"] form button[role="combobox"]';
    const hiddenSelect = 'select[aria-hidden="true"]';

    return cy.get(combo)
      .click()
      .should('have.attr', 'aria-expanded', 'true')
      .then(() => {
        // After opening, the hidden select should now be populated
        return cy.get(hiddenSelect)
          .find('option')
          .should(($opts) => {
            expect($opts.length, 'character option count after opening combobox').to.be.greaterThan(1);
          })
          .then(($opts) => {
            const options = $opts.toArray()
              .map((opt) => ({
                value: opt.value,
                label: (opt.label || opt.textContent || '').trim(),
              }))
              // filter out placeholders like "" / "Select..."
              .filter((o) => o.value && o.label);

            if (!options.length) {
              throw new Error('No selectable character options found (only placeholders?)');
            }

            const choice = Cypress._.sample(options);
            cy.log(`🧙 Character chosen: ${choice.label} (${choice.value})`);

            // Click the visible dropdown option by label (Radix often renders in a portal)
            // Prefer listbox if present; otherwise fall back to global contains.
            return cy.get('body').then(($body) => {
              const hasListbox = $body.find('[role="listbox"]').length > 0;

              const clickChoice = hasListbox
                ? cy.get('[role="listbox"]').should('be.visible').contains(choice.label).click()
                : cy.contains(choice.label).click();

              return clickChoice
                .then(() => cy.get(hiddenSelect).should('have.value', choice.value))
                .then(() => cy.wrap(choice, { log: false }));
            });
          });
      });
  },
};