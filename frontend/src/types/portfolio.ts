// Portfolio types
export interface Portfolio {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PortfolioSummary extends Portfolio {
    totalValue: number;
    totalInvested: number;
    totalGain: number;
    returnPercentage: number;
    investmentCount: number;
}

export interface CreatePortfolioRequest {
    name: string;
    description?: string;
}

export interface UpdatePortfolioRequest {
    name?: string;
    description?: string;
}
