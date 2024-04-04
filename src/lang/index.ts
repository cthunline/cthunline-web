import { type Locale } from '../types';

import enTranslations from './en.json';
import enCoCTranslations from './games/callOfCthulhu/en.json';
import enDnD5Translations from './games/dnd5/en.json';
import enSeventhSeaTranslations from './games/seventhSea/en.json';
import enSWD6Translations from './games/starWarsD6/en.json';
import enWarhammerFantasyTranslations from './games/warhammerFantasy/en.json';

import frTranslations from './fr.json';
import frCoCTranslations from './games/callOfCthulhu/fr.json';
import frDnD5Translations from './games/dnd5/fr.json';
import frSeventhSeaTranslations from './games/seventhSea/fr.json';
import frSWD6Translations from './games/starWarsD6/fr.json';
import frWarhammerFantasyTranslations from './games/warhammerFantasy/fr.json';

const translations: Record<Locale, any> = {
    en: {
        ...enTranslations,
        game: {
            ...enCoCTranslations,
            ...enDnD5Translations,
            ...enSeventhSeaTranslations,
            ...enSWD6Translations,
            ...enWarhammerFantasyTranslations
        }
    },
    fr: {
        ...frTranslations,
        game: {
            ...frCoCTranslations,
            ...frDnD5Translations,
            ...frSeventhSeaTranslations,
            ...frSWD6Translations,
            ...frWarhammerFantasyTranslations
        }
    }
};

export default translations;
