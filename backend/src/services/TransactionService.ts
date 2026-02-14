import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType } from '../entities';
import { ITransactionService } from './interfaces/ITransactionService';
import { ITransactionRepository } from '../repositories/interfaces/ITransactionRepository';
import { IInvestmentRepository } from '../repositories/interfaces/IInvestmentRepository';
import { IPortfolioRepository } from '../repositories/interfaces/IPortfolioRepository';
import { CreateTransactionInput } from '../dtos/transaction/transaction.dto';
import { AppError } from '../middleware/errorHandler';

export class TransactionService implements ITransactionService {
    constructor(
        private transactionRepo: ITransactionRepository,
        private investmentRepo: IInvestmentRepository,
        private portfolioRepo: IPortfolioRepository
    ) { }

    private async verifyPortfolioOwnership(portfolioId: string, userId: string): Promise<void> {
        const portfolio = await this.portfolioRepo.findById(portfolioId);
        if (!portfolio) {
            throw new AppError('Portfolio not found', 404);
        }
        if (portfolio.userId !== userId) {
            throw new AppError('Access denied', 403);
        }
    }

    async getByPortfolioId(
        portfolioId: string,
        userId: string,
        filters?: {
            transactionType?: string;
            startDate?: string;
            endDate?: string;
            page?: number;
            limit?: number;
        }
    ): Promise<{ transactions: Transaction[]; total: number; page: number; limit: number }> {
        await this.verifyPortfolioOwnership(portfolioId, userId);

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 20;
        const result = await this.transactionRepo.findByPortfolioId(portfolioId, {
            ...filters,
            page,
            limit,
        });

        return {
            transactions: result.transactions,
            total: result.total,
            page,
            limit,
        };
    }

    async create(data: CreateTransactionInput, userId: string): Promise<Transaction> {
        // Verify the investment exists and user owns the portfolio
        const investment = await this.investmentRepo.findById(data.investmentId);
        if (!investment) {
            throw new AppError('Investment not found', 404);
        }
        await this.verifyPortfolioOwnership(investment.portfolioId, userId);

        const txQty = Number(data.quantity);
        const txPrice = Number(data.pricePerUnit);

        const oldQty = Number(investment.quantity);
        const oldAvgPrice = Number(investment.averagePurchasePrice);

        let newQty: number;
        let newAvgPrice: number;

        if (data.transactionType === 'buy') {
            // BUY: increase quantity, recalculate weighted average price
            newQty = oldQty + txQty;
            newAvgPrice = newQty > 0
                ? ((oldQty * oldAvgPrice) + (txQty * txPrice)) / newQty
                : 0;
        } else {
            // SELL: decrease quantity, validate sufficient holdings
            if (txQty > oldQty) {
                throw new AppError(
                    `Insufficient quantity. You have ${oldQty} units but tried to sell ${txQty}.`,
                    400
                );
            }
            newQty = oldQty - txQty;
            // Average purchase price stays the same on sell
            newAvgPrice = oldAvgPrice;
        }

        // Create the transaction
        const transaction = await this.transactionRepo.create({
            id: uuidv4(),
            investmentId: data.investmentId,
            transactionType: data.transactionType as TransactionType,
            quantity: data.quantity,
            pricePerUnit: data.pricePerUnit,
            fees: data.fees,
            transactionDate: data.transactionDate ? new Date(data.transactionDate) : new Date(),
            notes: data.notes,
        });

        // Update the investment with recalculated values
        await this.investmentRepo.update(investment.id, {
            quantity: newQty,
            averagePurchasePrice: newAvgPrice,
            currentPrice: txPrice,
        });

        return transaction;
    }
}
