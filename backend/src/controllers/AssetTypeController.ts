import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { IAssetTypeService } from '../services/interfaces/IAssetTypeService';

export class AssetTypeController {
    constructor(private assetTypeService: IAssetTypeService) { }

    getAll = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const assetTypes = await this.assetTypeService.getAll();
            res.status(200).json({
                status: 'success',
                data: assetTypes,
            });
        } catch (error) {
            next(error);
        }
    };
}
