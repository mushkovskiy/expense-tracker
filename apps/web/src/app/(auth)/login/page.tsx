'use client';

import { Box, Button, Card, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error?.message ?? 'Login failed');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh' }} p="6">
      <Card size="3" style={{ width: '100%', maxWidth: 360 }}>
        <Flex direction="column" gap="4">
          <Heading size="6">Log in</Heading>
          {error && (
            <Text color="red" size="2">
              {error}
            </Text>
          )}
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <Box>
                <Text
                  as="label"
                  htmlFor="email"
                  size="2"
                  weight="medium"
                  mb="1"
                  style={{ display: 'block' }}
                >
                  Email
                </Text>
                <TextField.Root
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="password"
                  size="2"
                  weight="medium"
                  mb="1"
                  style={{ display: 'block' }}
                >
                  Password
                </Text>
                <TextField.Root
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Box>
              <Button type="submit" disabled={loading} loading={loading} style={{ width: '100%' }}>
                Log in
              </Button>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Flex>
  );
}
