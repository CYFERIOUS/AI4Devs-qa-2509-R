/**
 * Utility functions for Cypress tests
 */

/**
 * Generate a unique email address for testing
 */
export const generateUniqueEmail = (prefix: string = 'test'): string => {
  return `${prefix}.${Date.now()}.${Math.random().toString(36).substring(7)}@example.com`;
};

/**
 * Generate a unique phone number for testing
 */
export const generateUniquePhone = (): string => {
  const random = Math.floor(Math.random() * 1000000000);
  return `+34 6${random.toString().padStart(8, '0')}`;
};

/**
 * Wait for element to be visible and stable
 */
export const waitForStable = (selector: string, timeout: number = 5000): Cypress.Chainable => {
  return cy.get(selector, { timeout }).should('be.visible');
};

/**
 * Clear and type into an input field
 */
export const clearAndType = (selector: string, text: string): Cypress.Chainable => {
  return cy.get(selector).clear().type(text);
};

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get date N days from today
 */
export const getDateDaysFromToday = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Wait for API call to complete
 */
export const waitForApiCall = (method: string, url: string, alias?: string): void => {
  const apiAlias = alias || `api${method}${url.replace(/\//g, '')}`;
  cy.intercept(method, `${Cypress.env('apiUrl')}${url}`).as(apiAlias);
  cy.wait(`@${apiAlias}`);
};

/**
 * Check if element exists without failing
 */
export const elementExists = (selector: string): Cypress.Chainable<boolean> => {
  return cy.get('body').then(($body) => {
    return $body.find(selector).length > 0;
  });
};

/**
 * Scroll element into view
 */
export const scrollIntoView = (selector: string): Cypress.Chainable => {
  return cy.get(selector).scrollIntoView();
};


