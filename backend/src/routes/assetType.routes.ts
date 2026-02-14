import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { AssetTypeRepository } from '../repositories/AssetTypeRepository';
import { AssetTypeService } from '../services/AssetTypeService';
import { AssetTypeController } from '../controllers/AssetTypeController';

// Manual DI
const assetTypeRepository = new AssetTypeRepository();
const assetTypeService = new AssetTypeService(assetTypeRepository);
const assetTypeController = new AssetTypeController(assetTypeService);

export const assetTypeRouter = Router();

// All asset type routes require authentication
assetTypeRouter.use(authMiddleware);

// GET /api/asset-types
assetTypeRouter.get('/', assetTypeController.getAll);
