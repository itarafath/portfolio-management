import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await api.post('/auth/login', data);
        return res.data.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const res = await api.post('/auth/register', data);
        return res.data.data;
    },

    getMe: async (): Promise<User> => {
        const res = await api.get('/auth/me');
        return res.data.data;
    },
};
