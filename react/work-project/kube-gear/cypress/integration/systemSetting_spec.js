describe('System Setting', function() {
  beforeEach(function() {
    cy.login();
  });

  it('system setting test', () => {
    cy.visit('/system-setting');
    cy.wait(1000);
    
    cy.get('input[name=defaultJobLifeHour]')
    .clear()
    .type('999')
    
    cy.get('button[type=submit]').click()
    cy.wait(500)
    cy.get('.Toastify__toast-container').should('be.visible').click();
    cy.wait(500)

    cy.get('input[name=defaultJobLifeHour]')
    .clear()
    .type('-1')
    
    cy.get('button[type=submit]').click()
    cy.get('.Toastify__toast-container').should('be.visible').click();
    cy.wait(500)
    
  })
});
