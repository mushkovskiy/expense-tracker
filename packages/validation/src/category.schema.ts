import { LIMITS } from '@repo/config';
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(LIMITS.MAX_CATEGORY_NAME_LENGTH),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a hex value, e.g. #RRGGBB'),
  icon: z.string().max(50).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
