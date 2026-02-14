import { z } from 'zod';

export const createInvestmentSchema = z.object({
    portfolioId: z.string().uuid('Invalid portfolio ID'),
    assetTypeId: z.number().int().positive().optional(),
    symbol: z
        .string()
        .min(1, 'Symbol is required')
        .max(20, 'Symbol must be at most 20 characters'),
    name: z
        .string()
        .min(1, 'Name is required')
        .max(255, 'Name must be at most 255 characters'),
    currentPrice: z.number().nonnegative().optional(),
    currency: z.string().length(3, 'Currency must be a 3-letter code').optional(),
    notes: z.string().max(2000).optional(),
});

export const updateInvestmentSchema = z.object({
    assetTypeId: z.number().int().positive().optional(),
    symbol: z.string().min(1).max(20).optional(),
    name: z.string().min(1).max(255).optional(),
    currentPrice: z.number().nonnegative().optional(),
    currency: z.string().length(3).optional(),
    notes: z.string().max(2000).optional(),
    isActive: z.boolean().optional(),
});

export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>;
export type UpdateInvestmentInput = z.infer<typeof updateInvestmentSchema>;
