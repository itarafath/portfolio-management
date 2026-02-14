import api from './api';
import { Investment, CreateInvestmentRequest, UpdateInvestmentRequest, PortfolioSummary } from '../types/investment';

export const investmentService = {
    getByPortfolioId: async (portfolioId: string): Promise<Investment[]> => {
        const res = await api.get(`/investments?portfolioId=${portfolioId}`);
        return res.data.data;
    },

    create: async (portfolioId: string, data: CreateInvestmentRequest): Promise<Investment> => {
        const res = await api.post('/investments', { ...data, portfolioId });
        return res.data.data;
    },

    update: async (id: string, data: UpdateInvestmentRequest): Promise<Investment> => {
        const res = await api.put(`/investments/${id}`, data);
        return res.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/investments/${id}`);
    },

    getSummary: async (portfolioId: string): Promise<PortfolioSummary> => {
        const res = await api.get(`/investments/summary?portfolioId=${portfolioId}`);
        return res.data.data;
    },
};
