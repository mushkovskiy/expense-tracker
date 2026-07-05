'use client';

import { Button } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="soft" color="red" loading={loading} onClick={handleLogout}>
      Log out
    </Button>
  );
}
