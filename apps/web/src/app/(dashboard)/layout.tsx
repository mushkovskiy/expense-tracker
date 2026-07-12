import { Sidebar } from '@/components/sidebar';
import { getCurrentUser } from '@/lib/auth';
import { Box, Flex } from '@radix-ui/themes';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <Flex style={{ minHeight: '100vh' }}>
      <Sidebar user={user} />
      <Box flexGrow="1" p={{ initial: '4', md: '6' }} style={{ overflowX: 'hidden' }}>
        {children}
      </Box>
    </Flex>
  );
}
