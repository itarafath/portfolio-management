import { v4 as uuidv4 } from 'uuid';
import { Investment } from '../entities';
import { IInvestmentService } from './interfaces/IInvestmentService';
import { IInvestmentRepository } from '../repositories/interfaces/IInvestmentRepository';
import { IPortfolioRepository } from '../repositories/interfaces/IPortfolioRepository';
import { CreateInvestmentInput, UpdateInvestmentInput } from '../dtos/investment/investment.dto';
import { AppError } from '../middleware/errorHandler';

export interface PortfolioSummary {
    totalValue: number;
    totalInvested: number;
    overallGain: number;
    overallGainPercent: number;
    holdingsCount: number;
    bestPerformer: { symbol: string; gainPercent: number } | null;
    worstPerformer: { symbol: string; gainPercent: number } | null;
}

export class InvestmentService implements IInvestmentService {
    constructor(
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

    async getByPortfolioId(portfolioId: string, userId: string): Promise<Investment[]> {
        await this.verifyPortfolioOwnership(portfolioId, userId);
        return this.investmentRepo.findByPortfolioId(portfolioId);
    }

    async getById(id: string, userId: string): Promise<Investment> {
        const investment = await this.investmentRepo.findById(id);
        if (!investment) {
            throw new AppError('Investment not found', 404);
        }
        await this.verifyPortfolioOwnership(investment.portfolioId, userId);
        return investment;
    }

    async create(data: CreateInvestmentInput, userId: string): Promise<Investment> {
        await this.verifyPortfolioOwnership(data.portfolioId, userId);

        return this.investmentRepo.create({
            id: uuidv4(),
            portfolioId: data.portfolioId,
            assetTypeId: data.assetTypeId,
            symbol: data.symbol,
            name: data.name,
            quantity: 0,
            averagePurchasePrice: 0,
            currentPrice: data.currentPrice,
            currency: data.currency,
            notes: data.notes,
            isActive: true,
        });
    }

    async update(
        id: string,
        data: UpdateInvestmentInput,
        userId: string
    ): Promise<Investment> {
        const investment = await this.getById(id, userId);

        const updateData: Partial<Investment> = {};
        if (data.assetTypeId !== undefined) updateData.assetTypeId = data.assetTypeId;
        if (data.symbol !== undefined) updateData.symbol = data.symbol;
        if (data.name !== undefined) updateData.name = data.name;
        if (data.currentPrice !== undefined) updateData.currentPrice = data.currentPrice;
        if (data.currency !== undefined) updateData.currency = data.currency;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;

        return this.investmentRepo.update(investment.id, updateData);
    }

    async delete(id: string, userId: string): Promise<void> {
        await this.getById(id, userId);
        await this.investmentRepo.softDelete(id);
    }

    async getPortfolioSummary(portfolioId: string, userId: string): Promise<PortfolioSummary> {
        await this.verifyPortfolioOwnership(portfolioId, userId);
        const investments = await this.investmentRepo.findByPortfolioId(portfolioId);

        let totalValue = 0;
        let totalInvested = 0;
        let holdingsCount = 0;
        let bestPerformer: { symbol: string; gainPercent: number } | null = null;
        let worstPerformer: { symbol: string; gainPercent: number } | null = null;

        for (const inv of investments) {
            const qty = Number(inv.quantity);
            const avgPrice = Number(inv.averagePurchasePrice);
            const curPrice = Number(inv.currentPrice || avgPrice);

            if (qty <= 0) continue;

            holdingsCount++;
            const invested = qty * avgPrice;
            const value = qty * curPrice;
            totalInvested += invested;
            totalValue += value;

            const gainPct = invested > 0 ? ((value - invested) / invested) * 100 : 0;

            if (!bestPerformer || gainPct > bestPerformer.gainPercent) {
                bestPerformer = { symbol: inv.symbol, gainPercent: gainPct };
            }
            if (!worstPerformer || gainPct < worstPerformer.gainPercent) {
                worstPerformer = { symbol: inv.symbol, gainPercent: gainPct };
            }
        }

        const overallGain = totalValue - totalInvested;
        const overallGainPercent = totalInvested > 0 ? (overallGain / totalInvested) * 100 : 0;

        return {
            totalValue,
            totalInvested,
            overallGain,
            overallGainPercent,
            holdingsCount,
            bestPerformer,
            worstPerformer,
        };
    }
}
