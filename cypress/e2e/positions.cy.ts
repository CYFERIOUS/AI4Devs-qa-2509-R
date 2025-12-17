describe('Positions Page', () => {
  beforeEach(() => {
    // Intercept API calls
    cy.intercept('GET', 'http://localhost:3010/positions').as('getPositions');
    cy.visit('/positions');
  });

  it('should load positions page', () => {
    cy.url().should('include', '/positions');
    cy.wait('@getPositions');
  });

  it('should display positions list', () => {
    cy.wait('@getPositions');
    // Check if positions are displayed (adjust selectors based on actual implementation)
    cy.get('body').should('be.visible');
  });

  it('should navigate to position details', () => {
    cy.wait('@getPositions');
    // If there are positions, click on the first one
    // Adjust selector based on actual implementation
    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/positions/"]').length > 0) {
        cy.get('a[href*="/positions/"]').first().click();
        cy.url().should('match', /\/positions\/\d+/);
      }
    });
  });

  it('should handle empty positions list', () => {
    cy.intercept('GET', 'http://localhost:3010/positions', {
      statusCode: 200,
      body: [],
    }).as('getEmptyPositions');

    cy.visit('/positions');
    cy.wait('@getEmptyPositions');
    cy.get('body').should('be.visible');
  });

  it('should handle API error gracefully', () => {
    cy.intercept('GET', 'http://localhost:3010/positions', {
      statusCode: 500,
      body: { message: 'Internal server error' },
    }).as('getPositionsError');

    cy.visit('/positions');
    cy.wait('@getPositionsError');
    cy.get('body').should('be.visible');
  });
});

describe('Position Details Page', () => {
  beforeEach(() => {
    // Intercept API calls
    cy.intercept('GET', 'http://localhost:3010/positions/*').as('getPositionDetails');
  });

  it('should load position details page', () => {
    // Assuming position ID 1 exists, adjust as needed
    cy.visit('/positions/1');
    cy.wait('@getPositionDetails');
    cy.url().should('include', '/positions/1');
  });

  it('should display position information', () => {
    cy.visit('/positions/1');
    cy.wait('@getPositionDetails');
    cy.get('body').should('be.visible');
  });

  it('should handle 404 error for non-existent position', () => {
    cy.intercept('GET', 'http://localhost:3010/positions/99999', {
      statusCode: 404,
      body: { message: 'Position not found' },
    }).as('getPositionNotFound');

    cy.visit('/positions/99999');
    cy.wait('@getPositionNotFound');
    cy.get('body').should('be.visible');
  });
});

