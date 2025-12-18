# Unit Testing Plan for Education.ts

## File Analysis

**File:** `backend/src/domain/models/Education.ts`

**Class Structure:**
- **Properties:**
  - `id?: number` - Optional education record ID
  - `institution: string` - Required institution name
  - `title: string` - Required education title/degree
  - `startDate: Date` - Required start date
  - `endDate?: Date` - Optional end date
  - `candidateId?: number` - Optional candidate ID reference

- **Methods:**
  - `constructor(data: any)` - Initializes Education instance from data
  - `async save()` - Creates or updates education record in database

**Dependencies:**
- `@prisma/client` - PrismaClient for database operations

---

## Testing Strategy

### 1. **Constructor Tests**

#### Test Cases:
- ✅ **Should create Education instance with all properties**
  - Test with complete data object (id, institution, title, startDate, endDate, candidateId)
  - Verify all properties are correctly assigned
  - Verify Date objects are properly converted

- ✅ **Should create Education instance with minimal required properties**
  - Test with only required fields (institution, title, startDate)
  - Verify optional properties are undefined when not provided
  - Verify Date conversion works correctly

- ✅ **Should handle string dates and convert to Date objects**
  - Test with string dates in constructor
  - Verify startDate is converted to Date object
  - Verify endDate is converted to Date object when provided
  - Verify endDate is undefined when not provided

- ✅ **Should handle Date objects directly**
  - Test with Date objects passed directly
  - Verify Date objects are preserved correctly

- ✅ **Should handle null/undefined endDate**
  - Test with null endDate
  - Test with undefined endDate
  - Verify endDate remains undefined

---

### 2. **Save Method Tests - Create Scenario**

#### Test Cases:
- ✅ **Should create new education record when id is not provided**
  - Mock PrismaClient
  - Create Education instance without id
  - Call save()
  - Verify prisma.education.create is called with correct data
  - Verify returned data matches expected structure

- ✅ **Should include candidateId when provided**
  - Create Education with candidateId
  - Call save()
  - Verify candidateId is included in create data

- ✅ **Should exclude candidateId when not provided**
  - Create Education without candidateId
  - Call save()
  - Verify candidateId is not included in create data

- ✅ **Should handle endDate when provided**
  - Create Education with endDate
  - Call save()
  - Verify endDate is included in create data

- ✅ **Should handle missing endDate**
  - Create Education without endDate
  - Call save()
  - Verify endDate is included as undefined/null in create data

---

### 3. **Save Method Tests - Update Scenario**

#### Test Cases:
- ✅ **Should update existing education record when id is provided**
  - Mock PrismaClient
  - Create Education instance with id
  - Call save()
  - Verify prisma.education.update is called with correct id and data
  - Verify returned data matches expected structure

- ✅ **Should use correct where clause for update**
  - Create Education with id = 5
  - Call save()
  - Verify update is called with `where: { id: 5 }`

- ✅ **Should include candidateId in update when provided**
  - Create Education with id and candidateId
  - Call save()
  - Verify candidateId is included in update data

- ✅ **Should exclude candidateId in update when not provided**
  - Create Education with id but no candidateId
  - Call save()
  - Verify candidateId is not included in update data

---

### 4. **Error Handling Tests**

#### Test Cases:
- ✅ **Should handle Prisma create errors**
  - Mock PrismaClient to throw error on create
  - Call save() without id
  - Verify error is propagated correctly

- ✅ **Should handle Prisma update errors**
  - Mock PrismaClient to throw error on update
  - Call save() with id
  - Verify error is propagated correctly

- ✅ **Should handle database connection errors**
  - Mock PrismaClient to throw connection error
  - Call save()
  - Verify error handling

- ✅ **Should handle invalid data errors**
  - Create Education with invalid data
  - Call save()
  - Verify appropriate error handling

---

### 5. **Edge Cases**

#### Test Cases:
- ✅ **Should handle empty string values**
  - Test with empty institution string
  - Test with empty title string
  - Verify behavior

- ✅ **Should handle very long strings**
  - Test with very long institution name
  - Test with very long title
  - Verify data is handled correctly

- ✅ **Should handle date edge cases**
  - Test with startDate equal to endDate
  - Test with endDate before startDate (invalid but should be handled)
  - Test with dates far in the past/future

- ✅ **Should handle special characters in strings**
  - Test with special characters in institution
  - Test with special characters in title
  - Verify data is preserved correctly

---

## Test File Structure

### File: `backend/src/domain/models/Education.test.ts`

```typescript
import { Education } from './Education';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    education: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('Education', () => {
  let prisma: PrismaClient;
  let mockEducation: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockEducation = {
      institution: 'Test University',
      title: 'Bachelor of Science',
      startDate: '2020-01-01',
      endDate: '2024-01-01',
    };
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    // Constructor tests here
  });

  describe('save() - Create', () => {
    // Create scenario tests here
  });

  describe('save() - Update', () => {
    // Update scenario tests here
  });

  describe('Error Handling', () => {
    // Error handling tests here
  });

  describe('Edge Cases', () => {
    // Edge case tests here
  });
});
```

---

## Implementation Checklist

### Phase 1: Setup & Basic Tests
- [ ] Create test file `Education.test.ts`
- [ ] Set up PrismaClient mock
- [ ] Implement constructor tests
- [ ] Implement basic save() create test
- [ ] Implement basic save() update test

### Phase 2: Comprehensive Tests
- [ ] Add all constructor test cases
- [ ] Add all save() create test cases
- [ ] Add all save() update test cases
- [ ] Add error handling tests
- [ ] Add edge case tests

### Phase 3: Refinement
- [ ] Review test coverage (aim for >90%)
- [ ] Add descriptive test names
- [ ] Add test documentation/comments
- [ ] Verify tests follow project patterns
- [ ] Run tests and fix any issues

---

## Testing Best Practices to Follow

1. **Isolation**: Each test should be independent
2. **Mocking**: Mock PrismaClient to avoid database dependencies
3. **Clear Test Names**: Use descriptive test names that explain what is being tested
4. **Arrange-Act-Assert**: Follow AAA pattern in tests
5. **Coverage**: Aim for high code coverage (>90%)
6. **Error Scenarios**: Test both success and error paths
7. **Edge Cases**: Test boundary conditions and edge cases

---

## Expected Test Coverage

- **Constructor**: 100% coverage
  - All property assignments
  - Date conversions
  - Optional field handling

- **save() method**: 100% coverage
  - Create path (when id is undefined)
  - Update path (when id is defined)
  - candidateId inclusion/exclusion
  - endDate handling
  - Error scenarios

---

## Notes

- The Education class is similar to WorkExperience class, so tests can follow similar patterns
- Consider creating shared test utilities if patterns repeat across model tests
- Date handling is critical - ensure proper conversion and handling
- Prisma mocking is essential to avoid database dependencies in unit tests

---

## Related Files to Review

- `backend/src/domain/models/WorkExperience.ts` - Similar structure, can reference for patterns
- `backend/src/application/services/candidateService.test.ts` - Example of Prisma mocking pattern
- `backend/src/presentation/controllers/candidateController.test.ts` - Example of controller testing

