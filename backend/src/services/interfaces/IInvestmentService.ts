import { Investment } from '@/entities';
import { CreateInvestmentInput, UpdateInvestmentInput } from '@/dtos/investment/investment.dto';
import { PortfolioSummary } from '../InvestmentService';

export interface IInvestmentService {
    getByPortfolioId(portfolioId: string, userId: string): Promise<Investment[]>;
    getById(id: string, userId: string): Promise<Investment>;
    create(data: CreateInvestmentInput, userId: string): Promise<Investment>;
    update(id: string, data: UpdateInvestmentInput, userId: string): Promise<Investment>;
    delete(id: string, userId: string): Promise<void>;
    getPortfolioSummary(portfolioId: string, userId: string): Promise<PortfolioSummary>;
}
