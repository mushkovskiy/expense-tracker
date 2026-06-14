export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export interface IBudget {
  id: string;
  userId: string;
  categoryId?: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetDto {
  categoryId?: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: string;
}

export interface UpdateBudgetDto {
  categoryId?: string;
  amount?: number;
  currency?: string;
  period?: BudgetPeriod;
  startDate?: string;
}
