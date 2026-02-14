import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types/auth';
import { authService } from '../services/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    // Hydrate user from stored token on mount
    useEffect(() => {
        const hydrate = async () => {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                setIsLoading(false);
                return;
            }
            try {
                const me = await authService.getMe();
                setUser(me);
                setToken(storedToken);
            } catch {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        hydrate();
    }, []);

    const login = useCallback(async (data: LoginRequest) => {
        const res = await authService.login(data);
        localStorage.setItem('token', res.accessToken);
        setToken(res.accessToken);
        setUser(res.user);
    }, []);

    const register = useCallback(async (data: RegisterRequest) => {
        const res = await authService.register(data);
        localStorage.setItem('token', res.accessToken);
        setToken(res.accessToken);
        setUser(res.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
