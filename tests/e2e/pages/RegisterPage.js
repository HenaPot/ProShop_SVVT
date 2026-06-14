// @ts-check
import { BasePage } from './BasePage.js';

export class RegisterPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Register' });
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email Address');
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm Password');
    this.submitButton = page.getByRole('button', { name: 'Register' });
  }

  async open() {
    await this.goto('/register');
  }

  async register(name, email, password) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }
}
