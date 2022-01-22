// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("login", (email, password) => {
  const username = 'admin';
  const password = 'adminpai';

  cy.visit('/');

  cy.get('input[type=username]')
    .type(username)
    .should('have.value', username);

  cy.get('input[type=password]')
    .type(`${password}{enter}`);

  cy.wait(1000)
})

