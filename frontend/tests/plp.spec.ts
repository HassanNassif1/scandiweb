import { test, expect } from '@playwright/test';

// test('should navigate to the tech category page and validate its content', async ({ page }) => {
//   // Step 1: Navigate to the homepage
//   console.log('Navigating to the homepage...');
//   await page.goto('http://localhost:3000/');

//   // Step 2: Wait for the "tech" category link to appear
//   console.log('Waiting for the "tech" category link to appear...');
//   const techCategoryLink = page.locator('a[href="/tech"]');
//   await techCategoryLink.waitFor({ state: 'attached', timeout: 20000 }); // Ensure link is attached to DOM

//   // Step 3: Ensure the link is visible and click it
//   console.log('Ensuring the "tech" category link is visible...');
//   await expect(techCategoryLink).toBeVisible({ timeout: 20000 });
//   console.log('Clicking on the "tech" category link...');
//   await techCategoryLink.click();

//   // Step 4: Wait for navigation to the correct page
//   console.log('Waiting for the page to navigate to the "tech" category...');
//   await expect(page).toHaveURL('http://localhost:3000/tech', { timeout: 10000 });

//   // Step 5: Validate the presence of product boxes
//   console.log('Checking for the visibility of product boxes...');
//   const productCards = page.locator('.product-box');
//   await expect(productCards.first()).toBeVisible({ timeout: 10000 });

//   // Step 6: Log the product titles
//   const productCount = await productCards.count();
//   console.log(`Number of products found: ${productCount}`);
//   expect(productCount).toBeGreaterThan(0);

//   console.log('Logging product titles...');
//   for (let i = 0; i < productCount; i++) {
//     const productTitle = await productCards.nth(i).locator('.product-name').textContent();
//     console.log(`Product ${i + 1}: ${productTitle}`);
//   }

//   // Step 7: Validate the category title
//   console.log('Validating the category title...');
//   const categoryTitle = page.locator('h2.category-name');
//   await expect(categoryTitle).toHaveText('tech');
//   console.log('Category title validated successfully.');

//   console.log('Test completed successfully.');
// });
test('check PlayStation 5 product', async ({ page }) => {
  // Navigate to the page where the PlayStation 5 product is listed
  await page.goto('http://localhost:3000/tech');

  // Locate the product by its data-testid
  const playstationProduct = page.locator('[data-testid="product-playstation-5"]');
  await expect(page.getByText("PlayStation 5")).toBeVisible({ timeout: 10000 });
  console.log('PlayStation 5 is visible.');

  // Ensure the product is visible
  await expect(playstationProduct).toBeVisible({ timeout: 10000 });

  // Optionally click on the product
  await playstationProduct.click();

  // Additional checks, such as validating the price or other details
  const priceLocator = page.locator('text=844.02');
  await expect(priceLocator).toBeVisible({ timeout: 10000 });
});
