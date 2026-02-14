import { Repository } from 'typeorm';
import { Transaction } from '../entities';
import { AppDataSource } from '../config/database';
import { ITransactionRepository } from './interfaces/ITransactionRepository';

export class TransactionRepository implements ITransactionRepository {
    private repo: Repository<Transaction>;

    constructor() {
        this.repo = AppDataSource.getRepository(Transaction);
    }

    async findById(id: string): Promise<Transaction | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['investment'],
        });
    }

    async findByInvestmentId(investmentId: string): Promise<Transaction[]> {
        return this.repo.find({
            where: { investmentId },
            order: { transactionDate: 'DESC' },
        });
    }

    async findByPortfolioId(
        portfolioId: string,
        filters?: {
            transactionType?: string;
            startDate?: string;
            endDate?: string;
            page?: number;
            limit?: number;
        }
    ): Promise<{ transactions: Transaction[]; total: number }> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 20;

        const qb = this.repo
            .createQueryBuilder('transaction')
            .innerJoin('transaction.investment', 'investment')
            .where('investment.portfolioId = :portfolioId', { portfolioId })
            .orderBy('transaction.transactionDate', 'DESC');

        if (filters?.transactionType) {
            qb.andWhere('transaction.transactionType = :type', {
                type: filters.transactionType,
            });
        }

        if (filters?.startDate) {
            qb.andWhere('transaction.transactionDate >= :startDate', {
                startDate: filters.startDate,
            });
        }

        if (filters?.endDate) {
            qb.andWhere('transaction.transactionDate <= :endDate', {
                endDate: filters.endDate,
            });
        }

        const total = await qb.getCount();
        const transactions = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .leftJoinAndSelect('transaction.investment', 'inv')
            .getMany();

        return { transactions, total };
    }

    async create(data: Partial<Transaction>): Promise<Transaction> {
        const transaction = this.repo.create(data);
        const saved = await this.repo.save(transaction);
        return this.repo.findOneOrFail({
            where: { id: saved.id },
            relations: ['investment'],
        });
    }
}
