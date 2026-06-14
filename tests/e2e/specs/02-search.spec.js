// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { SEARCH_KEYWORD } from '../data.js';

test.describe('Search', () => {
  test('filters products by keyword @smoke', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    await home.search(SEARCH_KEYWORD);

    await expect(page).toHaveURL(new RegExp(`/search/${SEARCH_KEYWORD}`));
    await expect(page.getByText(new RegExp(SEARCH_KEYWORD, 'i')).first()).toBeVisible();
  });
});
