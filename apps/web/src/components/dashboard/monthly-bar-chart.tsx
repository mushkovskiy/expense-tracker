'use client';

import { ChartCard } from '@/components/dashboard/chart-card';
import { useOverview } from '@/components/dashboard/overview-provider';
import { formatCurrency, formatMonth } from '@/lib/format';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function MonthlyBarChart() {
  const { data, loading, error, refetch } = useOverview();
  const empty = !loading && !error && !!data && data.totalSpent === 0;

  return (
    <ChartCard
      title="Monthly spending"
      loading={loading}
      error={error}
      empty={empty}
      onRetry={refetch}
    >
      {data && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.monthlyTotals} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-a4)" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fill: 'var(--gray-10)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--gray-10)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value), data.currency)}
              labelFormatter={(label) => formatMonth(String(label))}
              contentStyle={{
                background: 'var(--color-panel-solid)',
                border: '1px solid var(--gray-a5)',
                borderRadius: 'var(--radius-3)',
              }}
            />
            <Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
