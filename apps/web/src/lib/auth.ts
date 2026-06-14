import { cookies } from 'next/headers';

const ACCESS_TOKEN_COOKIE = 'accessToken';

// TODO: validate the token (e.g. by calling the API /auth/me) instead of just checking presence
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(ACCESS_TOKEN_COOKIE);
}
