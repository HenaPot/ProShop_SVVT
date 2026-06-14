// Test data for the ProShop E2E suite.
// Seeded accounts come from backend/data/users.js (public sample credentials).
export const SEEDED_USER = { email: 'john@email.com', password: '123456' };
export const SEEDED_USER_NAME = 'John Doe';

// 'Airpods Wireless Bluetooth Headphones' is in the seed catalog.
export const SEARCH_KEYWORD = 'Airpods';

// Build a unique email so register tests never collide.
export const uniqueEmail = () => `e2e_${Date.now()}@test.com`;
