import { test, expect } from '@playwright/test';

test.describe('Image Upload', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin - adjust credentials as needed
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 5000 });
  });

  test('should upload single image to news', async ({ page }) => {
    await page.goto('http://localhost:3001/manage/news/new');

    // Wait for form to load
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    // Fill required fields first
    await page.fill('input[name="title"]', 'Test News with Image');
    await page.fill('input[name="slug"]', 'test-news-image-' + Date.now());
    await page.fill('textarea[name="excerpt"]', 'Test excerpt for image upload');

    // Select category if available
    const categorySelect = page.locator('[role="combobox"]').first();
    if (await categorySelect.isVisible()) {
      await categorySelect.click();
      await page.waitForTimeout(500);
      const firstOption = page.locator('[role="option"]').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
      }
    }

    // Upload image using the file input
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg');

    // Wait for upload to complete - look for uploaded image preview
    await page.waitForSelector('img[src^="http"], [data-testid="image-uploader-preview"], .image-preview', { timeout: 15000 });

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success - should redirect to news list
    await page.waitForURL(/\/manage\/news/, { timeout: 10000 });
    await expect(page.locator('text=Test News with Image')).toBeVisible({ timeout: 5000 });
  });

  test('should upload multiple images to tourism', async ({ page }) => {
    await page.goto('http://localhost:3001/manage/tourism/new');

    // Wait for form to load
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    // Fill required fields
    await page.fill('input[name="title"]', 'Test Tourism with Images');
    await page.fill('input[name="slug"]', 'test-tourism-images-' + Date.now());
    await page.fill('textarea[name="description"]', 'Test description for multiple image upload');

    // Select category if available
    const categorySelect = page.locator('[role="combobox"]').first();
    if (await categorySelect.isVisible()) {
      await categorySelect.click();
      await page.waitForTimeout(500);
      const firstOption = page.locator('[role="option"]').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
      }
    }

    // Upload multiple files
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([
      'tests/fixtures/test-image-1.jpg',
      'tests/fixtures/test-image-2.jpg',
      'tests/fixtures/test-image-3.jpg',
    ]);

    // Wait for all uploads - look for multiple image previews
    await page.waitForSelector('img[src^="http"], [data-testid="image-uploader-preview"], .image-preview', { timeout: 20000 });

    // Verify images are shown in gallery
    const images = page.locator('img[src^="http"], [data-testid="image-gallery-item"], .image-preview');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success
    await page.waitForURL(/\/manage\/tourism/, { timeout: 10000 });
  });

  test('should show validation error for invalid file type', async ({ page }) => {
    await page.goto('http://localhost:3001/manage/news/new');

    // Wait for form to load
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    // Try to upload invalid file type
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles('tests/fixtures/test-document.pdf');

    // Verify error message - check for toast notification (using sonner)
    await expect(page.locator('text=JPG, PNG, and WEBP, text=Invalid file type, text=Hanya mendukung, [data-testid="toast-error"], .toast-error').first()).toBeVisible({ timeout: 5000 });
  });

  test('should remove uploaded image', async ({ page }) => {
    await page.goto('http://localhost:3001/manage/events/new');

    // Wait for form to load
    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    // Fill required fields
    await page.fill('input[name="title"]', 'Test Event Image Removal');
    await page.fill('input[name="slug"]', 'test-event-removal-' + Date.now());

    // Upload an image
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg');

    // Wait for upload
    await page.waitForSelector('img[src^="http"], [data-testid="image-uploader-preview"], .image-preview', { timeout: 15000 });

    // Remove the image (look for remove/delete button)
    const removeButton = page.locator('[data-testid="remove-image"], button[aria-label*="remove"], button[aria-label*="delete"], .remove-image').first();
    if (await removeButton.isVisible()) {
      await removeButton.click();

      // Verify image is removed
      const images = page.locator('img[src^="http"], [data-testid="image-uploader-preview"]');
      await expect(images).toHaveCount(0, { timeout: 3000 });
    }
  });
});
