import { test, expect } from '@playwright/test';

test('Product details page should enable and make cart button visible with "ADD" text when attributes are selected', async ({ page }) => {
  // Navigate to the product detail page
  await page.goto('http://localhost:3000/product/1?categoryName=Clothes');

  // Wait for the product name to be visible to ensure the page has loaded
  await expect(page.locator('[data-testid="product-name"]')).toBeVisible();

  // Select size, color, and capacity (adjust to match your attribute values)
  await page.click('[data-testid="product-attribute-size-40"]'); // Example for selecting size

  // Locate the "Add to Cart" button using its text content
  const addToCartButton = page.locator('button:text("ADD")'); // Select button with text "ADD"

  // Ensure the button is visible and enabled before clicking
  await expect(addToCartButton).toBeVisible({ timeout: 10000 });   // Check if the button is visible
  await expect(addToCartButton).toBeEnabled({ timeout: 10000 });  // Check if the button is enabled

  // Ensure the button contains the correct text
  await expect(addToCartButton).toHaveText('ADD'); // Check if the button has the text "ADD"
  console.log(await addToCartButton.isVisible());
  console.log(await addToCartButton.isEnabled());
  console.log(await addToCartButton.innerText());
  // Click the "ADD" button
  await addToCartButton.click(); // Click the "ADD" button to simulate adding the item to the cart
});
