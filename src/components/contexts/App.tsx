import React, {
    createContext,
    useContext,
    useEffect,
    useMemo
} from 'react';

import useAuth, {
    AuthHookExport,
    defaultAuthHookData
} from '../hooks/contextHooks/useAuth';
import useConfiguration, {
    ConfigurationHookExport,
    defaultConfigurationHookData
} from '../hooks/contextHooks/useConfiguration';
import useTranslation, {
    TranslationHookExport,
    defaultTranslationHookData
} from '../hooks/contextHooks/useTranslation';

interface AppProviderProps {
    children: JSX.Element | JSX.Element[];
}

type AppContextData = (
    AuthHookExport
    & ConfigurationHookExport
    & TranslationHookExport
);

const defaultDialogData: AppContextData = {
    ...defaultAuthHookData,
    ...defaultConfigurationHookData,
    ...defaultTranslationHookData
};

const AppContext = createContext<AppContextData>(defaultDialogData);

export const AppProvider:React.FC<AppProviderProps> = ({ children }) => {
    const {
        isLoading,
        isLoggedIn,
        userId,
        user,
        login,
        logout,
        handleApiError
    } = useAuth();
    const {
        configuration,
        refreshConfiguration
    } = useConfiguration();
    const {
        t,
        T,
        TU,
        changeLocale
    } = useTranslation();

    useEffect(() => {
        changeLocale(user?.locale ?? configuration.defaultLocale);
    }, [
        changeLocale,
        configuration.defaultLocale,
        user?.locale
    ]);

    const contextValue = useMemo(() => ({
        isLoading,
        isLoggedIn,
        userId,
        user,
        login,
        logout,
        handleApiError,
        configuration,
        refreshConfiguration,
        t,
        T,
        TU,
        changeLocale
    }), [
        isLoading,
        isLoggedIn,
        userId,
        user,
        login,
        logout,
        handleApiError,
        configuration,
        refreshConfiguration,
        t,
        T,
        TU,
        changeLocale
    ]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
