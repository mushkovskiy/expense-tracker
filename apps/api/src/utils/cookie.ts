import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const AUTH_COOKIE_NAME = 'accessToken';

export function setAuthCookie(res: Response, token: string): void {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  const maxAge = decoded?.exp ? decoded.exp * 1000 - Date.now() : 24 * 60 * 60 * 1000;

  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
  });
}
