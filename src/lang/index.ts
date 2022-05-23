import { Locale } from '../types';

import enTranslations from './en.json';
import enCoCTranslations from './games/callOfCthulhu/en.json';
import enDnD5Translations from './games/dnd5/en.json';
import enSWD6Translations from './games/starWarsD6/en.json';

import frTranslations from './fr.json';
import frCoCTranslations from './games/callOfCthulhu/fr.json';
import frDnD5Translations from './games/dnd5/fr.json';
import frSWD6Translations from './games/starWarsD6/fr.json';

const translations: Record<Locale, any> = {
    en: {
        ...enTranslations,
        game: {
            ...enCoCTranslations,
            ...enDnD5Translations,
            ...enSWD6Translations
        }
    },
    fr: {
        ...frTranslations,
        game: {
            ...frCoCTranslations,
            ...frDnD5Translations,
            ...frSWD6Translations
        }
    }
};

export default translations;
