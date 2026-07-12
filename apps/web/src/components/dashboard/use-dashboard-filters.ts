'use client';

import { CURRENCIES, DEFAULT_CURRENCY } from '@repo/config';
import { useSearchParams } from 'next/navigation';

const VALID_MONTHS = [3, 6, 12] as const;

export function useDashboardFilters() {
  const searchParams = useSearchParams();

  const monthsParam = Number(searchParams.get('months'));
  const months = VALID_MONTHS.includes(monthsParam as (typeof VALID_MONTHS)[number])
    ? monthsParam
    : 6;

  const currencyParam = searchParams.get('currency');
  const currency = CURRENCIES.includes(currencyParam as (typeof CURRENCIES)[number])
    ? (currencyParam as (typeof CURRENCIES)[number])
    : DEFAULT_CURRENCY;

  return { months, currency };
}
