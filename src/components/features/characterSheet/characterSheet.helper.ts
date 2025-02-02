import {
    alien,
    apocalypseWorld,
    callOfCthulhu,
    dnd5,
    seventhSea,
    starWarsD6,
    warhammerFantasy
} from '@cthunline/games';

export const getDefaultData = (gameId: string) => {
    if (gameId === 'alien') {
        return alien.default;
    }
    if (gameId === 'apocalypseWorld') {
        return apocalypseWorld.default;
    }
    if (gameId === 'callOfCthulhu') {
        return callOfCthulhu.default;
    }
    if (gameId === 'dnd5') {
        return dnd5.default;
    }
    if (gameId === 'seventhSea') {
        return seventhSea.default;
    }
    if (gameId === 'starWarsD6') {
        return starWarsD6.default;
    }
    if (gameId === 'warhammerFantasy') {
        return warhammerFantasy.default;
    }
    throw new Error('Could not get default character data');
};
