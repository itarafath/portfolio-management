import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { InvestmentRepository } from '../repositories/InvestmentRepository';
import { PortfolioRepository } from '../repositories/PortfolioRepository';
import { InvestmentService } from '../services/InvestmentService';
import { InvestmentController } from '../controllers/InvestmentController';
import { createInvestmentSchema, updateInvestmentSchema } from '../dtos/investment/investment.dto';

// Manual DI
const investmentRepository = new InvestmentRepository();
const portfolioRepository = new PortfolioRepository();
const investmentService = new InvestmentService(investmentRepository, portfolioRepository);
const investmentController = new InvestmentController(investmentService);

export const investmentRouter = Router();

// All investment routes require authentication
investmentRouter.use(authMiddleware);

// GET /api/investments?portfolioId=xxx
investmentRouter.get('/', investmentController.getByPortfolioId);

// GET /api/investments/summary?portfolioId=xxx
investmentRouter.get('/summary', investmentController.getPortfolioSummary);

// GET /api/investments/:id
investmentRouter.get('/:id', investmentController.getById);

// POST /api/investments
investmentRouter.post('/', validate(createInvestmentSchema), investmentController.create);

// PUT /api/investments/:id
investmentRouter.put('/:id', validate(updateInvestmentSchema), investmentController.update);

// DELETE /api/investments/:id (soft delete)
investmentRouter.delete('/:id', investmentController.delete);
