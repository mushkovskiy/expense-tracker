import { CategoryMenu } from '@/components/category-menu';
import { ProfileCard } from '@/components/profile-card';
import { getCurrentUser } from '@/lib/auth';
import { Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <Flex direction="column" gap="6">
      <Heading size="7">Welcome back, {user.name}</Heading>

      <ProfileCard user={user} />

      <CategoryMenu />

      <Grid columns={{ initial: '1', sm: '2' }} gap="3">
        <Card size="3">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">
              Total spent
            </Text>
            <Text size="5" weight="bold">
              Coming soon
            </Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="1">
            <Text size="2" color="gray">
              Budgets
            </Text>
            <Text size="5" weight="bold">
              Coming soon
            </Text>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  );
}
