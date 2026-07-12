import { CategoryDonut } from '@/components/dashboard/category-donut';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { MonthlyBarChart } from '@/components/dashboard/monthly-bar-chart';
import { OverviewProvider } from '@/components/dashboard/overview-provider';
import { StatCard } from '@/components/dashboard/stat-card';
import { TransactionsTable } from '@/components/dashboard/transactions-table';
import { TrendLineChart } from '@/components/dashboard/trend-line-chart';
import { getCurrentUser } from '@/lib/auth';
import { Flex, Grid } from '@radix-ui/themes';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <Suspense>
      <OverviewProvider>
        <Flex direction="column" gap="5">
          <DashboardHeader name={user.name} />

          <Grid columns={{ initial: '1', md: '2' }} gap="4">
            <Flex direction="column" gap="4">
              <MonthlyBarChart />
              <TrendLineChart />
            </Flex>

            <Flex direction="column" gap="4">
              <Grid columns="2" gap="4">
                <StatCard label="Total spent" kind="total" />
                <StatCard label="Avg / month" kind="average" />
              </Grid>
              <CategoryDonut />
            </Flex>
          </Grid>

          <TransactionsTable pageSize={5} />
        </Flex>
      </OverviewProvider>
    </Suspense>
  );
}
