# Cypress E2E Testing

This directory contains end-to-end tests for the Talent Tracking System using Cypress.

## Structure

```
cypress/
├── e2e/              # End-to-end test specs
├── fixtures/         # Test data files
├── support/          # Custom commands and utilities
│   ├── commands.ts   # Custom Cypress commands
│   ├── e2e.ts        # E2E support file
│   └── component.ts  # Component testing support
└── screenshots/      # Screenshots on test failures (gitignored)
└── videos/           # Test execution videos (gitignored)
```

## Running Tests

### Open Cypress Test Runner (Interactive Mode)
```bash
npm run cypress:open
```

### Run Tests Headlessly
```bash
npm run cypress:run
```

### Run Tests in Specific Browser
```bash
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge
```

### Run Specific Test File
```bash
npm run cypress:run:spec "cypress/e2e/dashboard.cy.ts"
```

## Test Suites

### Dashboard Tests (`dashboard.cy.ts`)
- Dashboard display and navigation
- Logo and UI elements
- Responsive design

### Add Candidate Tests (`add-candidate.cy.ts`)
- Form validation
- Candidate creation flow
- Education and work experience management
- Error handling

### Positions Tests (`positions.cy.ts`)
- Positions listing
- Position details
- Error handling

### API Integration Tests (`api-integration.cy.ts`)
- Direct API testing
- CRUD operations
- Error scenarios

## Custom Commands

### `cy.fillCandidateForm(data)`
Fills the candidate form with provided data.

```typescript
cy.fillCandidateForm({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+34 600 123 456',
  address: '123 Main St'
});
```

### `cy.createCandidate(candidateData)`
Creates a candidate via API.

```typescript
cy.createCandidate({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
}).then((candidate) => {
  // Use candidate data
});
```

### `cy.deleteCandidate(candidateId)`
Deletes a candidate via API.

```typescript
cy.deleteCandidate(1);
```

### `cy.addEducation(education)`
Adds an education entry to the form.

```typescript
cy.addEducation({
  institution: 'University',
  title: 'Degree',
  startDate: '2020-01-01',
  endDate: '2024-01-01'
});
```

### `cy.addWorkExperience(experience)`
Adds a work experience entry to the form.

```typescript
cy.addWorkExperience({
  company: 'Company',
  position: 'Developer',
  description: 'Worked on...',
  startDate: '2020-01-01',
  endDate: '2024-01-01'
});
```

### `cy.navigateTo(path)`
Navigates to a specific route.

```typescript
cy.navigateTo('/add-candidate');
```

## Fixtures

Test data is stored in `cypress/fixtures/`:

- `candidates.json` - Sample candidate data for testing

## Best Practices

1. **Use fixtures for test data** - Keep test data in fixtures for reusability
2. **Use custom commands** - Create reusable commands for common actions
3. **Clean up after tests** - Use `afterEach` hooks to clean up test data
4. **Use API calls for setup** - Use API calls to set up test data quickly
5. **Wait for API calls** - Always wait for API calls using `cy.wait()` or `cy.intercept()`
6. **Use data-testid attributes** - Prefer data-testid over CSS selectors when possible
7. **Isolate tests** - Each test should be independent and not rely on other tests

## Configuration

Configuration is in `cypress.config.ts`:

- **baseUrl**: `http://localhost:3000` (Frontend)
- **apiUrl**: `http://localhost:3010` (Backend API)
- **viewport**: 1280x720 (default)
- **video**: Enabled for debugging
- **screenshotOnRunFailure**: Enabled

## Prerequisites

Before running tests:

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm start
   ```

3. Ensure the database is running (Docker Compose):
   ```bash
   docker-compose up -d
   ```

## CI/CD Integration

For CI/CD pipelines, use:

```bash
npm run cypress:run
```

This runs tests headlessly and generates reports.

## Troubleshooting

### Tests failing due to timing issues
- Increase `defaultCommandTimeout` in `cypress.config.ts`
- Use `cy.wait()` for API calls
- Use `cy.intercept()` to stub API responses

### Element not found errors
- Check if the element is visible (not hidden by CSS)
- Use `cy.wait()` after navigation
- Check if the element exists before interacting

### API errors
- Ensure backend server is running
- Check API URL in `cypress.config.ts`
- Verify CORS settings in backend

