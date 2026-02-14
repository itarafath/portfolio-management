import { z } from 'zod';

export const createTransactionSchema = z.object({
    investmentId: z.string().uuid('Invalid investment ID'),
    transactionType: z.enum(['buy', 'sell'], {
        errorMap: () => ({ message: 'Transaction type must be "buy" or "sell"' }),
    }),
    quantity: z.number().positive('Quantity must be positive'),
    pricePerUnit: z.number().nonnegative('Price per unit must be non-negative'),
    fees: z.number().nonnegative().optional(),
    transactionDate: z.string().datetime().optional(),
    notes: z.string().max(2000).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
