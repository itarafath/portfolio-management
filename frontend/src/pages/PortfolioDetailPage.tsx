import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { portfolioService } from '../services/portfolios';
import { investmentService } from '../services/investments';
import { transactionService } from '../services/transactions';
import { Portfolio } from '../types/portfolio';
import { Investment, PortfolioSummary } from '../types/investment';
import { Transaction } from '../types/transaction';
import InvestmentTable from '../components/investment/InvestmentTable';
import InvestmentForm from '../components/investment/InvestmentForm';
import TransactionForm from '../components/transaction/TransactionForm';
import PortfolioForm from '../components/portfolio/PortfolioForm';
import Modal from '../components/common/Modal';

type Tab = 'investments' | 'transactions';

export default function PortfolioDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<PortfolioSummary | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('investments');
    const [loading, setLoading] = useState(true);

    const [showAddInvestment, setShowAddInvestment] = useState(false);
    const [editInvestment, setEditInvestment] = useState<Investment | null>(null);
    const [showTransaction, setShowTransaction] = useState(false);
    const [txInvestmentId, setTxInvestmentId] = useState<string | undefined>();
    const [showEditPortfolio, setShowEditPortfolio] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        try {
            const [p, invs, sum] = await Promise.all([
                portfolioService.getById(id),
                investmentService.getByPortfolioId(id),
                investmentService.getSummary(id),
            ]);
            setPortfolio(p);
            setInvestments(invs);
            setSummary(sum);

            const txResult = await transactionService.getByPortfolioId({ portfolioId: id, limit: 50 });
            setTransactions(txResult.transactions);
        } catch {
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAddInvestment = async (data: { symbol: string; name: string; currentPrice?: number; assetTypeId?: number; currency?: string; notes?: string }) => {
        if (!id) return;
        await investmentService.create(id, {
            symbol: data.symbol,
            name: data.name,
            currentPrice: data.currentPrice,
            assetTypeId: data.assetTypeId,
            currency: data.currency,
            notes: data.notes,
        });
        setShowAddInvestment(false);
        fetchData();
    };

    const handleEditInvestment = async (data: { symbol: string; name: string; currentPrice?: number; assetTypeId?: number; currency?: string; notes?: string }) => {
        if (!editInvestment) return;
        await investmentService.update(editInvestment.id, {
            currentPrice: data.currentPrice,
            notes: data.notes,
        });
        setEditInvestment(null);
        fetchData();
    };

    const handleDeleteInvestment = async (invId: string) => {
        if (!window.confirm('Delete this investment?')) return;
        await investmentService.delete(invId);
        fetchData();
    };

    const handleAddTransaction = async (data: { investmentId: string; transactionType: 'buy' | 'sell'; quantity: number; pricePerUnit: number; fees?: number; transactionDate?: string; notes?: string }) => {
        await transactionService.create({
            investmentId: data.investmentId,
            transactionType: data.transactionType,
            quantity: data.quantity,
            pricePerUnit: data.pricePerUnit,
            fees: data.fees,
            transactionDate: data.transactionDate,
            notes: data.notes,
        });
        setShowTransaction(false);
        setTxInvestmentId(undefined);
        fetchData();
    };

    const handleEditPortfolio = async (data: { name: string; description?: string }) => {
        if (!id) return;
        await portfolioService.update(id, data);
        setShowEditPortfolio(false);
        fetchData();
    };

    const handleDeletePortfolio = async () => {
        if (!id || !window.confirm('Delete this portfolio? This action cannot be undone.')) return;
        await portfolioService.delete(id);
        navigate('/dashboard');
    };

    if (loading || !portfolio) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const tabClass = (t: Tab) =>
        `px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === t
            ? 'bg-primary-600/15 text-primary-400'
            : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
        }`;

    const formatCurrency = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <button onClick={() => navigate('/dashboard')} className="text-surface-500 hover:text-surface-300 text-sm mb-3 flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Portfolios
                    </button>
                    <h1 className="text-2xl font-bold text-white">{portfolio.name}</h1>
                    {portfolio.description && (
                        <p className="text-surface-400 text-sm mt-1">{portfolio.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowEditPortfolio(true)}
                        className="px-4 py-2 border border-surface-700 text-surface-300 hover:text-white hover:bg-surface-800 text-sm font-medium rounded-xl transition-all"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDeletePortfolio}
                        className="px-4 py-2 border border-loss/30 text-loss hover:bg-loss/10 text-sm font-medium rounded-xl transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl p-5">
                        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Total Value</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(summary.totalValue)}</p>
                    </div>
                    <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl p-5">
                        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Total Invested</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(summary.totalInvested)}</p>
                    </div>
                    <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl p-5">
                        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Gain / Loss</p>
                        <p className={`text-xl font-bold ${summary.overallGain >= 0 ? 'text-gain' : 'text-loss'}`}>
                            {summary.overallGain >= 0 ? '+' : ''}{formatCurrency(summary.overallGain)}
                        </p>
                        <p className={`text-xs font-medium mt-0.5 ${summary.overallGainPercent >= 0 ? 'text-gain/70' : 'text-loss/70'}`}>
                            {summary.overallGainPercent >= 0 ? '+' : ''}{summary.overallGainPercent.toFixed(2)}%
                        </p>
                    </div>
                    <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl p-5">
                        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Holdings</p>
                        <p className="text-xl font-bold text-white">{summary.holdingsCount}</p>
                        {summary.bestPerformer && (
                            <p className="text-xs text-gain/70 mt-0.5 truncate">
                                Best: {summary.bestPerformer.symbol} ({summary.bestPerformer.gainPercent >= 0 ? '+' : ''}{summary.bestPerformer.gainPercent.toFixed(1)}%)
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setActiveTab('investments')} className={tabClass('investments')}>
                    Investments ({investments.length})
                </button>
                <button onClick={() => setActiveTab('transactions')} className={tabClass('transactions')}>
                    Transactions ({transactions.length})
                </button>
                <div className="flex-1" />
                {activeTab === 'investments' && (
                    <button
                        onClick={() => setShowAddInvestment(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary-600/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Investment
                    </button>
                )}
                {activeTab === 'transactions' && investments.length > 0 && (
                    <button
                        onClick={() => { setTxInvestmentId(undefined); setShowTransaction(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary-600/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Record Transaction
                    </button>
                )}
            </div>

            {/* Tab content */}
            <div className="bg-surface-900/40 border border-surface-800/50 rounded-2xl">
                {activeTab === 'investments' && (
                    <InvestmentTable
                        investments={investments}
                        onEdit={(inv) => setEditInvestment(inv)}
                        onDelete={handleDeleteInvestment}
                        onAddTransaction={(inv) => { setTxInvestmentId(inv.id); setShowTransaction(true); }}
                    />
                )}
                {activeTab === 'transactions' && (
                    transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-surface-800/50 flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-surface-300 mb-1">No transactions yet</h3>
                            <p className="text-sm text-surface-500">Record your first buy or sell transaction</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-800/50">
                                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Date</th>
                                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Type</th>
                                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Investment</th>
                                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Qty</th>
                                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Price</th>
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
                                            <td className="py-3 px-4 text-sm text-white text-right font-medium">${(Number(tx.quantity) * Number(tx.pricePerUnit)).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={showAddInvestment} onClose={() => setShowAddInvestment(false)} title="Add Investment">
                <InvestmentForm onSubmit={handleAddInvestment} onCancel={() => setShowAddInvestment(false)} />
            </Modal>

            <Modal isOpen={!!editInvestment} onClose={() => setEditInvestment(null)} title="Edit Investment">
                {editInvestment && (
                    <InvestmentForm
                        onSubmit={handleEditInvestment}
                        onCancel={() => setEditInvestment(null)}
                        submitLabel="Save Changes"
                        initialData={{
                            symbol: editInvestment.symbol,
                            name: editInvestment.name,
                            currentPrice: editInvestment.currentPrice ? Number(editInvestment.currentPrice) : undefined,
                            assetTypeId: editInvestment.assetType?.id,
                            currency: editInvestment.currency,
                            notes: editInvestment.notes,
                        }}
                    />
                )}
            </Modal>

            <Modal isOpen={showTransaction} onClose={() => { setShowTransaction(false); setTxInvestmentId(undefined); }} title="Record Transaction">
                <TransactionForm
                    investments={investments}
                    preselectedInvestmentId={txInvestmentId}
                    onSubmit={handleAddTransaction}
                    onCancel={() => { setShowTransaction(false); setTxInvestmentId(undefined); }}
                />
            </Modal>

            <Modal isOpen={showEditPortfolio} onClose={() => setShowEditPortfolio(false)} title="Edit Portfolio">
                <PortfolioForm
                    onSubmit={handleEditPortfolio}
                    onCancel={() => setShowEditPortfolio(false)}
                    submitLabel="Save Changes"
                    initialData={{ name: portfolio.name, description: portfolio.description }}
                />
            </Modal>
        </div>
    );
}
