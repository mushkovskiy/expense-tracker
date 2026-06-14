import { type NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api';

export async function POST(request: NextRequest) {
  const apiResponse = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  const response = new NextResponse(null, { status: apiResponse.status });

  const setCookie = apiResponse.headers.get('set-cookie');
  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }

  return response;
}
