import {
    CoCCharacterData,
    defaultData as cocDefaultData
} from './games/callOfCthulhu';

export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isEnabled: boolean;
}

export type CharacterData = CoCCharacterData;

export interface Character<GenericCharacterData = CharacterData> {
    id: string;
    userId: string;
    gameId: string;
    name: string;
    data: GenericCharacterData;
}

export interface Game {
    id: string;
    name: string;
}

export const getDefaultData = (gameId: string) => {
    switch (gameId) {
        case 'callOfCthulhu':
            return cocDefaultData;
        default:
            return null;
    }
};
