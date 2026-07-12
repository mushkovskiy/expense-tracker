import { type NextRequest, NextResponse } from 'next/server';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const PROTECTED_PATHS = ['/dashboard', '/expenses', '/categories', '/budgets'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE);

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/expenses/:path*', '/categories/:path*', '/budgets/:path*'],
};
