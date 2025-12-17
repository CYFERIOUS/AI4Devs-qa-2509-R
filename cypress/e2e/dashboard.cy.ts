describe('Recruiter Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the dashboard with LTI logo', () => {
    cy.get('img[alt="LTI Logo"]').should('be.visible');
    cy.contains('h1', 'Dashboard del Reclutador').should('be.visible');
  });

  it('should display navigation cards', () => {
    cy.contains('h5', 'Añadir Candidato').should('be.visible');
    cy.contains('h5', 'Ver Posiciones').should('be.visible');
  });

  it('should navigate to add candidate page', () => {
    cy.contains('a', 'Añadir Nuevo Candidato').click();
    cy.url().should('include', '/add-candidate');
    cy.contains('h1', 'Agregar Candidato').should('be.visible');
  });

  it('should navigate to positions page', () => {
    cy.contains('a', 'Ir a Posiciones').click();
    cy.url().should('include', '/positions');
  });

  it('should have proper button styling', () => {
    cy.contains('button', 'Añadir Nuevo Candidato')
      .should('have.class', 'btn-primary')
      .should('be.visible');
    
    cy.contains('button', 'Ir a Posiciones')
      .should('have.class', 'btn-primary')
      .should('be.visible');
  });

  it('should be responsive', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.get('img[alt="LTI Logo"]').should('be.visible');
    cy.contains('h1', 'Dashboard del Reclutador').should('be.visible');

    // Test tablet viewport
    cy.viewport(768, 1024);
    cy.get('img[alt="LTI Logo"]').should('be.visible');

    // Test desktop viewport
    cy.viewport(1280, 720);
    cy.get('img[alt="LTI Logo"]').should('be.visible');
  });
});

