import { useState, type FormEvent } from 'react';
import { Investment } from '../../types/investment';

interface TransactionFormProps {
    investments: Investment[];
    preselectedInvestmentId?: string;
    onSubmit: (data: {
        investmentId: string;
        transactionType: 'buy' | 'sell';
        quantity: number;
        pricePerUnit: number;
        fees?: number;
        transactionDate?: string;
        notes?: string;
    }) => Promise<void>;
    onCancel: () => void;
}

export default function TransactionForm({ investments, preselectedInvestmentId, onSubmit, onCancel }: TransactionFormProps) {
    const [investmentId, setInvestmentId] = useState(preselectedInvestmentId ?? '');
    const [type, setType] = useState<'buy' | 'sell'>('buy');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [fees, setFees] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onSubmit({
                investmentId,
                transactionType: type,
                quantity: parseFloat(quantity),
                pricePerUnit: parseFloat(price),
                fees: fees ? parseFloat(fees) : undefined,
                transactionDate: date ? new Date(date).toISOString() : undefined,
                notes: notes || undefined,
            });
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = 'w-full px-4 py-2.5 bg-surface-800/50 border border-surface-700/50 rounded-xl text-white placeholder-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-loss/10 border border-loss/30 text-loss text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-300" htmlFor="tx-inv">Investment</label>
                <select id="tx-inv" value={investmentId} onChange={(e) => setInvestmentId(e.target.value)} required className={inputClass}>
                    <option value="">Select investment</option>
                    {investments.map((inv) => <option key={inv.id} value={inv.id}>{inv.symbol} — {inv.name}</option>)}
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-300">Type</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setType('buy')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${type === 'buy'
                                ? 'bg-gain/15 text-gain border border-gain/30'
                                : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-white'
                            }`}
                    >
                        Buy
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('sell')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${type === 'sell'
                                ? 'bg-loss/15 text-loss border border-loss/30'
                                : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-white'
                            }`}
                    >
                        Sell
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-surface-300" htmlFor="tx-qty">Quantity</label>
                    <input id="tx-qty" type="number" step="any" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="100" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-surface-300" htmlFor="tx-price">Price per Unit</label>
                    <input id="tx-price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="150.00" className={inputClass} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-surface-300" htmlFor="tx-fees">Fees <span className="text-surface-500">(optional)</span></label>
                    <input id="tx-fees" type="number" step="0.01" min="0" value={fees} onChange={(e) => setFees(e.target.value)} placeholder="0.00" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-surface-300" htmlFor="tx-date">Date</label>
                    <input id="tx-date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-300" htmlFor="tx-notes">Notes <span className="text-surface-500">(optional)</span></label>
                <textarea id="tx-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={2000} placeholder="Any notes..." className={`${inputClass} resize-none`} />
            </div>

            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-surface-700 text-surface-300 hover:text-white hover:bg-surface-800 rounded-xl transition-all text-sm font-medium">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className={`flex-1 py-2.5 text-white rounded-xl transition-all text-sm font-medium shadow-lg ${type === 'buy'
                        ? 'bg-gain/80 hover:bg-gain shadow-gain/20'
                        : 'bg-loss/80 hover:bg-loss shadow-loss/20'
                    } disabled:opacity-50`}>
                    {loading ? 'Recording...' : `Record ${type === 'buy' ? 'Buy' : 'Sell'}`}
                </button>
            </div>
        </form>
    );
}
