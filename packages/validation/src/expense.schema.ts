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

export const expenseQuerySchema = z.object({
  categoryId: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().trim().min(1).max(100).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(LIMITS.PAGE_SIZE_MAX)
    .optional()
    .default(LIMITS.PAGE_SIZE_DEFAULT),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>;
