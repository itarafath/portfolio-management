import { Investment } from '../../types/investment';

interface InvestmentTableProps {
    investments: Investment[];
    onEdit: (investment: Investment) => void;
    onDelete: (id: string) => void;
    onAddTransaction: (investment: Investment) => void;
}

export default function InvestmentTable({ investments, onEdit, onDelete, onAddTransaction }: InvestmentTableProps) {
    if (investments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-800/50 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
                <h3 className="text-base font-semibold text-surface-300 mb-1">No investments yet</h3>
                <p className="text-sm text-surface-500">Add an investment to start tracking</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-surface-800/50">
                        <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Asset</th>
                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Qty</th>
                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Avg Price</th>
                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Current</th>
                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Gain/Loss</th>
                        <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface-800/30">
                    {investments.map((inv) => {
                        const totalInvested = inv.quantity * inv.averagePurchasePrice;
                        const currentValue = inv.quantity * (inv.currentPrice || inv.averagePurchasePrice);
                        const gain = currentValue - totalInvested;
                        const gainPct = totalInvested > 0 ? (gain / totalInvested) * 100 : 0;
                        const isPositive = gain >= 0;

                        return (
                            <tr key={inv.id} className="hover:bg-surface-800/20 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-primary-600/15 flex items-center justify-center text-primary-400 text-xs font-bold">
                                            {inv.symbol.slice(0, 3)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{inv.symbol}</p>
                                            <p className="text-xs text-surface-500 truncate max-w-[150px]">{inv.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right text-sm text-surface-200">{Number(inv.quantity).toLocaleString()}</td>
                                <td className="py-4 px-4 text-right text-sm text-surface-200">${Number(inv.averagePurchasePrice).toFixed(2)}</td>
                                <td className="py-4 px-4 text-right text-sm text-surface-200">
                                    {inv.currentPrice ? `$${Number(inv.currentPrice).toFixed(2)}` : '—'}
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <span className={`text-sm font-medium ${isPositive ? 'text-gain' : 'text-loss'}`}>
                                        {isPositive ? '+' : ''}{gainPct.toFixed(1)}%
                                    </span>
                                    <p className={`text-xs ${isPositive ? 'text-gain/70' : 'text-loss/70'}`}>
                                        {isPositive ? '+' : ''}${gain.toFixed(2)}
                                    </p>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => onAddTransaction(inv)}
                                            title="Record transaction"
                                            className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-primary-400/10 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onEdit(inv)}
                                            title="Edit"
                                            className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(inv.id)}
                                            title="Delete"
                                            className="p-1.5 rounded-lg text-surface-400 hover:text-loss hover:bg-loss/10 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
