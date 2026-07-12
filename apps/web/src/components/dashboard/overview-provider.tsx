'use client';

import { useDashboardFilters } from '@/components/dashboard/use-dashboard-filters';
import { apiFetch } from '@/lib/api-client';
import { API_ROUTES } from '@repo/config';
import type { ApiResponse, IExpenseOverview } from '@repo/types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface OverviewState {
  data: IExpenseOverview | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const OverviewContext = createContext<OverviewState | null>(null);

export function OverviewProvider({ children }: { children: React.ReactNode }) {
  const { months, currency } = useDashboardFilters();
  const [data, setData] = useState<IExpenseOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const refetch = useCallback(() => setAttempt((n) => n + 1), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt is a refetch trigger, not read in the body
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch<ApiResponse<IExpenseOverview>>(
      `${API_ROUTES.ANALYTICS.OVERVIEW}?months=${months}&currency=${currency}`,
    )
      .then((json) => {
        if (cancelled) return;
        if (!json.success) {
          setError(json.error.message);
          return;
        }
        setData(json.data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your spending overview.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [months, currency, attempt]);

  return (
    <OverviewContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </OverviewContext.Provider>
  );
}

export function useOverview(): OverviewState {
  const ctx = useContext(OverviewContext);
  if (!ctx) {
    throw new Error('useOverview must be used within an OverviewProvider');
  }
  return ctx;
}
