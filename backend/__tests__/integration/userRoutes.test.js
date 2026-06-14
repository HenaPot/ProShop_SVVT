import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import {
  connectTestDB,
  clearTestDB,
  disconnectTestDB,
} from '../helpers/db.js';
import app from '../../app.js';

/**
 * Integration tests for the user/auth API: registration, login, the
 * authentication guard, and a regression test for BUG-001 (see docs/bugs).
 */
describe('User routes (integration)', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'development';
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  const register = (agent, over = {}) =>
    agent.post('/api/users').send({
      name: 'Jane Tester',
      email: 'jane@test.com',
      password: 'secret123',
      ...over,
    });

  it('POST /api/users registers a new user and sets a jwt cookie', async () => {
    const res = await register(request(app));
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('jane@test.com');
    expect(res.body).not.toHaveProperty('password');
    expect(res.headers['set-cookie'].join(';')).toMatch(/jwt=/);
  });

  it('rejects duplicate registration with 400', async () => {
    await register(request(app));
    const res = await register(request(app));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('POST /api/users/auth logs in with correct credentials', async () => {
    await register(request(app));
    const res = await request(app)
      .post('/api/users/auth')
      .send({ email: 'jane@test.com', password: 'secret123' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Jane Tester');
  });

  it('rejects login with a wrong password (401)', async () => {
    await register(request(app));
    const res = await request(app)
      .post('/api/users/auth')
      .send({ email: 'jane@test.com', password: 'WRONG' });
    expect(res.status).toBe(401);
  });

  it('GET /api/users/profile without a token is blocked (401)', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  // --- Regression test for BUG-001 ---------------------------------------
  // Updating profile name/email must NOT corrupt the stored password.
  // Before the fix, the pre-save hook re-hashed the already-hashed password
  // on every save, so login broke after any profile update.
  it('BUG-001 regression: password still works after a profile update', async () => {
    const agent = request.agent(app);
    await register(agent);

    const upd = await agent
      .put('/api/users/profile')
      .send({ name: 'Jane Renamed' });
    expect(upd.status).toBe(200);
    expect(upd.body.name).toBe('Jane Renamed');

    // Password was never changed, so the original one must still log in.
    const login = await request(app)
      .post('/api/users/auth')
      .send({ email: 'jane@test.com', password: 'secret123' });
    expect(login.status).toBe(200);
  });
});
