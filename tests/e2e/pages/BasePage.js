// @ts-check
import { expect } from '@playwright/test';

/**
 * BasePage holds the site header/navigation shared by every page (brand,
 * search box, cart and sign-in links). All other page objects extend it.
 */
export class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.brand = page.getByRole('link', { name: /ProShop/ }).first();
    this.searchInput = page.getByPlaceholder('Search Products...');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.cartLink = page.getByRole('link', { name: /Cart/ });
    this.signInLink = page.getByRole('link', { name: /Sign In/ });
    // On small (mobile) viewports the nav collapses behind this toggle.
    this.navToggle = page.getByRole('button', { name: /toggle navigation/i });
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  /** Expand the collapsed navbar on mobile so header controls are reachable. */
  async openMobileMenuIfPresent() {
    if (await this.navToggle.isVisible().catch(() => false)) {
      await this.navToggle.click();
    }
  }

  async search(term) {
    await this.openMobileMenuIfPresent();
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async expectHeaderVisible() {
    // The brand is shown at every breakpoint; cart/search may be collapsed.
    await expect(this.brand).toBeVisible();
  }
}
