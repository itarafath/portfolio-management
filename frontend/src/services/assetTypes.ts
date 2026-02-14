import api from './api';
import { AssetType } from '../types/investment';

export const assetTypeService = {
    getAll: async (): Promise<AssetType[]> => {
        const res = await api.get('/asset-types');
        return res.data.data;
    },
};
