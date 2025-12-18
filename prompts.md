# Prompts Collection

This file contains all prompts and instructions used throughout the project for AI-assisted development and feature creation.

---

## Create New Route Prompt

**Source:** `backend/src/prompts/CreateNewRoute.md`

```
Basándote en las buenas prácticas del manifesto @ManifestoBuenasPracticas.md , dame las instrucciones detalladas para crear un nuevo endpoint GET /position/:id/candidates

Sé específico en los archivos donde va cada código. 
Dame la respuesta en espanol.

Contexto del proyecto:
@backend
```

**Translation:**
```
Based on the best practices from the manifesto @ManifestoBuenasPracticas.md, give me detailed instructions to create a new endpoint GET /position/:id/candidates

Be specific about which files each code goes in.
Give me the answer in Spanish.

Project context:
@backend
```

---

## Cypress Expert Mode Prompt

**Source:** User request during Cypress setup

```
mode cypress.io expert
```

**Context:** Request to set up a comprehensive Cypress E2E testing framework with best practices, custom commands, test suites, and CI/CD integration.

---

## General Development Guidelines

When creating new features or endpoints, follow these guidelines:

1. **Architecture Pattern**: Follow the layered architecture pattern:
   - `domain/`: Domain models and business logic
   - `application/`: Application services
   - `presentation/`: Controllers
   - `routes/`: Route definitions
   - `infrastructure/`: Database access (if needed)

2. **Best Practices**: Refer to `backend/ManifestoBuenasPracticas.md` for coding standards and best practices.

3. **API Specification**: Follow the OpenAPI specification in `backend/api-spec.yaml`.

4. **Testing**: 
   - Write unit tests for services and controllers
   - Write E2E tests using Cypress for user flows
   - Write API integration tests for endpoints

5. **Documentation**: Update relevant documentation files when adding new features.

---

## Prompt Template for New Features

When requesting a new feature, use this template:

```
Basándote en las buenas prácticas del manifesto @ManifestoBuenasPracticas.md, 
dame las instrucciones detalladas para crear [DESCRIBE FEATURE]

Sé específico en los archivos donde va cada código.
Dame la respuesta en español.

Contexto del proyecto:
@backend
@frontend (si aplica)
```

---

---

## Candidate Domain Model Test Analysis

**Date:** Analysis performed during test review session

### Current Test Coverage

#### Existing Tests

1. **Service Layer Test** (`backend/src/application/services/candidateService.test.ts`)
   - Tests: `updateCandidateStage` function
   - Coverage: Only tests the service layer function, not the domain model itself
   - Test count: 1 test

2. **Controller Layer Test** (`backend/src/presentation/controllers/candidateController.test.ts`)
   - Tests: `updateCandidateStageController` function
   - Coverage: Only tests the controller layer, not the domain model itself
   - Test count: 1 test

### Missing Test Coverage

**No direct unit tests exist for the `Candidate` domain model class** (`backend/src/domain/models/Candidate.ts`)

The `Candidate` class has the following methods that need testing:

1. **Constructor**
   - Should initialize all properties correctly
   - Should handle optional properties (phone, address)
   - Should initialize nested arrays (educations, workExperiences, resumes, applications)
   - Should handle empty or undefined nested arrays

2. **`save()` Method**
   - Should create new candidate when `id` is not provided
   - Should update existing candidate when `id` is provided
   - Should handle nested relations (educations, workExperiences, resumes, applications)
   - Should only include defined fields in candidateData
   - Should handle Prisma errors (P2025, connection errors)
   - Should create nested relations when provided

3. **`findOne()` Static Method**
   - Should find candidate by ID
   - Should return null when candidate not found
   - Should include all nested relations (educations, workExperiences, resumes, applications)
   - Should handle database errors

### Recommended Test Structure

Similar to `Education.test.ts`, create `Candidate.test.ts` with:

```typescript
describe('Candidate', () => {
  describe('Constructor', () => {
    // Test property initialization
    // Test optional properties
    // Test nested arrays initialization
  });

  describe('save() - Create Scenario', () => {
    // Test creating new candidate
    // Test with nested relations
    // Test without nested relations
  });

  describe('save() - Update Scenario', () => {
    // Test updating existing candidate
    // Test partial updates
    // Test error handling
  });

  describe('findOne() Static Method', () => {
    // Test finding existing candidate
    // Test finding non-existent candidate
    // Test with nested relations
  });

  describe('Error Handling', () => {
    // Test Prisma errors
    // Test database connection errors
    // Test validation errors
  });
});
```

### Test Files Reference

**Service Layer Test:**
```typescript
// backend/src/application/services/candidateService.test.ts
import { updateCandidateStage } from './candidateService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    application: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('updateCandidateStage', () => {
  it('should update the candidate stage and return the updated application', async () => {
    const mockApplication = {
      id: 1,
      positionId: 1,
      candidateId: 1,
      currentInterviewStep: 1,
      applicationDate: new Date(),
      notes: null,
    };

    jest.spyOn(prisma.application, 'findFirst').mockResolvedValue(mockApplication);
    jest.spyOn(prisma.application, 'update').mockResolvedValue({
      ...mockApplication,
      currentInterviewStep: 2,
    });

    const result = await updateCandidateStage(1, 1, 2);
    expect(result).toEqual(expect.objectContaining({
      ...mockApplication,
      currentInterviewStep: 2,
    }));
  });
});
```

**Controller Layer Test:**
```typescript
// backend/src/presentation/controllers/candidateController.test.ts
import { updateCandidateStageController } from './candidateController';
import { Request, Response } from 'express';
import { updateCandidateStage } from '../../application/services/candidateService';

jest.mock('../../application/services/candidateService');

describe('updateCandidateStageController', () => {
    it('should return 200 and updated candidate stage', async () => {
      const req = { params: { id: '1' }, body: { applicationId: 1, currentInterviewStep: 2 } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      (updateCandidateStage as jest.Mock).mockResolvedValue({
        id: 1,
        applicationId: 1,
        candidateId: 1,
        currentInterviewStep: 2,
      });
  
      await updateCandidateStageController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Candidate stage updated successfully',
        data: {
          id: 1,
          applicationId: 1,
          candidateId: 1,
          currentInterviewStep: 2,
        },
      });
    });
  });
```

### Action Items

- [ ] Create `Candidate.test.ts` in `backend/src/domain/models/`
- [ ] Write constructor tests
- [ ] Write `save()` method tests (create and update scenarios)
- [ ] Write `findOne()` static method tests
- [ ] Write error handling tests
- [ ] Test nested relations handling
- [ ] Aim for >90% code coverage

---

## Notes

- All prompts should reference the project's best practices manifesto
- Be specific about file locations and code placement
- Include context about the project structure
- Consider both backend and frontend when applicable
- Always include testing requirements
- Domain model classes should have comprehensive unit tests similar to `Education.test.ts`

