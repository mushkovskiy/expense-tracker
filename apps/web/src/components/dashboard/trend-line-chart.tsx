'use client';

import { ChartCard } from '@/components/dashboard/chart-card';
import { useOverview } from '@/components/dashboard/overview-provider';
import { formatCurrency, formatMonth } from '@/lib/format';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function TrendLineChart() {
  const { data, loading, error, refetch } = useOverview();
  const empty = !loading && !error && !!data && data.totalSpent === 0;

  return (
    <ChartCard title="Spend trend" loading={loading} error={error} empty={empty} onRetry={refetch}>
      {data && (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.monthlyTotals} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#trendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
