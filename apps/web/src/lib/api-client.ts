const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiFetch<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
