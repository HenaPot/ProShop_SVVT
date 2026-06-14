// @ts-check
import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Shopping Cart' });
    this.subtotal = page.getByRole('heading', { name: /Subtotal/ });
    this.emptyMessage = page.getByText('Your cart is empty');
    this.checkoutButton = page.getByRole('button', {
      name: 'Proceed To Checkout',
    });
    this.removeButtons = page.getByRole('button').filter({ has: page.locator('svg') });
  }

  async open() {
    await this.goto('/cart');
  }
}
