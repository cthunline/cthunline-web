import React, {
    createContext,
    useState,
    useContext,
    useMemo,
    useCallback
} from 'react';

import { Locale } from '../../types';
import { ucfirst } from '../../services/tools';

import enTranslations from '../../lang/en.json';
import frTranslations from '../../lang/fr.json';

const translations: Record<Locale, any> = {
    en: enTranslations,
    fr: frTranslations
};

interface TranslationProviderProps {
    children: JSX.Element | JSX.Element[];
}

interface TranslationContextData {
    t: (key: string, data?: Record<string, string>) => string;
    T: (key: string, data?: Record<string, string>) => string;
    changeLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextData>({
    t: () => '',
    T: () => '',
    changeLocale: () => { /* default */ }
});

export const TranslationProvider:React.FC<TranslationProviderProps> = ({
    children
}) => {
    const [locale, setLocale] = useState<Locale>(Locale.en);

    const changeLocale = useCallback((loc: Locale) => {
        if (translations[loc]) {
            setLocale(loc);
        } else {
            throw new Error(`Invalid locale ${loc}`);
        }
    }, []);

    const getTranslation = useCallback((key: string): string => {
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
    }, [locale]);

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

    const t = useCallback((
        key: string,
        data?: Record<string, string>
    ): string => {
        try {
            const translation = getTranslation(key);
            if (data) {
                return replaceVars(translation, data);
            }
            return translation;
        } catch {
            return '';
        }
    }, [
        getTranslation
    ]);

    const T = useCallback((
        key: string,
        data?: Record<string, string>
    ): string => (
        ucfirst(t(key, data))
    ), [t]);

    const contextValue = useMemo(() => ({
        t,
        T,
        changeLocale
    }), [
        t,
        T,
        changeLocale
    ]);

    return (
        <TranslationContext.Provider value={contextValue}>
            {children}
        </TranslationContext.Provider>
    );
};

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within an TranslationProvider');
    }
    return context;
}
