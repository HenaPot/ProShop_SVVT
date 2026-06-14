// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test.describe('Home page', () => {
  test('loads with header and a product list @smoke', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    await home.expectHeaderVisible();
    await expect(home.heading).toBeVisible();
    expect(await home.productLinks.count()).toBeGreaterThan(0);
  });
});
