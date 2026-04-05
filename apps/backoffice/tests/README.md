# E2E Tests

This directory contains end-to-end tests for the backoffice application using Playwright.

## Prerequisites

Before running E2E tests, ensure:

1. **Backoffice is running**: The backoffice must be running on `http://localhost:3001`
   ```bash
   cd apps/backoffice
   pnpm dev
   ```

2. **Database is set up**: Ensure the database is migrated and has seed data

3. **MinIO/S3 is running**: Image upload requires object storage to be running

4. **Valid test credentials**: Tests use default credentials (`admin@example.com` / `password`). Update these in test files if needed.

## Installation

Install Playwright browsers (first time only):
```bash
cd apps/backoffice
pnpm exec playwright install
```

## Running Tests

### Run all E2E tests
```bash
pnpm test:e2e
```

### Run tests in UI mode (recommended for development)
```bash
pnpm test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
pnpm test:e2e:headed
```

### Run specific test file
```bash
pnpm exec playwright test image-upload.spec.ts
```

### Debug tests
```bash
pnpm test:e2e:debug
```

## Test Structure

```
tests/
├── e2e/                    # E2E test files
│   └── image-upload.spec.ts
├── fixtures/               # Test fixtures (images, documents)
│   ├── test-image.jpg
│   ├── test-image-1.jpg
│   ├── test-image-2.jpg
│   ├── test-image-3.jpg
│   └── test-document.pdf
└── README.md
```

## Current Tests

### Image Upload Tests (`image-upload.spec.ts`)

- **Single image upload**: Tests uploading a single image to a news item
- **Multiple image upload**: Tests uploading multiple images to a tourism item
- **File validation**: Tests that invalid file types (PDF) are rejected
- **Image removal**: Tests removing an uploaded image

## Writing New Tests

1. Create a new test file in `tests/e2e/`
2. Import Playwright test utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   ```

3. Use `test.describe` to group related tests:
   ```typescript
   test.describe('Feature Name', () => {
     test.beforeEach(async ({ page }) => {
       // Setup before each test
     });

     test('should do something', async ({ page }) => {
       // Test implementation
     });
   });
   ```

4. Run tests to verify they work

## Troubleshooting

### Tests fail with "Connection refused"
- Ensure the backoffice is running on port 3001
- Check that the dev server is not in an error state

### Tests fail with "Authentication failed"
- Verify test credentials are correct
- Check that a test user exists in the database
- Update credentials in the test file if needed

### Tests fail with "Upload failed"
- Ensure MinIO/S3 is running
- Check that the upload API is accessible
- Verify file permissions for fixtures

### Browser not found
- Install Playwright browsers: `pnpm exec playwright install`

## CI/CD Integration

Tests can be run in CI/CD pipelines:

```yaml
- name: Install Playwright browsers
  run: pnpm exec playwright install --with-deps

- name: Run E2E tests
  run: pnpm test:e2e
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library](https://testing-library.com)
