// @ts-check
import { BasePage } from './BasePage.js';

export class ProductPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.title = page.locator('h3').first();
    this.addToCartButton = page.getByRole('button', { name: 'Add To Cart' });
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}
