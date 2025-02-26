import { useEffect, useMemo } from 'react';

import { useAuthStore } from '../stores/auth.js';
import { useConfigurationStore } from '../stores/configuration.js';
import { useLocaleStore } from '../stores/locale.js';

export const useApp = () => {
    const isLoggedIn = useAuthStore(({ isLoggedIn }) => isLoggedIn);
    const userTheme = useAuthStore(({ user: { theme } }) => theme);
    const userLocale = useAuthStore(({ user: { locale } }) => locale);
    const changeLocale = useLocaleStore(({ changeLocale }) => changeLocale);
    const defaultTheme = useConfigurationStore(
        ({ defaultTheme }) => defaultTheme
    );
    const defaultLocale = useConfigurationStore(
        ({ defaultLocale }) => defaultLocale
    );

    const theme = useMemo(
        () => (isLoggedIn ? userTheme : defaultTheme),
        [isLoggedIn, userTheme, defaultTheme]
    );

    const locale = useMemo(
        () => (isLoggedIn ? userLocale : defaultLocale),
        [isLoggedIn, userLocale, defaultLocale]
    );

    useEffect(() => {
        changeLocale(locale);
    }, [locale, changeLocale]);

    return {
        theme,
        locale
    };
};
