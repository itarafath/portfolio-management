import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { IPortfolioService } from '../services/interfaces/IPortfolioService';

export class PortfolioController {
    constructor(private portfolioService: IPortfolioService) { }

    getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const portfolios = await this.portfolioService.getAll(userId);
            res.status(200).json({
                status: 'success',
                data: portfolios,
            });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const portfolio = await this.portfolioService.getById(req.params.id as string, userId);
            res.status(200).json({
                status: 'success',
                data: portfolio,
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const portfolio = await this.portfolioService.create(req.body, userId);
            res.status(201).json({
                status: 'success',
                data: portfolio,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const portfolio = await this.portfolioService.update(req.params.id as string, req.body, userId);
            res.status(200).json({
                status: 'success',
                data: portfolio,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            await this.portfolioService.delete(req.params.id as string, userId);
            res.status(200).json({
                status: 'success',
                message: 'Portfolio deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    };
}
