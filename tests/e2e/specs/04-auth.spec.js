// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { SEEDED_USER, SEEDED_USER_NAME, uniqueEmail } from '../data.js';

test.describe('Authentication', () => {
  test('a new user can register @smoke', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.open();
    await expect(register.heading).toBeVisible();

    await register.register('E2E User', uniqueEmail(), 'secret123');

    // On success the app authenticates and returns home; the sign-in link is
    // replaced by the user menu (#username), shown at every breakpoint though
    // collapsed behind the hamburger on mobile.
    await expect(register.signInLink).toHaveCount(0);
    await expect(page.locator('#username')).toHaveText('E2E User');
  });

  test('a seeded user can log in @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await expect(login.heading).toBeVisible();

    await login.login(SEEDED_USER.email, SEEDED_USER.password);

    await expect(login.signInLink).toHaveCount(0);
    await expect(page.locator('#username')).toHaveText(SEEDED_USER_NAME);
  });

  test('login with a wrong password is rejected', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();

    await login.login(SEEDED_USER.email, 'WRONG-PASSWORD');

    // Stays on the login page; an error toast appears.
    await expect(login.heading).toBeVisible();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });
});
