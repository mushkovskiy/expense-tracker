import { CURRENCIES, LIMITS } from '@repo/config';
import { z } from 'zod';

export const createExpenseSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().min(LIMITS.MIN_EXPENSE_AMOUNT).max(LIMITS.MAX_EXPENSE_AMOUNT),
  currency: z.enum(CURRENCIES),
  description: z.string().max(LIMITS.MAX_DESCRIPTION_LENGTH).optional(),
  date: z.string().datetime(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
