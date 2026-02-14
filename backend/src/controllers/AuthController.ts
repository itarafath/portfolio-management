import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/interfaces/IAuthService';
import { AuthRequest } from '../middleware/authMiddleware';

export class AuthController {
    constructor(private authService: IAuthService) { }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            const user = await this.authService.getMe(userId);
            res.status(200).json({
                status: 'success',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = req.body;
            const result = await this.authService.refreshToken(refreshToken);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId!;
            await this.authService.logout(userId);
            res.status(200).json({
                status: 'success',
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    };
}
