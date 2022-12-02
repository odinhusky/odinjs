describe('The Home Page', function() {
  beforeEach(function() {
    cy.login();
  });

  // it('successfully loads', function() {
  //   cy.visit('/'); // change URL to match your dev URL
  // });

  it('login', function() {
  
    // we should be redirected to /dashboard
    cy.url()
      .should('include', '/entry');

    // our auth cookie should be present
    cy.getCookie('user')
      .should('have.property', 'value', 'admin');

    cy.getCookie('admin')
      .should('have.property', 'value', 'true');

    cy.getCookie('token')
      .should('exist');
  });
});
