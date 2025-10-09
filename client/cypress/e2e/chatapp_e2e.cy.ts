/// <reference types="cypress" />
import 'cypress-wait-until';

describe('ChatApp E2E Tests', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('http://localhost:4200/login', { timeout: 30000 });

    cy.window().then((win) => {
      if (!win.navigator.mediaDevices) {
        Object.defineProperty(win.navigator, 'mediaDevices', { value: {}, configurable: true });
      }
      Object.defineProperty(win.navigator.mediaDevices, 'getUserMedia', {
        configurable: true,
        value: () => Promise.resolve(new MediaStream()),
      });
    });
  });

  it('should log in successfully as user1', () => {
    cy.get('input[placeholder="Enter your username"]', { timeout: 20000 })
      .should('be.visible')
      .type('user1');
    cy.get('input[type="password"]').should('be.visible').type('123');
    cy.contains('Login').click();

    cy.waitUntil(() => cy.window().then((win) => !!win.localStorage.getItem('user')), {
      timeout: 20000,
      interval: 500,
    });

    cy.url({ timeout: 20000 }).should('include', '/groups');
    cy.get('.group-name', { timeout: 20000 }).should('contain.text', 'Group 1');
  });

  it('should enter a channel and send a message', () => {
  
    cy.visit('http://localhost:4200/login');
    cy.get('input[placeholder="Enter your username"]').type('user1');
    cy.get('input[type="password"]').type('123');
    cy.contains('Login').click();

    cy.waitUntil(() => cy.window().then((win) => !!win.localStorage.getItem('user')), {
      timeout: 20000,
      interval: 500,
    });

    cy.visit('http://localhost:4200/groups');
    cy.get('.group-name', { timeout: 20000 })
      .should('contain.text', 'Group 1')
      .click();

    cy.contains('General', { timeout: 20000 }).should('be.visible').click();

    cy.get('input[placeholder="Type message..."]', { timeout: 15000 })
      .should('be.visible')
      .type('Hello from Cypress!');
    cy.contains('Send').click();

    cy.get('.user-msg', { timeout: 15000 }).should('contain.text', 'Hello from Cypress!');
  });

  it('should upload an image as a chat message', () => {
    cy.visit('http://localhost:4200/groups');
    cy.get('.group-name', { timeout: 20000 }).should('contain.text', 'Group 1').click();
    cy.contains('General').should('be.visible').click();

    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.png', { force: true });
    cy.contains('Send').click();

    cy.get('.chat-img', { timeout: 15000 }).should('be.visible');
  });

  it('should display user avatar next to messages', () => {
    cy.visit('http://localhost:4200/groups');
    cy.get('.group-name', { timeout: 20000 }).should('contain.text', 'Group 1').click();
    cy.contains('General').should('be.visible').click();

    cy.get('.avatar', { timeout: 10000 }).should('be.visible');
  });

  it('should navigate to video chat page', () => {
    cy.visit('http://localhost:4200/groups');
    cy.get('.group-name', { timeout: 20000 }).should('contain.text', 'Group 1').click();
    cy.contains('General').should('be.visible').click();

    cy.contains('Video Chat', { timeout: 15000 }).should('be.visible').click();

    cy.url({ timeout: 15000 }).should('include', '/video');
    cy.contains('Video Chat').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.visit('http://localhost:4200/groups');
    cy.contains('Logout', { timeout: 10000 }).should('be.visible').click();

    cy.url({ timeout: 15000 }).should('include', '/login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('user')).to.be.null;
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
