import { Investment } from '../../entities';

export interface IInvestmentRepository {
    findById(id: string): Promise<Investment | null>;
    findByPortfolioId(portfolioId: string): Promise<Investment[]>;
    create(data: Partial<Investment>): Promise<Investment>;
    update(id: string, data: Partial<Investment>): Promise<Investment>;
    softDelete(id: string): Promise<void>;
}
