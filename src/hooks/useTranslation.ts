import { useState, useCallback } from 'react';
import {
    getTranslation,
    locales,
    type Locale
} from '@pitininja/vite-translations-client';

export interface TranslationHookExport {
    t: (key: string, data?: Record<string, string>) => string;
    T: (key: string, data?: Record<string, string>) => string;
    TU: (key: string, data?: Record<string, string>) => string;
    changeLocale: (locale: Locale) => void;
}

export const defaultTranslationHookData: TranslationHookExport = {
    t: () => '',
    T: () => '',
    TU: () => '',
    changeLocale: () => {
        /* default */
    }
};

const useTranslation = () => {
    const [locale, setLocale] = useState<Locale>('en');

    const changeLocale = useCallback((loc: Locale) => {
        if (locales.includes(loc)) {
            setLocale(loc);
        } else {
            throw new Error(`Invalid locale ${loc}`);
        }
    }, []);

    // lowercase translation text
    const t = useCallback(
        (key: string, data?: Record<string, string>): string =>
            getTranslation(locale, key, 'raw', data),
        [locale]
    );

    // translation text with first char uppercased
    const T = useCallback(
        (key: string, data?: Record<string, string>): string =>
            getTranslation(locale, key, 'ucfirst', data),
        [locale]
    );

    // uppercased translation text
    const TU = useCallback(
        (key: string, data?: Record<string, string>): string =>
            getTranslation(locale, key, 'uppercase', data),
        [locale]
    );

    return {
        t,
        T,
        TU,
        changeLocale
    };
};

export default useTranslation;
