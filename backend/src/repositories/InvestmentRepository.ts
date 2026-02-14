import { IsNull, Repository } from 'typeorm';
import { Investment } from '../entities';
import { AppDataSource } from '../config/database';
import { IInvestmentRepository } from './interfaces/IInvestmentRepository';

export class InvestmentRepository implements IInvestmentRepository {
    private repo: Repository<Investment>;

    constructor() {
        this.repo = AppDataSource.getRepository(Investment);
    }

    async findById(id: string): Promise<Investment | null> {
        return this.repo.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['assetType'],
        });
    }

    async findByPortfolioId(portfolioId: string): Promise<Investment[]> {
        return this.repo.find({
            where: { portfolioId, deletedAt: IsNull() },
            relations: ['assetType'],
            order: { createdAt: 'DESC' },
        });
    }

    async create(data: Partial<Investment>): Promise<Investment> {
        const investment = this.repo.create(data);
        const saved = await this.repo.save(investment);
        return this.repo.findOneOrFail({
            where: { id: saved.id },
            relations: ['assetType'],
        });
    }

    async update(id: string, data: Partial<Investment>): Promise<Investment> {
        await this.repo.update(id, data);
        return this.repo.findOneOrFail({
            where: { id },
            relations: ['assetType'],
        });
    }

    async softDelete(id: string): Promise<void> {
        await this.repo.update(id, { deletedAt: new Date(), isActive: false });
    }
}
