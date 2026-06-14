import { describe, it, expect, beforeAll, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import generateToken from '../../utils/generateToken.js';

/**
 * Unit test for generateToken() in isolation.
 * The Express response is replaced with a spy (test double), so no real
 * server or cookie machinery is involved — we verify the JWT is signed with
 * the configured secret and stored as a hardened HTTP-only cookie.
 */
describe('generateToken', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'development';
  });

  it('sets a verifiable JWT in a secure http-only cookie', () => {
    const res = { cookie: vi.fn() };
    const userId = '64a000000000000000000001';

    generateToken(res, userId);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    const [name, token, options] = res.cookie.mock.calls[0];

    expect(name).toBe('jwt');
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe('strict');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe(userId);
  });
});
