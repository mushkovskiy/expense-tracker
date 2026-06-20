import { type NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const apiResponse = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await apiResponse.json();
  const response = NextResponse.json(data, { status: apiResponse.status });

  const setCookie = apiResponse.headers.get('set-cookie');
  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }

  return response;
}
