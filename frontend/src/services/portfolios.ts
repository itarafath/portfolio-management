import api from './api';
import { Portfolio, CreatePortfolioRequest, UpdatePortfolioRequest } from '../types/portfolio';

export const portfolioService = {
    getAll: async (): Promise<Portfolio[]> => {
        const res = await api.get('/portfolios');
        return res.data.data;
    },

    getById: async (id: string): Promise<Portfolio> => {
        const res = await api.get(`/portfolios/${id}`);
        return res.data.data;
    },

    create: async (data: CreatePortfolioRequest): Promise<Portfolio> => {
        const res = await api.post('/portfolios', data);
        return res.data.data;
    },

    update: async (id: string, data: UpdatePortfolioRequest): Promise<Portfolio> => {
        const res = await api.put(`/portfolios/${id}`, data);
        return res.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/portfolios/${id}`);
    },
};
