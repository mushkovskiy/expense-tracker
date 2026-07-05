import { Avatar, Card, Flex, Text } from '@radix-ui/themes';
import type { IUser } from '@repo/types';
import { LogoutButton } from './logout-button';

function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || '?';
}

export function ProfileCard({ user }: { user: IUser }) {
  return (
    <Card size="3">
      <Flex align="center" gap="4">
        <Avatar fallback={getInitials(user.name)} size="5" radius="full" />
        <Flex direction="column" gap="1" flexGrow="1">
          <Text weight="bold" size="4">
            {user.name}
          </Text>
          <Text color="gray" size="2">
            {user.email}
          </Text>
        </Flex>
        <LogoutButton />
      </Flex>
    </Card>
  );
}
