import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { InvestmentRepository } from '../repositories/InvestmentRepository';
import { PortfolioRepository } from '../repositories/PortfolioRepository';
import { TransactionService } from '../services/TransactionService';
import { TransactionController } from '../controllers/TransactionController';
import { createTransactionSchema } from '../dtos/transaction/transaction.dto';

// Manual DI
const transactionRepository = new TransactionRepository();
const investmentRepository = new InvestmentRepository();
const portfolioRepository = new PortfolioRepository();
const transactionService = new TransactionService(
    transactionRepository,
    investmentRepository,
    portfolioRepository
);
const transactionController = new TransactionController(transactionService);

export const transactionRouter = Router();

// All transaction routes require authentication
transactionRouter.use(authMiddleware);

// GET /api/transactions?portfolioId=xxx&type=buy&startDate=...&endDate=...&page=1&limit=20
transactionRouter.get('/', transactionController.getByPortfolioId);

// POST /api/transactions
transactionRouter.post('/', validate(createTransactionSchema), transactionController.create);
