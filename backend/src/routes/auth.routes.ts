import { Router } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { AuthService } from '../services/AuthService';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/authMiddleware';
import { registerSchema, loginSchema, refreshSchema } from '../dtos/auth/auth.dto';

// Manual DI
const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const authService = new AuthService(userRepository, refreshTokenRepository);
const authController = new AuthController(authService);

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
authRouter.post('/login', validate(loginSchema), authController.login);

// GET /api/auth/me
authRouter.get('/me', authMiddleware, authController.getMe);

// POST /api/auth/refresh
authRouter.post('/refresh', validate(refreshSchema), authController.refreshToken);

// POST /api/auth/logout
authRouter.post('/logout', authMiddleware, authController.logout);
