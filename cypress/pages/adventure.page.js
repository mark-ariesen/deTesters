export const adventure = {
  // Simple attributes useful for on page
  progressIncrement: 20,

  // Element getters
  clicker() {
    return cy.get('[data-testid="adventure-clicker"] button'); 
  },

  uploadFile(){
    return cy.get('[data-testid="adventure-uploader"] input.flex'); //Suggest to dev to improve with data-testid attribute (.flex seems very brittle)
  },

  slider() {
    return cy.get('[data-testid="adventure-slider"] [role="slider"]');
  },

  typer() {
    return cy.get('[data-testid="adventure-typer"] input'); //Suggest to dev to improve with data-testid attribute
  },

  playAgainButton() {
    return cy.get('[data-testid="adventure-container"] [data-play-again="true"]'); 
  },


  // Utilities
  clickNTimes(n) {
    const clickOnce = (remaining) => {
      if (remaining <= 0) return cy.wrap(null);
      return this.clicker().click().then(() => clickOnce(remaining - 1));
    };
    return clickOnce(n);
  },

  // Reads current progress as an integer 0..100
  returnCurrentProgress() {
    const root =
      '[data-testid="character-card"] [data-character-stats="Level"] [role="progressbar"]';

    return cy.get(root)
      // find the moving bar element that actually has the inline translateX style
      .find('[style*="translateX"]')
      .first()
      .then(($el) => {
        const style = $el.attr('style') || '';

        const match = style.match(/translateX\((-?\d+(?:\.\d+)?)%\)/);
        if (!match) {
          throw new Error(`Could not parse progress from style attribute: "${style}"`);
        }

        const translateX = Number(match[1]);   // e.g. -80
        const progress = 100 - Math.abs(translateX); // -> 20
        return Math.round(progress);
      });
  },

  moveSliderIncrementallyRight() {
    return this.slider().focus().type('{rightarrow}')
  },

  moveSliderIncrementallyLeft() {
    return this.slider().focus().type('{leftarrow}')
  },

  
  moveSliderToEnd() {
    return this.slider().focus().type('{end}')
  },


  levelUpBy(method) {
    switch (method) {
      case 'clicks':
        return this.clickNTimes(5);

      case 'upload':
        return this.uploadFile().selectFile('cypress/fixtures/example.json');

      case 'slider':
        return this.moveSliderToEnd();

      case 'typing':
        return this.typer().type('Lorem Ipsum');

      default:
        throw new Error(`Unknown levelUpBy method: "${method}"`);
    }
  },
};
