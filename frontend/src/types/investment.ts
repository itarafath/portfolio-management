// Investment types
export interface AssetType {
    id: number;
    name: string;
    description: string;
}

export interface Investment {
    id: string;
    portfolioId: string;
    assetType: AssetType;
    symbol: string;
    name: string;
    quantity: number;
    averagePurchasePrice: number;
    currentPrice: number;
    currency: string;
    notes: string;
    isActive: boolean;
}

export interface InvestmentWithGain extends Investment {
    totalValue: number;
    totalInvested: number;
    gain: number;
    gainPercentage: number;
}

export interface CreateInvestmentRequest {
    assetTypeId?: number;
    symbol: string;
    name: string;
    currentPrice?: number;
    currency?: string;
    notes?: string;
}

export interface UpdateInvestmentRequest {
    currentPrice?: number;
    notes?: string;
}

export interface PortfolioSummary {
    totalValue: number;
    totalInvested: number;
    overallGain: number;
    overallGainPercent: number;
    holdingsCount: number;
    bestPerformer: { symbol: string; gainPercent: number } | null;
    worstPerformer: { symbol: string; gainPercent: number } | null;
}
