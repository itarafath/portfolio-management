import { Repository } from 'typeorm';
import { AssetType } from '../entities';
import { AppDataSource } from '../config/database';
import { IAssetTypeRepository } from './interfaces/IAssetTypeRepository';

export class AssetTypeRepository implements IAssetTypeRepository {
    private repo: Repository<AssetType>;

    constructor() {
        this.repo = AppDataSource.getRepository(AssetType);
    }

    async findAll(): Promise<AssetType[]> {
        return this.repo.find({ order: { name: 'ASC' } });
    }

    async findById(id: number): Promise<AssetType | null> {
        return this.repo.findOne({ where: { id } });
    }
}
