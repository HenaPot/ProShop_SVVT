import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import {
  connectTestDB,
  clearTestDB,
  disconnectTestDB,
} from '../helpers/db.js';
import app from '../../app.js';
import Product from '../../models/productModel.js';
import User from '../../models/userModel.js';

/**
 * Integration tests for the product API.
 * They exercise the real Express app (routes -> middleware -> controllers ->
 * Mongoose models) against an in-memory MongoDB, verifying the components
 * work together end to end over HTTP.
 */
describe('Product routes (integration)', () => {
  let admin;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'development';
    process.env.PAGINATION_LIMIT = '12';
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    admin = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: '123456',
      isAdmin: true,
    });
    await Product.create({
      user: admin._id,
      name: 'The Pragmatic Programmer',
      image: '/images/sample.jpg',
      brand: 'Addison-Wesley',
      category: 'Books',
      description: 'A classic on software craftsmanship.',
      price: 39.99,
      countInStock: 5,
      rating: 4.8,
      numReviews: 12,
    });
  });

  it('GET /api/products returns a paginated product list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body.products).toHaveLength(1);
    expect(res.body.products[0].name).toBe('The Pragmatic Programmer');
  });

  it('GET /api/products?keyword filters by name (case-insensitive)', async () => {
    const hit = await request(app).get('/api/products?keyword=pragmatic');
    expect(hit.body.products).toHaveLength(1);

    const miss = await request(app).get('/api/products?keyword=nonsense');
    expect(miss.body.products).toHaveLength(0);
  });

  it('BUG-001 regression: search with regex metacharacters is handled safely', async () => {
    // A keyword containing regex special characters (e.g. "(") must not crash
    // the endpoint. Before the fix the raw keyword was passed straight into a
    // MongoDB $regex, so an invalid pattern threw and returned HTTP 500.
    const res = await request(app).get('/api/products?keyword=%28'); // "("
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('GET /api/products/:id returns a single product', async () => {
    const list = await request(app).get('/api/products');
    const id = list.body.products[0]._id;

    const res = await request(app).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(id);
  });

  it('GET /api/products/:id with an invalid ObjectId returns 404', async () => {
    const res = await request(app).get('/api/products/not-a-real-id');
    expect(res.status).toBe(404);
  });

  it('GET /api/products/:id for a missing-but-valid id returns 404', async () => {
    const res = await request(app).get('/api/products/64a000000000000000000099');
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it('POST /api/products is rejected for unauthenticated users (401)', async () => {
    const res = await request(app).post('/api/products');
    expect(res.status).toBe(401);
  });
});
