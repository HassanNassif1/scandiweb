import { test, expect } from '@playwright/test';

test('Product details page should display color attribute', async ({ page }) => {
  // Navigate to the product detail page
  await page.goto('http://localhost:3000/product/6?categoryName=tech'); // Update with your product page URL

  // Wait for the product name to be visible to ensure the page has loaded
  await expect(page.locator('[data-testid="product-name"]')).toBeVisible();

  // Log the entire page content for debugging (useful for inspecting data-testid values)
  const pageContent = await page.content();
  console.log(pageContent);

  // Wait for the color attribute to be available (handling both #44FF03 and Green)
  const colorLocator = page.locator('[data-testid="product-attribute-color-#44ff03"]')
    .or(page.locator('[data-testid="product-attribute-color-Green"]'));
  
  // Ensure the color attribute is visible
  await expect(colorLocator).toBeVisible({ timeout: 10000 });
});

test('Product details page should display capacity attribute', async ({ page }) => {
  // Navigate to the product detail page
  await page.goto('http://localhost:3000/product/6?categoryName=tech'); // Update with your product page URL

  // Wait for the product name to be visible to ensure the page has loaded
  await expect(page.locator('[data-testid="product-name"]')).toBeVisible();

  // Log the entire page content for debugging (useful for inspecting data-testid values)
  const pageContent = await page.content();
  console.log(pageContent);

  // Inspect the pageContent log to see the correct data-testid for the capacity attribute
  // Update the selector accordingly after checking the log
  const capacityLocator = page.locator('[data-testid="product-attribute-capacity-512G"]'); // Ensure this matches exactly

  // Ensure the capacity attribute is visible
  await expect(capacityLocator).toBeVisible({ timeout: 10000 });
});
