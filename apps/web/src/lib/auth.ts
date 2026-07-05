import type { ApiResponse, AuthResponse, IUser } from '@repo/types';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api';

async function fetchMe(): Promise<Response | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) return null;

  try {
    return await fetch(`${API_URL}/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const res = await fetchMe();
  return res?.ok ?? false;
}

export async function getCurrentUser(): Promise<IUser | null> {
  const res = await fetchMe();
  if (!res?.ok) return null;

  try {
    const json = (await res.json()) as ApiResponse<AuthResponse>;
    return json.success ? json.data.user : null;
  } catch {
    return null;
  }
}
