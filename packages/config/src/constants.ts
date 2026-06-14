export const CURRENCIES = ['USD', 'EUR', 'GBP', 'PLN', 'JPY'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = 'USD';

export const BUDGET_PERIODS = ['weekly', 'monthly', 'yearly'] as const;
export type BudgetPeriodConstant = (typeof BUDGET_PERIODS)[number];

export const LIMITS = {
  MAX_EXPENSE_AMOUNT: 1_000_000,
  MIN_EXPENSE_AMOUNT: 0.01,
  MAX_DESCRIPTION_LENGTH: 280,
  MAX_CATEGORY_NAME_LENGTH: 50,
  PAGE_SIZE_DEFAULT: 20,
  PAGE_SIZE_MAX: 100,
} as const;
