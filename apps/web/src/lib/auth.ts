import { cookies } from 'next/headers';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) return false;

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { cookie: cookieHeader },
    });
    return res.ok;
  } catch {
    return false;
  }
}
