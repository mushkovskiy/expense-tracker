import { CURRENCIES, DEFAULT_CURRENCY } from '@repo/config';
import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  months: z.coerce
    .number()
    .int()
    .refine((v) => [3, 6, 12].includes(v), {
      message: 'months must be 3, 6, or 12',
    })
    .optional()
    .default(6),
  currency: z.enum(CURRENCIES).optional().default(DEFAULT_CURRENCY),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
