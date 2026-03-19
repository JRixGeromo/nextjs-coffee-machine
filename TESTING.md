# Testing Guide

## 🧪 Testing Overview

The Next.js Coffee Machine application includes a comprehensive testing suite with multiple testing strategies:

### **Testing Stack**
- **Jest** - Unit and integration testing
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **Prisma Test Client** - Database testing

### **Test Coverage**
- ✅ **Unit Tests** - Business logic and value objects
- ✅ **Integration Tests** - API endpoints
- ✅ **Component Tests** - React components
- ✅ **E2E Tests** - Full user workflows
- ✅ **Type Safety** - TypeScript compilation

---

## 🚀 Quick Testing Commands

```bash
# Install dependencies (includes testing libraries)
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

---

## 📋 Test Categories

### **1. Unit Tests**
Location: `__tests__/`

#### **Recipe Value Object Tests**
```bash
# Test Recipe class functionality
npm test Recipe.test.ts
```

**Coverage:**
- ✅ Constructor validation
- ✅ Business logic (canMake)
- ✅ Data transformation (toJSON/fromJSON)
- ✅ Edge cases and error handling

#### **Service Layer Tests**
```bash
# Test CoffeeMachineService
npm test services/coffee-machine.test.ts
```

**Coverage:**
- ✅ Status retrieval
- ✅ Coffee making logic
- ✅ Resource management
- ✅ Error handling
- ✅ Database interactions (mocked)

### **2. Integration Tests**
Location: `__tests__/api/`

#### **API Endpoint Tests**
```bash
# Test all API routes
npm test api/
```

**Coverage:**
- ✅ GET /api/coffee-machine/status
- ✅ POST /api/coffee-machine/make-*
- ✅ POST /api/coffee-machine/fill-*
- ✅ Error handling
- ✅ Request/response validation

### **3. Component Tests**
Location: `__tests__/components/`

#### **React Component Tests**
```bash
# Test UI components
npm test components/
```

**Coverage:**
- ✅ Component rendering
- ✅ User interactions
- ✅ Props validation
- ✅ State changes
- ✅ Accessibility

### **4. E2E Tests**
Location: `tests/e2e/`

#### **Full Application Tests**
```bash
# Test complete user workflows
npm run test:e2e
```

**Coverage:**
- ✅ Page loading
- ✅ User interactions
- ✅ API integration
- ✅ Error scenarios
- ✅ Responsive design
- ✅ Cross-browser testing

---

## 🧪 Running Tests

### **Development Testing**
```bash
# Start development server
npm run dev

# In another terminal, run tests in watch mode
npm run test:watch
```

### **Before Commit**
```bash
# Run full test suite
npm test

# Check TypeScript compilation
npm run type-check

# Run E2E tests
npm run test:e2e
```

### **CI/CD Testing**
```bash
# Run tests with coverage
npm run test:coverage

# Generate coverage report
open coverage/lcov-report/index.html
```

---

## 📊 Test Results

### **Expected Test Count**
```
Unit Tests:        ~15 tests
Integration Tests: ~7 tests
Component Tests:   ~20 tests
E2E Tests:         ~10 tests
Total:             ~52 tests
```

### **Coverage Targets**
```
Branches:          80%
Functions:         80%
Lines:             80%
Statements:        80%
```

---

## 🔧 Test Configuration

### **Jest Configuration**
- **Config File**: `jest.config.js`
- **Setup File**: `jest.setup.js`
- **Environment**: `jsdom`
- **Coverage**: Enabled with thresholds

### **Playwright Configuration**
- **Config File**: `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit
- **Viewports**: Desktop and mobile
- **Reporter**: HTML

### **Mocking Strategy**
- **Prisma Client**: Mocked for unit tests
- **Next.js Router**: Mocked for component tests
- **API Calls**: Mocked for integration tests
- **Database**: In-memory for E2E tests

---

## 🐛 Debugging Tests

### **Unit Test Debugging**
```bash
# Run specific test with debugger
node --inspect-brk node_modules/.bin/jest --runInBand Recipe.test.ts

# Or use VS Code debugger
# Set breakpoints in test files and run "npm test"
```

### **E2E Test Debugging**
```bash
# Run E2E tests with UI
npm run test:e2e -- --ui

# Run in headed mode
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- tests/e2e/coffee-machine.spec.ts
```

### **Test Database**
```bash
# Use test database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/coffee_machine_test"

# Reset test database
npx prisma migrate reset --force
npx prisma db seed
```

---

## 📝 Writing Tests

### **Unit Test Example**
```typescript
describe('Recipe', () => {
  it('should create valid recipe', () => {
    const recipe = new Recipe('espresso', 'Espresso', 8, 24)
    expect(recipe.name).toBe('Espresso')
    expect(recipe.canMake(100, 50)).toBe(true)
  })
})
```

### **Component Test Example**
```typescript
import { render, screen } from '@testing-library/react'
import { CoffeeButtons } from '../CoffeeButtons'

test('renders coffee buttons', () => {
  render(<CoffeeButtons canMake={{}} loading={false} />)
  expect(screen.getByText('Espresso')).toBeInTheDocument()
})
```

### **E2E Test Example**
```typescript
import { test, expect } from '@playwright/test'

test('should make coffee', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("Espresso")')
  await expect(page.locator('[class*="message-"]')).toBeVisible()
})
```

---

## 🎯 Best Practices

### **Test Structure**
- **Arrange** - Set up test data and mocks
- **Act** - Perform the action being tested
- **Assert** - Verify the expected outcome

### **Mocking Guidelines**
- Mock external dependencies
- Use consistent mock data
- Reset mocks between tests
- Test both success and failure cases

### **Component Testing**
- Test user behavior, not implementation
- Use accessible selectors
- Test component boundaries
- Verify accessibility

### **E2E Testing**
- Test critical user journeys
- Use realistic test data
- Test multiple browsers
- Include responsive design

---

## 🚨 Common Issues

### **Test Environment Issues**
```bash
# Clear Jest cache
npx jest --clearCache

# Reset node_modules
rm -rf node_modules package-lock.json
npm install
```

### **Database Issues**
```bash
# Reset test database
npx prisma migrate reset --force --skip-seed
npx prisma db seed
```

### **E2E Test Issues**
```bash
# Install Playwright browsers
npx playwright install

# Update Playwright
npx playwright install --force
```

### **TypeScript Issues**
```bash
# Regenerate types
npx prisma generate

# Type check
npm run type-check
```

---

## 📈 Continuous Integration

### **GitHub Actions Example**
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```

### **Coverage Reporting**
```bash
# Generate coverage report
npm run test:coverage

# Upload to codecov
codecov
```

---

## 🎉 Testing Success

When all tests pass, you'll see:
```
✅ All unit tests passing
✅ All integration tests passing
✅ All component tests passing
✅ All E2E tests passing
✅ TypeScript compilation successful
✅ Coverage targets met
```

The application is fully tested and ready for production! 🚀
