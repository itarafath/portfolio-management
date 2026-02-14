import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative w-full max-w-md">
                <div className="bg-surface-900/80 backdrop-blur-xl border border-surface-700/50 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white">
                            <span className="text-primary-400">Portfolio</span> Dashboard
                        </h1>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
