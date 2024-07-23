import { callApi } from '../api.js';

import type {
    Character,
    CharacterCreateBody,
    CharacterEditBody,
    PortraitUploadBody
} from '../../types/index.js';

export const getCharacters = async (userId?: number) => {
    const userParam = userId ? `?user=${userId}` : '';
    const { characters } = await callApi<{ characters: Character[] }>({
        method: 'GET',
        route: `/characters${userParam}`
    });
    return characters;
};

export const getCharacter = async (characterId: number) =>
    callApi<Character>({
        method: 'GET',
        route: `/characters/${characterId}`
    });

export const createCharacter = async (body: CharacterCreateBody) =>
    callApi<Character>({
        method: 'POST',
        route: '/characters',
        body
    });

export const editCharacter = async (
    characterId: number,
    body: CharacterEditBody
) =>
    callApi<Character>({
        method: 'PATCH',
        route: `/characters/${characterId}`,
        body
    });

export const deleteCharacter = async (characterId: number) => {
    await callApi({
        method: 'DELETE',
        route: `/characters/${characterId}`
    });
};

export const transferCharacter = async (
    characterId: number,
    userId: number
) => {
    await callApi({
        method: 'PUT',
        route: `/characters/${characterId}/transfer/${userId}`
    });
};

interface UploadPortraitOptions {
    characterId: number;
    body: PortraitUploadBody;
    progress?: (percent: number) => void;
}

export const uploadPortrait = async ({
    characterId: charId,
    body,
    progress
}: UploadPortraitOptions) => {
    const formData = new FormData();
    formData.append('portrait', body.portrait);
    return await callApi<Character>({
        method: 'POST',
        route: `/characters/${charId}/portrait`,
        body: formData,
        progress
    });
};

export const deletePortrait = async (characterId: number) =>
    callApi<Character>({
        method: 'DELETE',
        route: `/characters/${characterId}/portrait`
    });
