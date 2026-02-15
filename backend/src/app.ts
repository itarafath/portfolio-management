import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { authRouter } from './routes/auth.routes';
import { portfolioRouter } from './routes/portfolio.routes';
import { investmentRouter } from './routes/investment.routes';
import { transactionRouter } from './routes/transaction.routes';
import { assetTypeRouter } from './routes/assetType.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/portfolios', portfolioRouter);
app.use('/api/investments', investmentRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/asset-types', assetTypeRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
