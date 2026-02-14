import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { PortfolioRepository } from '../repositories/PortfolioRepository';
import { PortfolioService } from '../services/PortfolioService';
import { PortfolioController } from '../controllers/PortfolioController';
import { createPortfolioSchema, updatePortfolioSchema } from '../dtos/portfolio/portfolio.dto';

// Manual DI
const portfolioRepository = new PortfolioRepository();
const portfolioService = new PortfolioService(portfolioRepository);
const portfolioController = new PortfolioController(portfolioService);

export const portfolioRouter = Router();

// All portfolio routes require authentication
portfolioRouter.use(authMiddleware);

// GET /api/portfolios
portfolioRouter.get('/', portfolioController.getAll);

// POST /api/portfolios
portfolioRouter.post('/', validate(createPortfolioSchema), portfolioController.create);

// GET /api/portfolios/:id
portfolioRouter.get('/:id', portfolioController.getById);

// PUT /api/portfolios/:id
portfolioRouter.put('/:id', validate(updatePortfolioSchema), portfolioController.update);

// DELETE /api/portfolios/:id
portfolioRouter.delete('/:id', portfolioController.delete);
