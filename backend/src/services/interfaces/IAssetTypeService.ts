import { AssetType } from '../../entities';

export interface IAssetTypeService {
    getAll(): Promise<AssetType[]>;
}
