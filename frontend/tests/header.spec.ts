import { test, expect } from '@playwright/test';

test('should show active category link when clicked and show only clothes products', async ({ page }) => {
  // Navigate to the initial page
  await page.goto('http://localhost:3000/clothes');

  // Test for cart overlay functionality first
  const cartButton = page.locator('[data-testid="cart-btn"]');
  await expect(cartButton).toBeVisible({ timeout: 10000 });

  // Click the cart button to trigger the overlay
  await cartButton.click();
  const cartOverlay = page.locator('[data-testid="cart-overlay"]');
  await expect(cartOverlay).toBeVisible({ timeout: 30000 });
  const isCartOverlayVisible = await cartOverlay.isVisible();
  console.log('Is cart overlay visible?', isCartOverlayVisible);
  // Get the category link for "/clothes" using a unique test ID
  const categoryLink = page.locator('[data-testid="active-category-link"]');  // Ensure this test ID is unique

  // Log the current page HTML before category click
  const pageHTMLBefore = await page.content();
  console.log('Page HTML before click:', pageHTMLBefore);

  // Click the category link (e.g., for "clothes")
  await categoryLink.click();

  // Wait for the page to load and for the active category to appear (wait for URL change)
  await page.waitForURL('**/clothes*'); // Ensure the URL changes to reflect the "clothes" category

  await page.waitForSelector('nav .category[data-testid="active-category-link"]');
  await expect(
    page.locator('nav .category[data-testid="active-category-link"]'),
  ).toBeVisible();
  // Log the current URL to check if the active category link is applied
  const currentUrl = page.url();
  console.log('Current URL after category click:', currentUrl);

  // Wait for the active category link to be in the DOM (ensure it's present)
  const activeCategoryLink = page.locator('[data-testid="active-category-link"]');
  await activeCategoryLink.click();
  
  // Wait for the active category link to be visible
  try {
    await activeCategoryLink.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Active category link is visible');

    // If the active category link is visible, take a screenshot
    const screenshotPath = `C:\\Users\\DELL\\Desktop\\active-category-link-visible-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot taken at: ${screenshotPath}`);
  } catch (error) {
    console.log('Active category link not found or not visible within timeout.');
    const pageHTMLAfter = await page.content();
    console.log('Page HTML after click:', pageHTMLAfter);
    throw error; // Re-throw the error after logging
  }

  // Log the class of the active category link to verify it has the 'active' class
  const className = await activeCategoryLink.getAttribute('class');
  console.log('Active category link class:', className); // Should contain 'active'

  // Wait for the product filtering to complete (just in case any asynchronous updates are happening)
  await page.waitForSelector('.product-box:visible', { timeout: 10000 }); // Wait for at least one product to be visible

  // Check that only "clothes" products are visible
  const clothesProducts = page.locator('.product-box a[href*="categoryName=clothes"]');
  
  // Debug the number of clothes products
  const clothesCount = await clothesProducts.count();
  console.log('Number of clothes products:', clothesCount); // This will log how many "Clothes" products are found

  // Expecting 2 clothes products (based on your HTML example)
  await expect(clothesProducts).toHaveCount(2); // Update expectation to 2 as per your data

  // Ensure that non-clothes products are NOT visible
  const nonClothesProducts = page.locator('.product-box a[href*="categoryName"]:not(:visible)');

  // Debugging: log non-clothes products count
  const nonClothesCount = await nonClothesProducts.count();
  console.log('Number of non-clothes products (should be 0):', nonClothesCount);

  // There should be no non-clothes products visible when "Clothes" category is active
  await expect(nonClothesProducts).toHaveCount(0); // No non-clothes products should be visible

  console.log('Test passed!');
});
