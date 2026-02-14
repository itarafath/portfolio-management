import { v4 as uuidv4 } from 'uuid';
import { Portfolio } from '../entities';
import { IPortfolioService } from './interfaces/IPortfolioService';
import { IPortfolioRepository } from '../repositories/interfaces/IPortfolioRepository';
import { CreatePortfolioInput, UpdatePortfolioInput } from '../dtos/portfolio/portfolio.dto';
import { AppError } from '../middleware/errorHandler';

export class PortfolioService implements IPortfolioService {
    constructor(private portfolioRepo: IPortfolioRepository) { }

    async getAll(userId: string): Promise<Portfolio[]> {
        return this.portfolioRepo.findByUserId(userId);
    }

    async getById(id: string, userId: string): Promise<Portfolio> {
        const portfolio = await this.portfolioRepo.findById(id);
        if (!portfolio) {
            throw new AppError('Portfolio not found', 404);
        }
        if (portfolio.userId !== userId) {
            throw new AppError('Access denied', 403);
        }
        return portfolio;
    }

    async create(data: CreatePortfolioInput, userId: string): Promise<Portfolio> {
        return this.portfolioRepo.create({
            id: uuidv4(),
            userId,
            name: data.name,
            description: data.description,
            isActive: true,
        });
    }

    async update(
        id: string,
        data: UpdatePortfolioInput,
        userId: string
    ): Promise<Portfolio> {
        // Verify ownership
        await this.getById(id, userId);

        const updateData: Partial<Portfolio> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;

        return this.portfolioRepo.update(id, updateData);
    }

    async delete(id: string, userId: string): Promise<void> {
        // Verify ownership
        await this.getById(id, userId);
        await this.portfolioRepo.softDelete(id);
    }
}
