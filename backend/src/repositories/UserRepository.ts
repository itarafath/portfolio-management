import { Repository } from 'typeorm';
import { User } from '../entities';
import { AppDataSource } from '../config/database';
import { IUserRepository } from './interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
    private repo: Repository<User>;

    constructor() {
        this.repo = AppDataSource.getRepository(User);
    }

    async findById(id: string): Promise<User | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.repo.create(userData);
        return this.repo.save(user);
    }
}
