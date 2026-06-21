import { LIMITS } from '@repo/config';
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(LIMITS.MAX_CATEGORY_NAME_LENGTH),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a hex value, e.g. #RRGGBB'),
  icon: z.string().max(50).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryQuerySchema = z.object({
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

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
