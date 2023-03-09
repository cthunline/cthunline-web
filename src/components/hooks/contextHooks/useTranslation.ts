import { useState, useCallback } from 'react';

import { Locale } from '../../../types';
import { ucfirst } from '../../../services/tools';

import translations from '../../../lang';

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
    const [locale, setLocale] = useState<Locale>(Locale.en);

    const changeLocale = useCallback((loc: Locale) => {
        if (translations[loc]) {
            setLocale(loc);
        } else {
            throw new Error(`Invalid locale ${loc}`);
        }
    }, []);

    const getTranslation = useCallback(
        (key: string): string => {
            const keys = key.split('.');
            let value = translations[locale];
            keys.forEach((keyPart) => {
                if (value[keyPart]) {
                    value = value[keyPart];
                } else {
                    throw new Error(
                        `Translation not found for key ${key} and locale ${locale}`
                    );
                }
            });
            if (typeof value !== 'string') {
                throw new Error(
                    `Invalid translation value for key ${key} and locale ${locale}`
                );
            }
            return value;
        },
        [locale]
    );

    const replaceVars = (
        translation: string,
        data: Record<string, string>
    ): string => {
        let replaced = translation;
        Object.entries(data).forEach(([name, text]) => {
            replaced = replaced.replaceAll(`{${name}}`, text);
        });
        return replaced;
    };

    // lowercase translation text
    const t = useCallback(
        (key: string, data?: Record<string, string>): string => {
            try {
                const translation = getTranslation(key);
                if (data) {
                    return replaceVars(translation, data);
                }
                return translation;
            } catch {
                return '';
            }
        },
        [getTranslation]
    );

    // translation text with first char uppercased
    const T = useCallback(
        (key: string, data?: Record<string, string>): string =>
            ucfirst(t(key, data)),
        [t]
    );

    // uppercased translation text
    const TU = useCallback(
        (key: string, data?: Record<string, string>): string =>
            t(key, data).toLocaleUpperCase(),
        [t]
    );

    return {
        t,
        T,
        TU,
        changeLocale
    };
};

export default useTranslation;
