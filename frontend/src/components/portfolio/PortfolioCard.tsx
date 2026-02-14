import { useNavigate } from 'react-router-dom';
import { Portfolio } from '../../types/portfolio';
import { PortfolioSummary } from '../../types/investment';

interface PortfolioCardProps {
    portfolio: Portfolio;
    summary?: PortfolioSummary;
}

export default function PortfolioCard({ portfolio, summary }: PortfolioCardProps) {
    const navigate = useNavigate();

    const formatCurrency = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <button
            onClick={() => navigate(`/portfolio/${portfolio.id}`)}
            className="w-full text-left bg-surface-900/60 border border-surface-800/50 rounded-2xl p-6 hover:border-primary-500/30 hover:bg-surface-800/40 transition-all duration-300 group cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${portfolio.isActive
                    ? 'bg-gain/10 text-gain'
                    : 'bg-surface-700 text-surface-400'
                    }`}>
                    {portfolio.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            <h3 className="text-base font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors">
                {portfolio.name}
            </h3>
            {portfolio.description && (
                <p className="text-sm text-surface-400 line-clamp-2 mb-3">
                    {portfolio.description}
                </p>
            )}

            {/* Summary Metrics */}
            {summary && summary.holdingsCount > 0 && (
                <div className="border-t border-surface-800/50 pt-3 mt-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-surface-500">Value</span>
                        <span className="text-sm font-semibold text-white">{formatCurrency(summary.totalValue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-surface-500">Gain / Loss</span>
                        <span className={`text-sm font-semibold ${summary.overallGain >= 0 ? 'text-gain' : 'text-loss'}`}>
                            {summary.overallGain >= 0 ? '+' : ''}{formatCurrency(summary.overallGain)}
                            <span className="text-xs ml-1 opacity-70">
                                ({summary.overallGainPercent >= 0 ? '+' : ''}{summary.overallGainPercent.toFixed(1)}%)
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-surface-500">Holdings</span>
                        <span className="text-xs text-surface-300">{summary.holdingsCount} asset{summary.holdingsCount !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between text-xs text-surface-500 mt-3">
                <span>Created {new Date(portfolio.createdAt).toLocaleDateString()}</span>
                <svg className="w-4 h-4 text-surface-600 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
}
