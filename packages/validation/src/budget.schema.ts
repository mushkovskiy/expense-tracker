import { BUDGET_PERIODS, CURRENCIES, LIMITS } from '@repo/config';
import { z } from 'zod';

export const createBudgetSchema = z.object({
  categoryId: z.string().min(1).optional(),
  amount: z.number().min(LIMITS.MIN_EXPENSE_AMOUNT).max(LIMITS.MAX_EXPENSE_AMOUNT),
  currency: z.enum(CURRENCIES),
  period: z.enum(BUDGET_PERIODS),
  startDate: z.string().datetime(),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
