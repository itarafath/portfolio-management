import { useState, useEffect, type FormEvent } from 'react';
import { AssetType } from '../../types/investment';
import { assetTypeService } from '../../services/assetTypes';

interface InvestmentFormProps {
    onSubmit: (data: {
        symbol: string;
        name: string;
        currentPrice?: number;
        assetTypeId?: number;
        currency?: string;
        notes?: string;
    }) => Promise<void>;
    onCancel: () => void;
    initialData?: {
        symbol?: string;
        name?: string;
        currentPrice?: number;
        assetTypeId?: number;
        currency?: string;
        notes?: string;
    };
    submitLabel?: string;
}

export default function InvestmentForm({ onSubmit, onCancel, initialData, submitLabel = 'Add Investment' }: InvestmentFormProps) {
    const [symbol, setSymbol] = useState(initialData?.symbol ?? '');
    const [name, setName] = useState(initialData?.name ?? '');
    const [currentPrice, setCurrentPrice] = useState(initialData?.currentPrice?.toString() ?? '');
    const [assetTypeId, setAssetTypeId] = useState(initialData?.assetTypeId?.toString() ?? '');
    const [currency, setCurrency] = useState(initialData?.currency ?? 'USD');
    const [notes, setNotes] = useState(initialData?.notes ?? '');
    const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        assetTypeService.getAll().then(setAssetTypes).catch(() => { });
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onSubmit({
                symbol: symbol.toUpperCase(),
                name,
                currentPrice: currentPrice ? parseFloat(currentPrice) : undefined,
                assetTypeId: assetTypeId ? parseInt(assetTypeId) : undefined,
                currency: currency || undefined,
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

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-surface-300" htmlFor="inv-symbol">Symbol</label>
                    <input id="inv-symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required maxLength={20} placeholder="AAPL" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-surface-300" htmlFor="inv-name">Name</label>
                    <input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={255} placeholder="Apple Inc." className={inputClass} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-surface-300" htmlFor="inv-cur">Current Price <span className="text-surface-500">(optional)</span></label>
                    <input id="inv-cur" type="number" step="0.01" min="0" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} placeholder="175.50" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-surface-300" htmlFor="inv-type">Asset Type</label>
                    <select id="inv-type" value={assetTypeId} onChange={(e) => setAssetTypeId(e.target.value)} className={inputClass}>
                        <option value="">Select type</option>
                        {assetTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-300" htmlFor="inv-currency">Currency</label>
                <input id="inv-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} maxLength={3} placeholder="USD" className={inputClass} />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-300" htmlFor="inv-notes">Notes <span className="text-surface-500">(optional)</span></label>
                <textarea id="inv-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={2000} placeholder="Any notes..." className={`${inputClass} resize-none`} />
            </div>

            <p className="text-xs text-surface-500 bg-surface-800/30 rounded-lg px-3 py-2">
                💡 After creating the investment, record a <strong>buy transaction</strong> to set the quantity and purchase price.
            </p>

            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-surface-700 text-surface-300 hover:text-white hover:bg-surface-800 rounded-xl transition-all text-sm font-medium">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-primary-600/20">
                    {loading ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    );
}
