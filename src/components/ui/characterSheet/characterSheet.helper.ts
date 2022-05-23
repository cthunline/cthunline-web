import {
    callOfCthulhu,
    dnd5,
    starWarsD6
} from '@cthunline/games';

import { GameId } from '../../../types';

// eslint-disable-next-line import/prefer-default-export
export const getDefaultData = (gameId: string) => {
    if (gameId === GameId.callOfCthulhu) {
        return callOfCthulhu.default;
    }
    if (gameId === GameId.dnd5) {
        return dnd5.default;
    }
    if (gameId === GameId.starWarsD6) {
        return starWarsD6.default;
    }
    throw new Error('Could not get default character data');
};
