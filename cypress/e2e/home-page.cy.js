describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows the welcome message', () => {
    cy.get('app-root').should('contain.text', 'Hello Docker world!');
  });
});
