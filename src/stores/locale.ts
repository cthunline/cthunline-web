import {
    type Locale,
    getTranslation,
    locales
} from '@pitininja/vite-translations-client';
import { create } from 'zustand';

type LocaleStoreStates = {
    locale: Locale;
    changeLocale: (loc: Locale) => void;
    t: (key: string, data?: Record<string, string>) => string;
    T: (key: string, data?: Record<string, string>) => string;
    TU: (key: string, data?: Record<string, string>) => string;
};

export const useLocaleStore = create<LocaleStoreStates>()((set, get) => ({
    locale: 'en',
    changeLocale: (locale: Locale) => {
        if (locales.includes(locale)) {
            set({ locale });
        } else {
            throw new Error(`Invalid locale ${locale}`);
        }
    },
    t: (key: string, data?: Record<string, string>): string =>
        getTranslation(get().locale, key, 'raw', data),

    // translation text with first char uppercased
    T: (key: string, data?: Record<string, string>): string =>
        getTranslation(get().locale, key, 'ucfirst', data),

    // uppercased translation text
    TU: (key: string, data?: Record<string, string>): string =>
        getTranslation(get().locale, key, 'uppercase', data)
}));
