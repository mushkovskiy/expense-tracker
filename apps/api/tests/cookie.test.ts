process.env.MONGO_URI ??= 'mongodb://localhost:27017/test';
process.env.JWT_SECRET ??= 'test-secret';

import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_COOKIE_NAME, clearAuthCookie, setAuthCookie } from '../src/utils/cookie';

function createMockResponse(): Response {
  return {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;
}

describe('auth cookie utils', () => {
  it('sets the auth cookie with a maxAge derived from the token exp claim', () => {
    const res = createMockResponse();
    const token = jwt.sign({ sub: 'user-1' }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    setAuthCookie(res, token);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    const [name, value, options] = (res.cookie as jest.Mock).mock.calls[0];
    expect(name).toBe(AUTH_COOKIE_NAME);
    expect(value).toBe(token);
    expect(options).toMatchObject({ httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
    expect(options.maxAge).toBeGreaterThan(0);
    expect(options.maxAge).toBeLessThanOrEqual(60 * 60 * 1000);
  });

  it('falls back to a 24h maxAge when the token has no exp claim', () => {
    const res = createMockResponse();
    const token = jwt.sign({ sub: 'user-1' }, process.env.JWT_SECRET as string);

    setAuthCookie(res, token);

    const [, , options] = (res.cookie as jest.Mock).mock.calls[0];
    expect(options.maxAge).toBe(24 * 60 * 60 * 1000);
  });

  it('clears the auth cookie', () => {
    const res = createMockResponse();

    clearAuthCookie(res);

    expect(res.clearCookie).toHaveBeenCalledWith(AUTH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });
  });
});
