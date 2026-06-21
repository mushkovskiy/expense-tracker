import { ThemeToggle } from '@/components/theme-toggle';
import { Button, Container, Flex, Heading, Text } from '@radix-ui/themes';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container size="1" style={{ minHeight: '100vh' }}>
      <Flex justify="end" pt="4">
        <ThemeToggle />
      </Flex>
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="4"
        style={{ minHeight: '80vh' }}
      >
        <Heading size="8">Expense Tracker</Heading>
        <Text color="gray">Track your expenses, categories, and budgets.</Text>
        <Flex gap="4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Register</Link>
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}
