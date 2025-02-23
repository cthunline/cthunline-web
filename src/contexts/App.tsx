import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import useAuth, {
    type AuthHookExport,
    defaultAuthHookData
} from '../hooks/useAuth.js';
import useConfiguration, {
    type ConfigurationHookExport,
    defaultConfigurationHookData
} from '../hooks/useConfiguration.js';
import useTranslation, {
    type TranslationHookExport,
    defaultTranslationHookData
} from '../hooks/useTranslation.js';
import type { Theme } from '../types/index.js';

interface AppProviderProps {
    children: React.ReactElement | React.ReactElement[];
}

type AppHookExports = AuthHookExport &
    ConfigurationHookExport &
    TranslationHookExport;

interface AppContextData extends AppHookExports {
    initialized: boolean;
    theme: Theme;
}

const defaultContextData: AppContextData = {
    initialized: false,
    theme: 'dark',
    ...defaultAuthHookData,
    ...defaultConfigurationHookData,
    ...defaultTranslationHookData
};

const AppContext = createContext<AppContextData>(defaultContextData);

export const AppProvider = ({ children }: AppProviderProps) => {
    const {
        refreshUser,
        isLoading,
        isLoggedIn,
        userId,
        user,
        login,
        logout,
        handleApiError
    } = useAuth();
    const { configuration, refreshConfiguration } = useConfiguration();
    const { t, T, TU, changeLocale } = useTranslation();

    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        changeLocale(user?.locale ?? configuration.defaultLocale);
    }, [changeLocale, configuration.defaultLocale, user?.locale]);

    useEffect(
        () => setTheme(user?.theme ?? configuration.defaultTheme),
        [configuration.defaultTheme, user?.theme]
    );

    const contextValue = useMemo(
        () => ({
            initialized: true,
            theme,
            refreshUser,
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
        }),
        [
            theme,
            refreshUser,
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
        ]
    );

    return <AppContext value={contextValue}>{children}</AppContext>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context?.initialized) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
