import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback
} from 'react';
import { useCookies } from 'react-cookie';

import Api from '../../helpers/api';

interface AuthData {
    loading: boolean;
    isLoggedIn: boolean;
    userId: number | null;
    user: Record<string, any> | null;
    bearer: string | null;
}

interface AuthContextData extends AuthData {
    login: (email:string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const defaultAuthData: AuthData = {
    loading: false,
    isLoggedIn: false,
    userId: null,
    user: null,
    bearer: null
};

const AuthContext = createContext<AuthContextData>({
    ...defaultAuthData,
    login: async () => false,
    logout: async () => {}
});

export const AuthProvider:React.FC = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['bearer']);

    const [authData, setAuthData] = useState<AuthData>(defaultAuthData);

    const getUser = async (userId: number) => (
        Api.call({
            method: 'GET',
            route: `/users/${userId}`
        })
    );

    const logout = useCallback(async (callApi: boolean = false) => {
        if (callApi) {
            await Api.call({
                method: 'DELETE',
                route: '/auth'
            });
        }
        removeCookie('bearer');
        Api.bearer = null;
        setAuthData(defaultAuthData);
    }, [
        removeCookie
    ]);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        try {
            const { userId, bearer } = await Api.call({
                method: 'POST',
                route: '/auth',
                body: {
                    email,
                    password
                }
            });
            setCookie('bearer', bearer);
            Api.bearer = bearer;
            const user = await getUser(userId);
            setAuthData({
                loading: false,
                isLoggedIn: true,
                userId,
                user,
                bearer
            });
            return true;
        } catch (err) {
            await logout();
            return false;
        }
    }, [
        logout,
        setCookie
    ]);

    useEffect(() => {
        (async () => {
            try {
                const cookieBearer = cookies.bearer;
                const { userId, bearer } = await Api.call({
                    method: 'GET',
                    route: '/auth',
                    bearer: cookieBearer
                });
                Api.bearer = bearer;
                const user = await getUser(userId);
                setAuthData({
                    loading: false,
                    isLoggedIn: true,
                    userId,
                    user,
                    bearer
                });
            } catch (err: any) {
                await logout();
            }
        })();
    }, [
        logout,
        cookies
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
