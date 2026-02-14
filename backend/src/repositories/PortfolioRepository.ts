import { IsNull, Repository } from 'typeorm';
import { Portfolio } from '../entities';
import { AppDataSource } from '../config/database';
import { IPortfolioRepository } from './interfaces/IPortfolioRepository';

export class PortfolioRepository implements IPortfolioRepository {
    private repo: Repository<Portfolio>;

    constructor() {
        this.repo = AppDataSource.getRepository(Portfolio);
    }

    async findById(id: string): Promise<Portfolio | null> {
        return this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    }

    async findByUserId(userId: string): Promise<Portfolio[]> {
        return this.repo.find({
            where: { userId, deletedAt: IsNull() },
            order: { createdAt: 'DESC' },
        });
    }

    async create(data: Partial<Portfolio>): Promise<Portfolio> {
        const portfolio = this.repo.create(data);
        return this.repo.save(portfolio);
    }

    async update(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
        await this.repo.update(id, data);
        return this.repo.findOneOrFail({ where: { id } });
    }

    async softDelete(id: string): Promise<void> {
        await this.repo.update(id, { deletedAt: new Date() });
    }
}
