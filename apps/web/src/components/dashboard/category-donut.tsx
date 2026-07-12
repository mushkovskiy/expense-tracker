'use client';

import { ChartCard } from '@/components/dashboard/chart-card';
import { useOverview } from '@/components/dashboard/overview-provider';
import { formatCurrency } from '@/lib/format';
import { Box, Flex, Text } from '@radix-ui/themes';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
];

export function CategoryDonut() {
  const { data, loading, error, refetch } = useOverview();
  const empty = !loading && !error && !!data && data.byCategory.length === 0;

  return (
    <ChartCard title="By category" loading={loading} error={error} empty={empty} onRetry={refetch}>
      {data && (
        <Flex direction="column" gap="3" width="100%">
          <Box position="relative" width="100%" height="180px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byCategory}
                  dataKey="total"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.byCategory.map((entry, index) => (
                    <Cell key={entry.categoryId} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value), data.currency)} />
              </PieChart>
            </ResponsiveContainer>
            <Flex
              direction="column"
              align="center"
              justify="center"
              position="absolute"
              inset="0"
              style={{ pointerEvents: 'none' }}
            >
              <Text size="4" weight="bold" className="font-display">
                {formatCurrency(data.totalSpent, data.currency)}
              </Text>
              <Text size="1" color="gray">
                total
              </Text>
            </Flex>
          </Box>

          <Flex direction="column" gap="2">
            {data.byCategory.map((cat, index) => (
              <Flex key={cat.categoryId} align="center" justify="between" gap="2">
                <Flex align="center" gap="2">
                  <Box
                    width="8px"
                    height="8px"
                    style={{
                      borderRadius: '9999px',
                      backgroundColor: PALETTE[index % PALETTE.length],
                    }}
                  />
                  <Text size="2">{cat.name}</Text>
                </Flex>
                <Text size="2" color="gray" className="tabular-nums">
                  {formatCurrency(cat.total, data.currency)}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}
    </ChartCard>
  );
}
