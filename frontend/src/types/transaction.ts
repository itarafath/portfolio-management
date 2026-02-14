// Transaction types
export type TransactionType = 'buy' | 'sell';

export interface Transaction {
    id: string;
    investmentId: string;
    investmentSymbol: string;
    investmentName: string;
    transactionType: TransactionType;
    quantity: number;
    pricePerUnit: number;
    fees: number;
    transactionDate: string;
    notes: string;
}

export interface CreateTransactionRequest {
    investmentId: string;
    transactionType: TransactionType;
    quantity: number;
    pricePerUnit: number;
    fees?: number;
    transactionDate?: string;
    notes?: string;
}

export interface TransactionFilters {
    portfolioId?: string;
    type?: TransactionType;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}
