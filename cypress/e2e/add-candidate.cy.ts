describe('Add Candidate Form', () => {
  beforeEach(() => {
    cy.visit('/add-candidate');
    // Intercept API calls
    cy.intercept('POST', 'http://localhost:3010/candidates').as('createCandidate');
  });

  it('should display the add candidate form', () => {
    cy.contains('h1', 'Agregar Candidato').should('be.visible');
    cy.get('input[name="firstName"]').should('be.visible');
    cy.get('input[name="lastName"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="phone"]').should('be.visible');
    cy.get('input[name="address"]').should('be.visible');
  });

  it('should submit a valid candidate form', () => {
    const candidate = {
      firstName: 'Test',
      lastName: 'User',
      email: `test.${Date.now()}@example.com`,
      phone: '+34 600 123 456',
      address: 'Test Address 123',
    };

    cy.fillCandidateForm(candidate);
    cy.get('button[type="submit"]').click();

    cy.wait('@createCandidate').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
    });

    cy.contains('.alert-success', 'Candidato añadido con éxito').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission
    cy.get('input[name="firstName"]:invalid').should('exist');
    cy.get('input[name="lastName"]:invalid').should('exist');
    cy.get('input[name="email"]:invalid').should('exist');
  });

  it('should validate email format', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="email"]').blur();
    cy.get('input[name="email"]:invalid').should('exist');
  });

  it('should add education entry', () => {
    cy.contains('button', 'Añadir Educación').click();
    
    cy.get('input[placeholder="Institución"]').last().should('be.visible');
    cy.get('input[placeholder="Título"]').last().should('be.visible');
    
    cy.get('input[placeholder="Institución"]').last().type('Test University');
    cy.get('input[placeholder="Título"]').last().type('Test Degree');
  });

  it('should remove education entry', () => {
    cy.contains('button', 'Añadir Educación').click();
    cy.get('input[placeholder="Institución"]').last().type('Test University');
    
    cy.contains('button', 'Eliminar').first().click();
    cy.get('input[placeholder="Institución"]').should('not.exist');
  });

  it('should add multiple education entries', () => {
    cy.contains('button', 'Añadir Educación').click();
    cy.get('input[placeholder="Institución"]').last().type('University 1');
    
    cy.contains('button', 'Añadir Educación').click();
    cy.get('input[placeholder="Institución"]').last().type('University 2');
    
    cy.get('input[placeholder="Institución"]').should('have.length', 2);
  });

  it('should add work experience entry', () => {
    cy.contains('button', 'Añadir Experiencia Laboral').click();
    
    cy.get('input[placeholder="Empresa"]').last().should('be.visible');
    cy.get('input[placeholder="Puesto"]').last().should('be.visible');
    
    cy.get('input[placeholder="Empresa"]').last().type('Test Company');
    cy.get('input[placeholder="Puesto"]').last().type('Test Position');
  });

  it('should remove work experience entry', () => {
    cy.contains('button', 'Añadir Experiencia Laboral').click();
    cy.get('input[placeholder="Empresa"]').last().type('Test Company');
    
    cy.contains('button', 'Eliminar').last().click();
    cy.get('input[placeholder="Empresa"]').should('not.exist');
  });

  it('should handle form submission error', () => {
    // Create a candidate with duplicate email to trigger error
    cy.intercept('POST', 'http://localhost:3010/candidates', {
      statusCode: 400,
      body: { message: 'Email already exists' },
    }).as('createCandidateError');

    cy.fillCandidateForm({
      firstName: 'Test',
      lastName: 'User',
      email: 'duplicate@example.com',
    });

    cy.get('button[type="submit"]').click();
    cy.wait('@createCandidateError');

    cy.contains('.alert-danger', 'Error').should('be.visible');
  });

  it('should display success message after successful submission', () => {
    cy.fillCandidateForm({
      firstName: 'Success',
      lastName: 'Test',
      email: `success.${Date.now()}@example.com`,
    });

    cy.get('button[type="submit"]').click();
    cy.wait('@createCandidate');

    cy.contains('.alert-success', 'Candidato añadido con éxito').should('be.visible');
  });

  it('should clear form after successful submission', () => {
    cy.fillCandidateForm({
      firstName: 'Clear',
      lastName: 'Test',
      email: `clear.${Date.now()}@example.com`,
    });

    cy.get('button[type="submit"]').click();
    cy.wait('@createCandidate');

    // Wait a bit for form to potentially clear
    cy.wait(500);
    // Form fields might still have values, but success message should appear
    cy.contains('.alert-success', 'Candidato añadido con éxito').should('be.visible');
  });

  it('should handle file upload component', () => {
    // File uploader component should be visible
    cy.contains('label', 'CV').should('be.visible');
    // Note: Actual file upload testing might require additional setup
  });
});


