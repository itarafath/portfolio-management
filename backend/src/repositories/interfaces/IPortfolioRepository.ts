import { Portfolio } from '../../entities';

export interface IPortfolioRepository {
    findById(id: string): Promise<Portfolio | null>;
    findByUserId(userId: string): Promise<Portfolio[]>;
    create(data: Partial<Portfolio>): Promise<Portfolio>;
    update(id: string, data: Partial<Portfolio>): Promise<Portfolio>;
    softDelete(id: string): Promise<void>;
}
