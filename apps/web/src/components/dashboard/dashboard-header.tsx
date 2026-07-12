'use client';

import { useDashboardFilters } from '@/components/dashboard/use-dashboard-filters';
import { Flex, Heading, Select } from '@radix-ui/themes';
import { CURRENCIES } from '@repo/config';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const PERIOD_OPTIONS = [
  { value: '3', label: '3 Months' },
  { value: '6', label: '6 Months' },
  { value: '12', label: '12 Months' },
];

export function DashboardHeader({ name }: { name: string }) {
  const { months, currency } = useDashboardFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Flex align="center" justify="between" wrap="wrap" gap="3">
      <Heading size="6" className="font-display">
        Welcome, {name}
      </Heading>

      <Flex gap="3">
        <Select.Root value={currency} onValueChange={(value) => updateParam('currency', value)}>
          <Select.Trigger variant="soft" />
          <Select.Content>
            {CURRENCIES.map((c) => (
              <Select.Item key={c} value={c}>
                {c}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root value={String(months)} onValueChange={(value) => updateParam('months', value)}>
          <Select.Trigger variant="soft" />
          <Select.Content>
            {PERIOD_OPTIONS.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
    </Flex>
  );
}
