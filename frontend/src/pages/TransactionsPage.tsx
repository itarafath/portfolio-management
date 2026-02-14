import { useState, useEffect, useCallback } from 'react';
import { portfolioService } from '../services/portfolios';
import { transactionService } from '../services/transactions';
import { Portfolio } from '../types/portfolio';
import { Transaction } from '../types/transaction';

export default function TransactionsPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 20;

    // Filters
    const [portfolioId, setPortfolioId] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        portfolioService.getAll().then(setPortfolios).catch(() => { });
    }, []);

    const fetchTransactions = useCallback(async () => {
        if (!portfolioId) {
            setTransactions([]);
            setTotal(0);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const result = await transactionService.getByPortfolioId({
                portfolioId,
                type: typeFilter as 'buy' | 'sell' | undefined || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                page,
                limit,
            });
            setTransactions(result.transactions);
            setTotal(result.pagination.total);
        } catch {
            // handled by interceptor
        } finally {
            setLoading(false);
        }
    }, [portfolioId, typeFilter, startDate, endDate, page]);

    useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

    const totalPages = Math.ceil(total / limit);

    const inputClass = 'px-3 py-2 bg-surface-800/50 border border-surface-700/50 rounded-xl text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all';

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Transactions</h1>
                <p className="text-surface-400 text-sm mt-1">View and filter your transaction history</p>
            </div>

            {/* Filters */}
            <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-surface-400 uppercase tracking-wider" htmlFor="filter-pf">Portfolio</label>
                        <select
                            id="filter-pf"
                            value={portfolioId}
                            onChange={(e) => { setPortfolioId(e.target.value); setPage(1); }}
                            className={inputClass + ' w-full'}
                        >
                            <option value="">Select portfolio</option>
                            {portfolios.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-surface-400 uppercase tracking-wider" htmlFor="filter-type">Type</label>
                        <select
                            id="filter-type"
                            value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                            className={inputClass + ' w-full'}
                        >
                            <option value="">All</option>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-surface-400 uppercase tracking-wider" htmlFor="filter-start">Start Date</label>
                        <input
                            id="filter-start"
                            type="date"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                            className={inputClass + ' w-full'}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-surface-400 uppercase tracking-wider" htmlFor="filter-end">End Date</label>
                        <input
                            id="filter-end"
                            type="date"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                            className={inputClass + ' w-full'}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            {!portfolioId ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-surface-800/50 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-surface-300 mb-1">Select a portfolio</h3>
                    <p className="text-sm text-surface-500">Choose a portfolio from the filter above to view transactions</p>
                </div>
            ) : loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <h3 className="text-lg font-semibold text-surface-300 mb-1">No transactions found</h3>
                    <p className="text-sm text-surface-500">Try adjusting your filters</p>
                </div>
            ) : (
                <>
                    <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-800/50">
                                    <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Date</th>
                                    <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Type</th>
                                    <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Investment</th>
                                    <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Qty</th>
                                    <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Price</th>
                                    <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Fees</th>
                                    <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-800/30">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-surface-800/20 transition-colors">
                                        <td className="py-3 px-4 text-sm text-surface-300">
                                            {new Date(tx.transactionDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tx.transactionType === 'buy'
                                                ? 'bg-gain/10 text-gain'
                                                : 'bg-loss/10 text-loss'
                                                }`}>
                                                {tx.transactionType.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-white">{tx.investmentSymbol || '—'}</td>
                                        <td className="py-3 px-4 text-sm text-surface-200 text-right">{Number(tx.quantity).toLocaleString()}</td>
                                        <td className="py-3 px-4 text-sm text-surface-200 text-right">${Number(tx.pricePerUnit).toFixed(2)}</td>
                                        <td className="py-3 px-4 text-sm text-surface-400 text-right">{tx.fees ? `$${Number(tx.fees).toFixed(2)}` : '—'}</td>
                                        <td className="py-3 px-4 text-sm text-white text-right font-medium">${(Number(tx.quantity) * Number(tx.pricePerUnit)).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-surface-400">
                                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page <= 1}
                                    className="px-3 py-1.5 border border-surface-700 text-surface-400 hover:text-white rounded-lg text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="px-3 py-1.5 border border-surface-700 text-surface-400 hover:text-white rounded-lg text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
