import { RefreshToken } from '../../entities';

export interface IRefreshTokenRepository {
    create(tokenData: Partial<RefreshToken>): Promise<RefreshToken>;
    findByToken(token: string): Promise<RefreshToken | null>;
    revokeByUserId(userId: string): Promise<void>;
    revokeByToken(token: string): Promise<void>;
}
