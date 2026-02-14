import { Transaction } from '../../entities';
import { CreateTransactionInput } from '../../dtos/transaction/transaction.dto';

export interface ITransactionService {
    getByPortfolioId(
        portfolioId: string,
        userId: string,
        filters?: {
            transactionType?: string;
            startDate?: string;
            endDate?: string;
            page?: number;
            limit?: number;
        }
    ): Promise<{ transactions: Transaction[]; total: number; page: number; limit: number }>;
    create(data: CreateTransactionInput, userId: string): Promise<Transaction>;
}
