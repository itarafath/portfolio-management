import { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolios';
import { investmentService } from '../services/investments';
import { Portfolio } from '../types/portfolio';
import { PortfolioSummary } from '../types/investment';
import PortfolioCard from '../components/portfolio/PortfolioCard';
import PortfolioForm from '../components/portfolio/PortfolioForm';
import Modal from '../components/common/Modal';

export default function DashboardPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [summaries, setSummaries] = useState<Record<string, PortfolioSummary>>({});
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const fetchPortfolios = async () => {
        try {
            const data = await portfolioService.getAll();
            setPortfolios(data);

            // Fetch summaries for all portfolios
            const summaryEntries = await Promise.all(
                data.map(async (p) => {
                    try {
                        const summary = await investmentService.getSummary(p.id);
                        return [p.id, summary] as [string, PortfolioSummary];
                    } catch {
                        return null;
                    }
                })
            );
            const summaryMap: Record<string, PortfolioSummary> = {};
            for (const entry of summaryEntries) {
                if (entry) summaryMap[entry[0]] = entry[1];
            }
            setSummaries(summaryMap);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPortfolios(); }, []);

    const handleCreate = async (data: { name: string; description?: string }) => {
        await portfolioService.create(data);
        setShowCreate(false);
        fetchPortfolios();
    };

    // Aggregate totals for the overview
    const totalValue = Object.values(summaries).reduce((acc, s) => acc + s.totalValue, 0);
    const totalInvested = Object.values(summaries).reduce((acc, s) => acc + s.totalInvested, 0);
    const overallGain = totalValue - totalInvested;
    const overallGainPct = totalInvested > 0 ? (overallGain / totalInvested) * 100 : 0;
    const totalHoldings = Object.values(summaries).reduce((acc, s) => acc + s.holdingsCount, 0);

    const formatCurrency = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Portfolios</h1>
                    <p className="text-surface-400 text-sm mt-1">Manage and track your investment portfolios</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Portfolio
                </button>
            </div>

            {/* Overview Cards */}
            {portfolios.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl p-5">
                        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Net Worth</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(totalValue)}</p>
                    </div>
                    <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl p-5">
                        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Total Invested</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(totalInvested)}</p>
                    </div>
                    <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl p-5">
                        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Overall Gain / Loss</p>
                        <p className={`text-xl font-bold ${overallGain >= 0 ? 'text-gain' : 'text-loss'}`}>
                            {overallGain >= 0 ? '+' : ''}{formatCurrency(overallGain)}
                        </p>
                        <p className={`text-xs font-medium mt-0.5 ${overallGainPct >= 0 ? 'text-gain/70' : 'text-loss/70'}`}>
                            {overallGainPct >= 0 ? '+' : ''}{overallGainPct.toFixed(2)}%
                        </p>
                    </div>
                    <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl p-5">
                        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Total Holdings</p>
                        <p className="text-xl font-bold text-white">{totalHoldings}</p>
                        <p className="text-xs text-surface-500 mt-0.5">{portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            )}

            {portfolios.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-surface-800/50 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-surface-300 mb-1">No portfolios yet</h3>
                    <p className="text-sm text-surface-500 mb-6">Create your first portfolio to start tracking investments</p>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-all"
                    >
                        Create Portfolio
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolios.map((p) => (
                        <PortfolioCard key={p.id} portfolio={p} summary={summaries[p.id]} />
                    ))}
                </div>
            )}

            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Portfolio">
                <PortfolioForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
            </Modal>
        </div>
    );
}
