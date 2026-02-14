import api from './api';
import { Transaction, CreateTransactionRequest, TransactionFilters } from '../types/transaction';

interface PaginatedTransactions {
    transactions: Transaction[];
    pagination: { page: number; limit: number; total: number };
}

export const transactionService = {
    getByPortfolioId: async (filters: TransactionFilters): Promise<PaginatedTransactions> => {
        const params = new URLSearchParams();
        if (filters.portfolioId) params.append('portfolioId', filters.portfolioId);
        if (filters.type) params.append('type', filters.type);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));

        const res = await api.get(`/transactions?${params.toString()}`);
        return { transactions: res.data.data, pagination: res.data.pagination };
    },

    create: async (data: CreateTransactionRequest): Promise<Transaction> => {
        const res = await api.post('/transactions', data);
        return res.data.data;
    },
};
