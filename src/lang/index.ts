import { Locale } from '../types';

import enTranslations from './en.json';
import enCoCTranslations from './games/callOfCthulhu/en.json';
import enSWD6Translations from './games/starWarsD6/en.json';

import frTranslations from './fr.json';
import frCoCTranslations from './games/callOfCthulhu/fr.json';
import frSWD6Translations from './games/starWarsD6/fr.json';

const translations: Record<Locale, any> = {
    en: {
        ...enTranslations,
        game: {
            ...enCoCTranslations,
            ...enSWD6Translations
        }
    },
    fr: {
        ...frTranslations,
        game: {
            ...frCoCTranslations,
            ...frSWD6Translations
        }
    }
};

export default translations;
