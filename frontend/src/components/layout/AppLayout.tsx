import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
            ? 'bg-primary-600/20 text-primary-400 shadow-lg shadow-primary-600/5'
            : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'
        }`;

    return (
        <div className="min-h-screen bg-surface-950 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-surface-800/50 bg-surface-900/30 backdrop-blur-xl flex flex-col fixed h-full">
                <div className="p-6 border-b border-surface-800/50">
                    <h1 className="text-lg font-bold text-white">
                        <span className="text-primary-400">Portfolio</span> Dashboard
                    </h1>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-1">
                    <NavLink to="/dashboard" className={linkClasses}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                    </NavLink>
                    <NavLink to="/transactions" className={linkClasses}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Transactions
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-surface-800/50">
                    <div className="flex items-center gap-3 px-3 py-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center text-primary-400 text-sm font-semibold">
                            {user?.firstName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-200 truncate">
                                {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.email}
                            </p>
                            <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:text-loss hover:bg-loss/10 transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
