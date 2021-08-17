describe('The Home Screen:', () => {
  it('Successfully loads', () => {
    cy.visit('/');
  }),

  it('Council dropdown is populated', () => {
    cy.visit('/');
    cy.contains('Select an item').should('not.exist')
  }),

  it('Overview field is populated', () => {
    cy.visit('/');
    cy.contains('you can meet')
  }),

  it('Open / closed fields are populated', () => {
    cy.visit('/');
    cy.contains('close contact services')
  }),

  it('Use my location button updates the selected council', () => {
    cy.visit('/');

    // select Fife from the dropdown list
    cy.contains('Glasgow City').click();
    cy.contains('Fife').click()

    // click on the button to update our location
    cy.contains('Use My Location').click()

    // check for the default council used during testing
    cy.contains('Glasgow City')
  })
});