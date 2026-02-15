import { Portfolio } from '@/entities';
import { CreatePortfolioInput, UpdatePortfolioInput } from '@/dtos/portfolio/portfolio.dto';

export interface IPortfolioService {
    getAll(userId: string): Promise<Portfolio[]>;
    getById(id: string, userId: string): Promise<Portfolio>;
    create(data: CreatePortfolioInput, userId: string): Promise<Portfolio>;
    update(id: string, data: UpdatePortfolioInput, userId: string): Promise<Portfolio>;
    delete(id: string, userId: string): Promise<void>;
}
