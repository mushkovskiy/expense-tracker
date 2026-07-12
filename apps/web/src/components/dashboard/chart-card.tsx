'use client';

import { Button, Card, Flex, Heading, Spinner, Text } from '@radix-ui/themes';
import { RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  action?: ReactNode;
  children: ReactNode;
  minHeight?: string;
}

export function ChartCard({
  title,
  loading,
  error,
  empty,
  emptyMessage = 'No expenses yet.',
  onRetry,
  action,
  children,
  minHeight = '18rem',
}: ChartCardProps) {
  return (
    <Card size="3">
      <Flex direction="column" gap="3" height="100%">
        <Flex align="center" justify="between">
          <Heading size="3" weight="medium" style={{ color: 'var(--gray-11)' }}>
            {title}
          </Heading>
          {action}
        </Flex>

        <Flex align="center" justify="center" style={{ minHeight }} flexGrow="1">
          {loading && <Spinner size="3" />}

          {!loading && error && (
            <Flex direction="column" align="center" gap="2">
              <Text size="2" color="red">
                {error}
              </Text>
              {onRetry && (
                <Button size="1" variant="soft" onClick={onRetry}>
                  <RefreshCw size={13} />
                  Retry
                </Button>
              )}
            </Flex>
          )}

          {!loading && !error && empty && (
            <Text size="2" color="gray">
              {emptyMessage}
            </Text>
          )}

          {!loading && !error && !empty && children}
        </Flex>
      </Flex>
    </Card>
  );
}
