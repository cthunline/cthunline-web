import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
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
import { Theme } from '../../types';

interface AppProviderProps {
    children: JSX.Element | JSX.Element[];
}

type AppHookExports = AuthHookExport &
    ConfigurationHookExport &
    TranslationHookExport;

interface AppContextData extends AppHookExports {
    theme: Theme;
}

const defaultDialogData: AppContextData = {
    theme: Theme.dark,
    ...defaultAuthHookData,
    ...defaultConfigurationHookData,
    ...defaultTranslationHookData
};

const AppContext = createContext<AppContextData>(defaultDialogData);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
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

    const [theme, setTheme] = useState<Theme>(Theme.dark);

    useEffect(() => {
        changeLocale(user?.locale ?? configuration.defaultLocale);
    }, [changeLocale, configuration.defaultLocale, user?.locale]);

    useEffect(
        () => setTheme(user?.theme ?? configuration.defaultTheme),
        [configuration.defaultTheme, user?.theme]
    );

    const contextValue = useMemo(
        () => ({
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
