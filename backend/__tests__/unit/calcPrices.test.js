import { describe, it, expect } from 'vitest';
import { calcPrices } from '../../utils/calcPrices.js';

/**
 * Unit tests for calcPrices() — the order pricing logic.
 *
 * Test design techniques applied:
 *  - Equivalence Partitioning: empty cart / below-threshold / above-threshold.
 *  - Boundary Value Analysis on the free-shipping threshold (itemsPrice == 100):
 *      99.99 (below), 100.00 (on boundary), 100.01 (just above).
 *  - Decision table for the shipping rule:
 *      itemsPrice <= 100  -> shipping = 10
 *      itemsPrice  > 100  -> shipping = 0   (strictly greater)
 *  Tax is a flat 15% of itemsPrice; total = items + shipping + tax.
 */
describe('calcPrices', () => {
  it('empty cart: items 0, flat shipping applies, no tax', () => {
    const r = calcPrices([]);
    expect(r.itemsPrice).toBe('0.00');
    expect(r.shippingPrice).toBe('10.00');
    expect(r.taxPrice).toBe('0.00');
    expect(r.totalPrice).toBe('10.00');
  });

  it('below threshold (50.00): charges $10 shipping + 15% tax', () => {
    const r = calcPrices([{ price: 50, qty: 1 }]);
    expect(r.itemsPrice).toBe('50.00');
    expect(r.shippingPrice).toBe('10.00');
    expect(r.taxPrice).toBe('7.50');
    expect(r.totalPrice).toBe('67.50');
  });

  it('BVA — exactly 100.00 is NOT free shipping (rule is strictly > 100)', () => {
    const r = calcPrices([{ price: 100, qty: 1 }]);
    expect(r.itemsPrice).toBe('100.00');
    expect(r.shippingPrice).toBe('10.00');
    expect(r.taxPrice).toBe('15.00');
    expect(r.totalPrice).toBe('125.00');
  });

  it('BVA — 100.01 (just above) qualifies for free shipping', () => {
    const r = calcPrices([{ price: 100.01, qty: 1 }]);
    expect(r.shippingPrice).toBe('0.00');
  });

  it('above threshold (150.00): free shipping + 15% tax', () => {
    const r = calcPrices([{ price: 50, qty: 3 }]);
    expect(r.itemsPrice).toBe('150.00');
    expect(r.shippingPrice).toBe('0.00');
    expect(r.taxPrice).toBe('22.50');
    expect(r.totalPrice).toBe('172.50');
  });

  it('aggregates multiple line items by price * qty', () => {
    const r = calcPrices([
      { price: 25, qty: 2 },
      { price: 10, qty: 1 },
    ]);
    expect(r.itemsPrice).toBe('60.00');
    expect(r.shippingPrice).toBe('10.00');
    expect(r.taxPrice).toBe('9.00');
    expect(r.totalPrice).toBe('79.00');
  });

  it('always returns 2-decimal fixed strings', () => {
    const r = calcPrices([{ price: 19.999, qty: 1 }]);
    for (const v of Object.values(r)) {
      expect(v).toMatch(/^\d+\.\d{2}$/);
    }
  });
});
