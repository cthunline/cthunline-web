import {
    apocalypseWorld,
    callOfCthulhu,
    dnd5,
    starWarsD6,
    seventhSea,
    warhammerFantasy
} from '@cthunline/games';

import { GameId } from '../../../types/index.js';

export const getDefaultData = (gameId: string) => {
    if (gameId === GameId.apocalypseWorld) {
        return apocalypseWorld.default;
    }
    if (gameId === GameId.callOfCthulhu) {
        return callOfCthulhu.default;
    }
    if (gameId === GameId.dnd5) {
        return dnd5.default;
    }
    if (gameId === GameId.seventhSea) {
        return seventhSea.default;
    }
    if (gameId === GameId.starWarsD6) {
        return starWarsD6.default;
    }
    if (gameId === GameId.warhammerFantasy) {
        return warhammerFantasy.default;
    }
    throw new Error('Could not get default character data');
};
