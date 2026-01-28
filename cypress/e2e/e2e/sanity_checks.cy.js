import { landing } from '../../../../pages/landing.page'
import { setup } from '../../../../pages/setup.page'



describe('Sanity Checks', () => {
  beforeEach(() => {
    landing.visit();
  });

  it('Website Loads', { tags: ['GOLD'] }, () => {
    assert(cy.url().should('eq', 'https://test-rpg.vercel.app/'), 'BaseURL is incorrect: ' + cy.url() + ' expected https://test-rpg.vercel.app/');
  });

  it('Can play', { tags: ['GOLD'] }, () => {
    landing.startGameLink().should('exist').click();
    assert(cy.url().should('include', '/play'), 'URL is incorrect after clicking Play: ' + cy.url() + ' expected to include /play');
  });

  it('Has api links', { tags: ['GOLD'] }, () => {
    landing.apiLink().should('exist').click();
    assert(cy.url().should('include', '/api'), 'URL is incorrect after clicking API: ' + cy.url() + ' expected to include /api');
  });

  it('Expected character options found', { tags: ['BRONZE'] }, () => {
    setup.visit().then(() => {
    setup.getAllCharacterOptions().then((options) => {
      expect(options).to.deep.equal([
        { value: 'thief', label: 'Thief' },
        { value: 'knight', label: 'Knight' },
        { value: 'mage', label: 'Mage' },
        { value: 'brigadier', label: 'Brigadier' },
      ]);
    });
  });
  });
})
