import 'cypress-wait-until';

describe('ChatApp E2E Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should log in successfully as user1', () => {
    cy.get('input[placeholder="Username"]').type('user1');
    cy.get('input[placeholder="Password"]').type('123');
    cy.contains('Login').click();

    cy.waitUntil(() =>
      cy.window().then((win) => !!win.localStorage.getItem('user')),
      { timeout: 15000, interval: 500 }
    );

    cy.url({ timeout: 15000 }).should('include', '/groups');
    cy.contains('Group 1', { timeout: 15000 }).should('be.visible');
  });

  it('should enter a channel and send a message', () => {
    cy.visit('http://localhost:4200/groups');
    cy.contains('Group 1', { timeout: 10000 }).click();
    cy.wait(1000);
    cy.contains('General', { timeout: 10000 }).click();

    cy.get('input[placeholder="Type message..."]').type('Hello from Cypress!');
    cy.contains('Send').click();

    cy.get('.user-msg', { timeout: 8000 })
      .should('contain.text', 'Hello from Cypress!');
  });

  it('should upload an image as a chat message', () => {
    cy.visit('http://localhost:4200/groups');
    cy.contains('Group 1').click();
    cy.contains('General').click();

    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.png', { force: true });
    cy.contains('Send').click();

    cy.get('.chat-img', { timeout: 10000 }).should('be.visible');
  });

  it('should display user avatar next to messages', () => {
    cy.visit('http://localhost:4200/groups');
    cy.contains('Group 1').click();
    cy.contains('General').click();

    cy.get('.avatar', { timeout: 10000 }).should('be.visible');
  });

  it('should navigate to video chat page', () => {
    cy.visit('http://localhost:4200/groups');
    cy.contains('Group 1').click();
    cy.contains('General').click();

    cy.contains('Video Chat', { timeout: 10000 }).click();

    cy.url({ timeout: 10000 }).should('include', '/video');
    cy.contains('Video Chat').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.visit('http://localhost:4200/groups');
    cy.contains('Logout').click();

    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('user')).to.be.null;
    });
  });
});
