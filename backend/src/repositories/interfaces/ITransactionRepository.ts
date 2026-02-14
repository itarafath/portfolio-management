import { Transaction } from '../../entities';

export interface ITransactionRepository {
    findById(id: string): Promise<Transaction | null>;
    findByInvestmentId(investmentId: string): Promise<Transaction[]>;
    findByPortfolioId(
        portfolioId: string,
        filters?: {
            transactionType?: string;
            startDate?: string;
            endDate?: string;
            page?: number;
            limit?: number;
        }
    ): Promise<{ transactions: Transaction[]; total: number }>;
    create(data: Partial<Transaction>): Promise<Transaction>;
}
