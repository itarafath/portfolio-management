import { AssetType } from '../../entities';

export interface IAssetTypeRepository {
    findAll(): Promise<AssetType[]>;
    findById(id: number): Promise<AssetType | null>;
}
