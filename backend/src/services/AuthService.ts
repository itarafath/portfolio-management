import { v4 as uuidv4 } from 'uuid';
import { IAuthService, AuthResponse, UserProfile } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IRefreshTokenRepository } from '../repositories/interfaces/IRefreshTokenRepository';
import { RegisterInput, LoginInput } from '../dtos/auth/auth.dto';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export class AuthService implements IAuthService {
    constructor(
        private userRepo: IUserRepository,
        private refreshTokenRepo: IRefreshTokenRepository
    ) { }

    async register(data: RegisterInput): Promise<AuthResponse> {
        // Check for existing user
        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new AppError('Email already registered', 409);
        }

        // Create user
        const passwordHash = await hashPassword(data.password);
        const userId = uuidv4();

        const user = await this.userRepo.create({
            id: userId,
            email: data.email,
            passwordHash,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
        });

        // Generate tokens
        const tokenPayload = { userId: user.id, email: user.email };
        const accessToken = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Store refresh token
        await this.saveRefreshToken(user.id, refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken,
            refreshToken,
        };
    }

    async login(data: LoginInput): Promise<AuthResponse> {
        const user = await this.userRepo.findByEmail(data.email);
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isValid = await comparePassword(data.password, user.passwordHash);
        if (!isValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate tokens
        const tokenPayload = { userId: user.id, email: user.email };
        const accessToken = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Store refresh token
        await this.saveRefreshToken(user.id, refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken,
            refreshToken,
        };
    }

    async getMe(userId: string): Promise<UserProfile> {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
        };
    }

    async refreshToken(token: string): Promise<AuthResponse> {
        // Verify the JWT is valid
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch {
            throw new AppError('Invalid or expired refresh token', 401);
        }

        // Check the token exists in DB and is not revoked
        const storedToken = await this.refreshTokenRepo.findByToken(token);
        if (!storedToken) {
            throw new AppError('Refresh token not found or revoked', 401);
        }

        // Check expiration
        if (new Date() > storedToken.expiresAt) {
            await this.refreshTokenRepo.revokeByToken(token);
            throw new AppError('Refresh token expired', 401);
        }

        // Revoke old token
        await this.refreshTokenRepo.revokeByToken(token);

        // Get user
        const user = await this.userRepo.findById(decoded.userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Generate new tokens
        const tokenPayload = { userId: user.id, email: user.email };
        const newAccessToken = generateToken(tokenPayload);
        const newRefreshToken = generateRefreshToken(tokenPayload);

        // Store new refresh token
        await this.saveRefreshToken(user.id, newRefreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    async logout(userId: string): Promise<void> {
        await this.refreshTokenRepo.revokeByUserId(userId);
    }

    private async saveRefreshToken(userId: string, token: string): Promise<void> {
        // Parse expiration from JWT config (default 30d)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await this.refreshTokenRepo.create({
            id: uuidv4(),
            userId,
            token,
            expiresAt,
            revoked: false,
        });
    }
}
