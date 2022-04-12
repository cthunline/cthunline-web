import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback,
    useRef
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { User } from '../../types';

interface AuthProviderProps {
    children: JSX.Element | JSX.Element[];
}

interface AuthData {
    isLoading: boolean;
    isLoggedIn: boolean;
    userId: string | null;
    user: User | null;
}

interface AuthContextData extends AuthData {
    login: (email:string, password: string) => Promise<void>;
    logout: (callApi?: boolean) => Promise<void>;
    handleApiError: (err: any) => void;
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
    logout: async () => { /* default */ },
    handleApiError: () => { /* default */ }
});

export const AuthProvider:React.FC<AuthProviderProps> = ({ children }) => {
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
            const { id } = await Api.call({
                method: 'POST',
                route: '/auth',
                data: {
                    email,
                    password
                }
            });
            const user = await getUser(id);
            setAuthData({
                isLoading: false,
                isLoggedIn: true,
                userId: id,
                user
            });
        } catch (err) {
            await logout(false);
            throw err;
        }
    }, [logout]);

    const isAuthError = useRef<boolean>(false);
    const handleApiError = useCallback((err: any): void => {
        if (
            authData.isLoggedIn
            && !isAuthError.current
            && err.response?.status === 401
        ) {
            isAuthError.current = true;
            toast.error('You have been disconnected');
            logout(false);
        } else {
            toast.error(err.message);
        }
    }, [
        authData,
        logout
    ]);

    useEffect(() => {
        if (authData.isLoggedIn) {
            isAuthError.current = false;
        }
    }, [authData.isLoggedIn]);

    useEffect(() => {
        (async () => {
            try {
                const { id } = await Api.call({
                    method: 'GET',
                    route: '/auth'
                });
                const user = await getUser(id);
                setAuthData({
                    isLoading: false,
                    isLoggedIn: true,
                    userId: id,
                    user
                });
            } catch (err: any) {
                await logout(false);
            }
        })();
    }, [logout]);

    const contextValue = useMemo(() => ({
        ...authData,
        login,
        logout,
        handleApiError
    }), [
        authData,
        login,
        logout,
        handleApiError
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
