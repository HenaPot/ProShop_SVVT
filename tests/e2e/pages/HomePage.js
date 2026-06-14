// @ts-check
import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Latest Products' });
    // Each product card links to /product/:id (image + title both link).
    this.productLinks = page.locator('a[href^="/product/"]');
  }

  async open() {
    await this.goto('/');
  }

  async openFirstProduct() {
    await this.productLinks.first().click();
  }
}
