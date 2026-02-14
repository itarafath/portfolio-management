import { useState, type FormEvent } from 'react';

interface PortfolioFormProps {
    onSubmit: (data: { name: string; description?: string }) => Promise<void>;
    onCancel: () => void;
    initialData?: { name: string; description?: string };
    submitLabel?: string;
}

export default function PortfolioForm({ onSubmit, onCancel, initialData, submitLabel = 'Create' }: PortfolioFormProps) {
    const [name, setName] = useState(initialData?.name ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onSubmit({ name, description: description || undefined });
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-loss/10 border border-loss/30 text-loss text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-300" htmlFor="pf-name">Name</label>
                <input
                    id="pf-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={255}
                    placeholder="e.g. Tech Stocks"
                    className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-white placeholder-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-300" htmlFor="pf-desc">Description <span className="text-surface-500">(optional)</span></label>
                <textarea
                    id="pf-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="A brief description of this portfolio"
                    className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700/50 rounded-xl text-white placeholder-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm resize-none"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2.5 border border-surface-700 text-surface-300 hover:text-white hover:bg-surface-800 rounded-xl transition-all text-sm font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-primary-600/20"
                >
                    {loading ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    );
}
