import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback
} from 'react';

import Api from '../../services/api';
import { User } from '../../types';

interface AuthData {
    isLoading: boolean;
    isLoggedIn: boolean;
    userId: string | null;
    user: User | null;
}

interface AuthContextData extends AuthData {
    login: (email:string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const defaultAuthData: AuthData = {
    isLoading: true,
    isLoggedIn: false,
    userId: null,
    user: null
};

const AuthContext = createContext<AuthContextData>({
    ...defaultAuthData,
    login: async () => { /* default */ },
    logout: async () => { /* default */ }
});

export const AuthProvider:React.FC = ({ children }) => {
    const [authData, setAuthData] = useState<AuthData>(defaultAuthData);

    const getUser = async (userId: number) => (
        Api.call({
            method: 'GET',
            route: `/users/${userId}`
        })
    );

    const logout = useCallback(async (callApi: boolean = true) => {
        if (callApi) {
            await Api.call({
                method: 'DELETE',
                route: '/auth'
            });
        }
        setAuthData({
            ...defaultAuthData,
            isLoading: false
        });
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            const { userId } = await Api.call({
                method: 'POST',
                route: '/auth',
                data: {
                    email,
                    password
                }
            });
            const user = await getUser(userId);
            setAuthData({
                isLoading: false,
                isLoggedIn: true,
                userId,
                user
            });
        } catch (err) {
            await logout(false);
            throw err;
        }
    }, [
        logout
    ]);

    useEffect(() => {
        (async () => {
            try {
                const { userId } = await Api.call({
                    method: 'GET',
                    route: '/auth'
                });
                const user = await getUser(userId);
                setAuthData({
                    isLoading: false,
                    isLoggedIn: true,
                    userId,
                    user
                });
            } catch (err: any) {
                await logout(false);
            }
        })();
    }, [
        logout
    ]);

    const contextValue = useMemo(() => ({
        ...authData,
        login,
        logout
    }), [
        authData,
        login,
        logout
    ]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
