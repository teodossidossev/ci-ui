context('Home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })


  it('Should have welcome message', () => {
    cy.get('app-root').should('have.text', 'Hello Docker world!\n')
  })
})
