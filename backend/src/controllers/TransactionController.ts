import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ITransactionService } from '../services/interfaces/ITransactionService';

export class TransactionController {
    constructor(private transactionService: ITransactionService) { }

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

            const filters = {
                transactionType: req.query.type as string | undefined,
                startDate: req.query.startDate as string | undefined,
                endDate: req.query.endDate as string | undefined,
                page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
            };

            const result = await this.transactionService.getByPortfolioId(portfolioId, userId, filters);
            res.status(200).json({
                status: 'success',
                data: result.transactions,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const transaction = await this.transactionService.create(req.body, userId);
            res.status(201).json({
                status: 'success',
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    };
}
