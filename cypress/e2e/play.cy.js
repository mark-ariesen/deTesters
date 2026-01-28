import { setup } from '../pages/setup.page'
import { adventure } from '../pages/adventure.page'

// TODO: could be useful as a command in command.js
const randomName = (min = 3, max = 20) => {
  const len = Cypress._.random(min, max);
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  return Cypress._.times(len, () => Cypress._.sample(chars)).join('');
};

// TODO: could be useful as a command in command.js
const expectProgressIncreaseAfter = (action, actionLabel) => {
  adventure.returnCurrentProgress().then((startValue) => {
    cy.then(action).then(() => {
      adventure.returnCurrentProgress().then((actual) => {
        const expected = startValue + adventure.progressIncrement;

        expect(
          actual,
          `After ${actionLabel}, expecting progress ${expected}`
        ).to.eq(expected);
      });
    });
  });
};

describe('Play Game', () => {
  beforeEach(() => {
    setup.visit()
    setup.name().type(randomName());  
    setup.selectRandomCharacter().then(({ value, label }) => {
    cy.log(`Character selected: ${label}`);
    cy.get('select[aria-hidden="true"]').should('have.value', value);
  });
    setup.startButton().click()
  })

  it('progress increases after 5 clicks', { tags: ['SILVER'] }, () => {
    const clicksToLevel = 5;

    expectProgressIncreaseAfter(
      () => {
        const clickOnce = (remaining) => {
          if (remaining === 0) return;
          adventure.clicker().click().then(() => clickOnce(remaining - 1));
        };

        clickOnce(clicksToLevel);
      },
      `${clicksToLevel} clicks`
    );
  });

  it('progress increases after uploading a file', { tags: ['SILVER'] }, () => {
    expectProgressIncreaseAfter(
      () => {
        adventure.uploadFile().selectFile('cypress/fixtures/example.json');
      },
      'file upload'
    );
  });

  it('progress increases after slider is moved', { tags: ['SILVER'] }, () => {
    expectProgressIncreaseAfter(
      () => {
        adventure.moveSliderToEnd();
      },
      'moving slider to end'
    );
  });

  it('progress increases after typing the word "Lorem Ipsum"', { tags: ['SILVER'] }, () => {
    expectProgressIncreaseAfter(
      () => {
        adventure.typer().type('Lorem Ipsum');
      },
      'typing "Lorem Ipsum"'
    );
  });

  it('levels up after reaching 100% progress & replay available', { tags: ['GOLD'] }, () => {
    const levelMethods = ['clicks', 'upload', 'slider', 'typing'];

    adventure.returnCurrentProgress().then((startValue) => {
      const randomMethods = Cypress._.shuffle([...levelMethods]);
      cy.log(`Order: ${randomMethods.join(', ')}`);

      const runNext = (expectedProgress) => {
        const method = randomMethods.shift();
        if (!method) return cy.wrap(null);

        return adventure.levelUpBy(method).then(() => {
          const nextExpected = expectedProgress + adventure.progressIncrement;

          return adventure.returnCurrentProgress().then((actual) => {
            expect(
              actual,
              `After completing method "${method}", expecting progress ${nextExpected}`
            ).to.eq(nextExpected);

            return runNext(nextExpected);
          });
        });
      };

      return runNext(startValue);
    }).then(() => {
      adventure.playAgainButton().should('be.visible').click();
      setup.name().should('be.visible');
    });
  });
});