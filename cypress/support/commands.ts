/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login (if authentication is needed)
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to create a candidate via API
       * @example cy.createCandidate({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' })
       */
      createCandidate(candidateData: any): Chainable<any>;

      /**
       * Custom command to delete a candidate via API
       * @example cy.deleteCandidate(1)
       */
      deleteCandidate(candidateId: number): Chainable<void>;

      /**
       * Custom command to wait for API response
       * @example cy.waitForApi('POST', '/candidates')
       */
      waitForApi(method: string, url: string, alias?: string): Chainable<void>;

      /**
       * Custom command to fill candidate form
       * @example cy.fillCandidateForm({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' })
       */
      fillCandidateForm(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        address?: string;
      }): Chainable<void>;

      /**
       * Custom command to add education entry
       * @example cy.addEducation({ institution: 'University', title: 'Degree', startDate: '2020-01-01', endDate: '2024-01-01' })
       */
      addEducation(education: {
        institution: string;
        title: string;
        startDate: string;
        endDate: string;
      }): Chainable<void>;

      /**
       * Custom command to add work experience entry
       * @example cy.addWorkExperience({ company: 'Company', position: 'Developer', description: 'Worked on...', startDate: '2020-01-01', endDate: '2024-01-01' })
       */
      addWorkExperience(experience: {
        company: string;
        position: string;
        description: string;
        startDate: string;
        endDate: string;
      }): Chainable<void>;

      /**
       * Custom command to navigate to a route
       * @example cy.navigateTo('/add-candidate')
       */
      navigateTo(path: string): Chainable<void>;
    }
  }
}

// Login command (placeholder for future authentication)
Cypress.Commands.add('login', (email: string, password: string) => {
  // Implement login logic when authentication is added
  cy.log(`Logging in as ${email}`);
});

// Create candidate via API
Cypress.Commands.add('createCandidate', (candidateData: any) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/candidates`,
    body: candidateData,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
});

// Delete candidate via API
Cypress.Commands.add('deleteCandidate', (candidateId: number) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/candidates/${candidateId}`,
    failOnStatusCode: false,
  });
});

// Wait for API response
Cypress.Commands.add('waitForApi', (method: string, url: string, alias?: string) => {
  const apiAlias = alias || `api${method}${url.replace(/\//g, '')}`;
  cy.intercept(method, `${Cypress.env('apiUrl')}${url}`).as(apiAlias);
  return cy.wait(`@${apiAlias}`);
});

// Fill candidate form
Cypress.Commands.add('fillCandidateForm', (data) => {
  if (data.firstName) {
    cy.get('input[name="firstName"]').clear().type(data.firstName);
  }
  if (data.lastName) {
    cy.get('input[name="lastName"]').clear().type(data.lastName);
  }
  if (data.email) {
    cy.get('input[name="email"]').clear().type(data.email);
  }
  if (data.phone) {
    cy.get('input[name="phone"]').clear().type(data.phone);
  }
  if (data.address) {
    cy.get('input[name="address"]').clear().type(data.address);
  }
});

// Add education entry
Cypress.Commands.add('addEducation', (education) => {
  cy.contains('button', 'Añadir Educación').click();
  
  // Wait for the form to appear
  cy.get('input[placeholder="Institución"]').last().type(education.institution);
  cy.get('input[placeholder="Título"]').last().type(education.title);
  
  // Handle date pickers - using type since DatePicker might be tricky
  cy.get('input[placeholder="Fecha de Inicio"]').last().clear().type(education.startDate);
  cy.get('input[placeholder="Fecha de Fin"]').last().clear().type(education.endDate);
});

// Add work experience entry
Cypress.Commands.add('addWorkExperience', (experience) => {
  cy.contains('button', 'Añadir Experiencia Laboral').click();
  
  // Wait for the form to appear
  cy.get('input[placeholder="Empresa"]').last().type(experience.company);
  cy.get('input[placeholder="Puesto"]').last().type(experience.position);
  
  // Handle date pickers
  cy.get('input[placeholder="Fecha de Inicio"]').last().clear().type(experience.startDate);
  cy.get('input[placeholder="Fecha de Fin"]').last().clear().type(experience.endDate);
});

// Navigate to route
Cypress.Commands.add('navigateTo', (path: string) => {
  cy.visit(path);
  cy.url().should('include', path);
});

export {};


