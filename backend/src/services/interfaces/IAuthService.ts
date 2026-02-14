import { RegisterInput, LoginInput } from '../../dtos/auth/auth.dto';

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    accessToken: string;
    refreshToken: string;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: Date;
}

export interface IAuthService {
    register(data: RegisterInput): Promise<AuthResponse>;
    login(data: LoginInput): Promise<AuthResponse>;
    getMe(userId: string): Promise<UserProfile>;
    refreshToken(token: string): Promise<AuthResponse>;
    logout(userId: string): Promise<void>;
}
