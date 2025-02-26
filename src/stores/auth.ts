import { create } from 'zustand';

import {
    checkAuth as checkAuthRequest,
    login as loginRequest,
    logout as logoutRequest
} from '../services/requests/auth.js';
import { getUser as getUserRequest } from '../services/requests/user.js';
import type { User } from '../types/index.js';

type AuthStoreStates = {
    isLoading: boolean;
    isLoggedIn: boolean;
    user: User;
};

type AuthStoreMethods = {
    checkAuth: () => Promise<void>;
    refreshUser: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: (callApi?: boolean) => Promise<void>;
};

type AuthStore = AuthStoreStates & AuthStoreMethods;

const defaultAuthStoreStates: AuthStoreStates = {
    isLoading: true,
    isLoggedIn: false,
    user: {
        id: 0,
        name: '',
        email: '',
        theme: 'dark',
        locale: 'fr',
        isAdmin: false,
        isEnabled: true,
        createdAt: '',
        updatedAt: ''
    }
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
    ...defaultAuthStoreStates,
    refreshUser: async () => {
        const { id: userId } = get().user;
        if (userId) {
            const user = await getUserRequest(userId);
            set((prev) => ({ ...prev, user }));
        }
    },
    checkAuth: async () => {
        try {
            const user = await checkAuthRequest();
            set({
                isLoading: false,
                isLoggedIn: true,
                user
            });
        } catch {
            get().logout(false);
        }
    },
    logout: async (callApi = true) => {
        if (callApi) {
            await logoutRequest();
        }
        set({
            ...defaultAuthStoreStates,
            isLoading: false
        });
    },
    login: async (email: string, password: string): Promise<void> => {
        try {
            const user = await loginRequest({
                email,
                password
            });
            set({
                isLoading: false,
                isLoggedIn: true,
                user
            });
        } catch (err) {
            get().logout(false);
            throw err;
        }
    }
}));
