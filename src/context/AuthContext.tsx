import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { client } from '../api/client';
import type { User, ApiResponse } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (name: string, email: string, pass: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Helper to decode token or just assume user data is stored/fetched. 
    // Ideally, we have a /profile endpoint.
    // Context says: Payload includes sub, email, role.
    // We can parse the JWT payload to get initial user data.

    const parseJwt = (token: string): User | null => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            return {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                name: payload.name || '', // Payload might not have name, but let's assume or fetch.
            };
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            const u = parseJwt(token);
            if (u) {
                setUser(u);
            } else {
                localStorage.removeItem('token');
                setToken(null);
            }
        }
        setIsLoading(false);
    }, [token]);

    const login = async (email: string, pass: string) => {
        const res = await client.post<ApiResponse<any>>('/auth/login', { email, password: pass });
        if (res.data.success) {
            // Assuming res.data.data is { access_token: string } or similar
            const accessToken = res.data.data.accessToken;
            localStorage.setItem('token', accessToken);
            setToken(accessToken);
        }
    };

    const register = async (name: string, email: string, pass: string) => {
        // Register endpoint usually returns the created user or token.
        // If it just registers, we might need to login afterwards.
        // Let's assume it returns success and we then login.
        await client.post<ApiResponse<any>>('/auth/register', { name, email, password: pass });
        // Auto-login
        await login(email, pass);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
