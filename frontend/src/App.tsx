import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import TransactionsPage from './pages/TransactionsPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={
                    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-6xl font-bold text-surface-700 mb-4">404</h1>
                            <p className="text-surface-400 mb-6">Page not found</p>
                            <a href="/dashboard" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                                Go to Dashboard
                            </a>
                        </div>
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
