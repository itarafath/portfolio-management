import { AssetType } from '../entities';
import { IAssetTypeService } from './interfaces/IAssetTypeService';
import { IAssetTypeRepository } from '../repositories/interfaces/IAssetTypeRepository';

export class AssetTypeService implements IAssetTypeService {
    constructor(private assetTypeRepo: IAssetTypeRepository) { }

    async getAll(): Promise<AssetType[]> {
        return this.assetTypeRepo.findAll();
    }
}
