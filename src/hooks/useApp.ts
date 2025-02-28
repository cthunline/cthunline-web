import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '../stores/auth.js';
import { useConfigurationStore } from '../stores/configuration.js';
import { useLocaleStore } from '../stores/locale.js';

export const useApp = () => {
    const changeLocale = useLocaleStore(({ changeLocale }) => changeLocale);
    const { isLoggedIn, userTheme, userLocale } = useAuthStore(
        useShallow(({ isLoggedIn, user: { theme, locale } }) => ({
            isLoggedIn,
            userTheme: theme,
            userLocale: locale
        }))
    );
    const { defaultTheme, defaultLocale } = useConfigurationStore(
        useShallow(({ defaultTheme, defaultLocale }) => ({
            defaultTheme,
            defaultLocale
        }))
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
