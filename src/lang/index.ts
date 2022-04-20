import { Locale } from '../types';

import enTranslations from './en.json';
import enCoCTranslations from './games/callOfCthulhu/en.json';

import frTranslations from './fr.json';
import frCoCTranslations from './games/callOfCthulhu/fr.json';

const translations: Record<Locale, any> = {
    en: {
        ...enTranslations,
        game: {
            ...enCoCTranslations
        }
    },
    fr: {
        ...frTranslations,
        game: {
            ...frCoCTranslations
        }
    }
};

export default translations;
