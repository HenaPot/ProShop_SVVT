// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { ProductPage } from '../pages/ProductPage.js';
import { CartPage } from '../pages/CartPage.js';

test.describe('Product detail & cart', () => {
  test('open a product, add to cart, then remove it @smoke', async ({ page }) => {
    const home = new HomePage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    await home.open();
    await home.openFirstProduct();

    await expect(product.title).toBeVisible();
    await expect(product.addToCartButton).toBeVisible();
    const name = (await product.title.textContent())?.trim();

    await product.addToCart();

    // Adding navigates to the cart.
    await expect(cart.heading).toBeVisible();
    await expect(cart.subtotal).toBeVisible();
    await expect(page.getByRole('link', { name })).toBeVisible();

    // Remove the item and confirm the cart empties.
    await cart.removeButtons.first().click();
    await expect(cart.emptyMessage).toBeVisible();
  });
});
