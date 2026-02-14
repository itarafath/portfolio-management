import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { IInvestmentService } from '../services/interfaces/IInvestmentService';

export class InvestmentController {
    constructor(private investmentService: IInvestmentService) { }

    getByPortfolioId = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const portfolioId = req.query.portfolioId as string;
            if (!portfolioId) {
                res.status(400).json({
                    status: 'error',
                    message: 'portfolioId query parameter is required',
                });
                return;
            }
            const investments = await this.investmentService.getByPortfolioId(portfolioId, userId);
            res.status(200).json({
                status: 'success',
                data: investments,
            });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const investment = await this.investmentService.getById(req.params.id as string, userId);
            res.status(200).json({
                status: 'success',
                data: investment,
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const investment = await this.investmentService.create(req.body, userId);
            res.status(201).json({
                status: 'success',
                data: investment,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const investment = await this.investmentService.update(req.params.id as string, req.body, userId);
            res.status(200).json({
                status: 'success',
                data: investment,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            await this.investmentService.delete(req.params.id as string, userId);
            res.status(200).json({
                status: 'success',
                message: 'Investment deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    getPortfolioSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const portfolioId = req.query.portfolioId as string;
            if (!portfolioId) {
                res.status(400).json({
                    status: 'error',
                    message: 'portfolioId query parameter is required',
                });
                return;
            }
            const summary = await this.investmentService.getPortfolioSummary(portfolioId, userId);
            res.status(200).json({
                status: 'success',
                data: summary,
            });
        } catch (error) {
            next(error);
        }
    };
}
