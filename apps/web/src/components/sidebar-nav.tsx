'use client';

import { ProfileCard } from '@/components/profile-card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Box, Flex, Link, Text, TextField } from '@radix-ui/themes';
import type { IUser } from '@repo/types';
import { LayoutDashboard, Receipt, Search, Tags, Wallet } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/budgets', label: 'Budgets', icon: Wallet },
];

export function SidebarNav({
  user,
  onNavigate,
}: {
  user: IUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Flex direction="column" height="100%" gap="5" p="4">
      <Text size="5" weight="bold" className="font-display" style={{ color: 'var(--gray-12)' }}>
        Ledgerly
      </Text>

      <TextField.Root placeholder="Search" size="2" variant="soft" disabled>
        <TextField.Slot>
          <Search size={15} />
        </TextField.Slot>
      </TextField.Root>

      <Flex direction="column" gap="1" asChild flexGrow="1">
        <nav aria-label="Main menu">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                asChild
                underline="none"
                onClick={onNavigate}
                style={{
                  color: active ? 'var(--jade-11)' : 'var(--gray-11)',
                  backgroundColor: active ? 'var(--jade-a3)' : 'transparent',
                  borderRadius: 'var(--radius-3)',
                  padding: '0.5rem 0.75rem',
                }}
              >
                <NextLink href={item.href}>
                  <Flex align="center" gap="3">
                    <Icon size={17} />
                    <Text size="2" weight={active ? 'medium' : 'regular'}>
                      {item.label}
                    </Text>
                  </Flex>
                </NextLink>
              </Link>
            );
          })}
        </nav>
      </Flex>

      <Box style={{ borderTop: '1px solid var(--gray-a5)' }} pt="4">
        <Flex direction="column" gap="3">
          <ThemeToggle />
          <ProfileCard user={user} />
        </Flex>
      </Box>
    </Flex>
  );
}
