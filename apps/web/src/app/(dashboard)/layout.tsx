import { ThemeToggle } from '@/components/theme-toggle';
import { Box, Flex, Link } from '@radix-ui/themes';
import NextLink from 'next/link';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex style={{ minHeight: '100vh' }}>
      <Box width="13rem" p="4" style={{ borderRight: '1px solid var(--gray-a5)' }}>
        <Flex direction="column" gap="4">
          <ThemeToggle />
          <Flex direction="column" gap="2" asChild>
            <nav>
              <Link asChild>
                <NextLink href="/dashboard">Dashboard</NextLink>
              </Link>
              <Link asChild>
                <NextLink href="/expenses">Expenses</NextLink>
              </Link>
              <Link asChild>
                <NextLink href="/categories">Categories</NextLink>
              </Link>
              <Link asChild>
                <NextLink href="/budgets">Budgets</NextLink>
              </Link>
            </nav>
          </Flex>
        </Flex>
      </Box>
      <Box flexGrow="1" p="6">
        {children}
      </Box>
    </Flex>
  );
}
