import { AuthService } from './AuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IRefreshTokenRepository } from '../repositories/interfaces/IRefreshTokenRepository';
import { RegisterInput } from '../dtos/auth/auth.dto';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

// Mock dependencies
const mockUserRepo: jest.Mocked<IUserRepository> = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
};

const mockRefreshTokenRepo: jest.Mocked<IRefreshTokenRepository> = {
    create: jest.fn(),
    findByToken: jest.fn(),
    revokeByToken: jest.fn(),
    revokeByUserId: jest.fn(),
};

// Mock utils
jest.mock('../utils/password', () => ({
    hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
    comparePassword: jest.fn(),
}));

jest.mock('../utils/jwt', () => ({
    generateToken: jest.fn().mockReturnValue('accessToken'),
    generateRefreshToken: jest.fn().mockReturnValue('refreshToken'),
}));

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('mocked-uuid'),
}));

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService(mockUserRepo, mockRefreshTokenRepo);
    });

    describe('register', () => {
        const registerData: RegisterInput = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
        };

        it('should successfully register a new user', async () => {
            // Arrange
            mockUserRepo.findByEmail.mockResolvedValue(null);
            mockUserRepo.create.mockResolvedValue({
                id: 'mocked-uuid',
                email: registerData.email,
                passwordHash: 'hashedPassword',
                firstName: registerData.firstName!,
                lastName: registerData.lastName!,
                createdAt: new Date(),
                updatedAt: new Date(),
                portfolios: [],
                refreshTokens: [],
            });

            // Act
            const result = await authService.register(registerData);

            // Assert
            expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(registerData.email);
            expect(mockUserRepo.create).toHaveBeenCalledWith({
                id: 'mocked-uuid',
                email: registerData.email,
                passwordHash: 'hashedPassword',
                firstName: registerData.firstName,
                lastName: registerData.lastName,
            });
            expect(result).toHaveProperty('accessToken', 'accessToken');
            expect(result).toHaveProperty('refreshToken', 'refreshToken');
            expect(result.user).toEqual({
                id: 'mocked-uuid',
                email: registerData.email,
                firstName: registerData.firstName,
                lastName: registerData.lastName,
            });
        });

    });
});
