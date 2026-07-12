'use client';

import { useOverview } from '@/components/dashboard/overview-provider';
import { formatCurrency } from '@/lib/format';
import { Card, Flex, Skeleton, Text } from '@radix-ui/themes';
import { TrendingDown, TrendingUp } from 'lucide-react';

function DeltaChip({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null;

  const change = ((current - previous) / previous) * 100;
  const positive = change <= 0;
  const Icon = positive ? TrendingDown : TrendingUp;

  return (
    <Flex
      align="center"
      gap="1"
      style={{ color: positive ? 'var(--delta-positive)' : 'var(--delta-negative)' }}
    >
      <Icon size={14} />
      <Text size="2" weight="medium">
        {Math.abs(change).toFixed(1)}%
      </Text>
    </Flex>
  );
}

export function StatCard({
  label,
  kind,
}: {
  label: string;
  kind: 'total' | 'average';
}) {
  const { data, loading, error } = useOverview();

  return (
    <Card size="3">
      <Flex direction="column" gap="2">
        <Text size="2" color="gray">
          {label}
        </Text>

        {loading && <Skeleton width="6rem" height="2rem" />}

        {!loading && error && (
          <Text size="2" color="red">
            —
          </Text>
        )}

        {!loading && !error && data && (
          <Flex align="center" gap="3" wrap="wrap">
            <Text size="7" weight="bold" className="font-display">
              {formatCurrency(kind === 'total' ? data.totalSpent : data.avgPerMonth, data.currency)}
            </Text>
            {kind === 'total' && (
              <DeltaChip current={data.totalSpent} previous={data.previousPeriodTotal} />
            )}
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
