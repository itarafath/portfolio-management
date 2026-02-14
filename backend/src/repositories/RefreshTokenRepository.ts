import { Repository } from 'typeorm';
import { RefreshToken } from '../entities';
import { AppDataSource } from '../config/database';
import { IRefreshTokenRepository } from './interfaces/IRefreshTokenRepository';

export class RefreshTokenRepository implements IRefreshTokenRepository {
    private repo: Repository<RefreshToken>;

    constructor() {
        this.repo = AppDataSource.getRepository(RefreshToken);
    }

    async create(tokenData: Partial<RefreshToken>): Promise<RefreshToken> {
        const token = this.repo.create(tokenData);
        return this.repo.save(token);
    }

    async findByToken(token: string): Promise<RefreshToken | null> {
        return this.repo.findOne({ where: { token, revoked: false } });
    }

    async revokeByUserId(userId: string): Promise<void> {
        await this.repo.update({ userId, revoked: false }, { revoked: true });
    }

    async revokeByToken(token: string): Promise<void> {
        await this.repo.update({ token }, { revoked: true });
    }
}
