import { z } from 'zod';

export const createPortfolioSchema = z.object({
    name: z
        .string()
        .min(1, 'Portfolio name is required')
        .max(255, 'Portfolio name must be at most 255 characters'),
    description: z.string().max(1000).optional(),
});

export const updatePortfolioSchema = z.object({
    name: z
        .string()
        .min(1, 'Portfolio name cannot be empty')
        .max(255, 'Portfolio name must be at most 255 characters')
        .optional(),
    description: z.string().max(1000).optional(),
    isActive: z.boolean().optional(),
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
