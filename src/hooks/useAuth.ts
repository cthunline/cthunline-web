import { useState, useEffect, useCallback, useRef } from 'react';

import { getUser } from '../services/requests/user.js';
import { type User } from '../types/index.js';
import { toast } from '../services/toast.js';
import {
    login as loginRequest,
    logout as logoutRequest,
    checkAuth as checkAuthRequest
} from '../services/requests/auth.js';

interface AuthData {
    isLoading: boolean;
    isLoggedIn: boolean;
    userId: number | null;
    user: User | null;
}

export interface AuthHookExport extends AuthData {
    refreshUser: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: (callApi?: boolean) => Promise<void>;
    handleApiError: (err: any) => typeof err;
}

export const defaultAuthHookData: AuthHookExport = {
    isLoading: true,
    isLoggedIn: false,
    userId: null,
    user: null,
    refreshUser: async () => {
        /* default */
    },
    login: async () => {
        /* default */
    },
    logout: async () => {
        /* default */
    },
    handleApiError: () => {
        /* default */
    }
};

const defaultAuthData: AuthData = {
    isLoading: true,
    isLoggedIn: false,
    userId: null,
    user: null
};

const useAuth = () => {
    const [authData, setAuthData] = useState<AuthData>(defaultAuthData);

    const refreshUser = useCallback(async () => {
        if (authData.userId) {
            const user = await getUser(authData.userId);
            setAuthData((previous) => ({
                ...previous,
                user
            }));
        }
    }, [authData.userId]);

    const logout = useCallback(async (callApi: boolean = true) => {
        if (callApi) {
            await logoutRequest();
        }
        setAuthData({
            ...defaultAuthData,
            isLoading: false
        });
    }, []);

    const login = useCallback(
        async (email: string, password: string): Promise<void> => {
            try {
                const user = await loginRequest({
                    email,
                    password
                });
                setAuthData({
                    isLoading: false,
                    isLoggedIn: true,
                    userId: user.id,
                    user
                });
            } catch (err) {
                await logout(false);
                throw err;
            }
        },
        [logout]
    );

    const isAuthError = useRef<boolean>(false);
    const handleApiError = useCallback(
        (err: any): typeof err => {
            if (
                authData.isLoggedIn &&
                !isAuthError.current &&
                err.response?.status === 401
            ) {
                isAuthError.current = true;
                toast.error('You have been disconnected');
                logout(false);
            } else {
                toast.error(err?.response?.data?.error ?? err.message);
            }
            return err;
        },
        [authData, logout]
    );

    useEffect(() => {
        if (authData.isLoggedIn) {
            isAuthError.current = false;
        }
    }, [authData.isLoggedIn]);

    useEffect(() => {
        (async () => {
            try {
                const user = await checkAuthRequest();
                setAuthData({
                    isLoading: false,
                    isLoggedIn: true,
                    userId: user.id,
                    user
                });
            } catch (err: any) {
                await logout(false);
            }
        })();
    }, [logout]);

    return {
        ...authData,
        refreshUser,
        login,
        logout,
        handleApiError
    };
};

export default useAuth;
