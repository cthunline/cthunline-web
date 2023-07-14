import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import {
    createCharacter as createCharacterRequest,
    deleteCharacter as deleteCharacterRequest,
    editCharacter as editCharacterRequest,
    getCharacters as getCharactersRequest,
    getCharacter as getCharacterRequest,
    deletePortrait as deletePortraitRequest,
    uploadPortrait as uploadPortraitRequest
} from '../../services/requests/character';

import { useApp } from '../contexts/App';

import {
    Character,
    CharacterCreateBody,
    CharacterEditBody,
    PortraitUploadBody
} from '../../types';

interface CharacterHookOptions {
    loadList?: boolean;
    characterId?: number;
}

interface CreateOptions {
    data: CharacterCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditOptions {
    characterId: number;
    data: CharacterEditBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteOptions {
    characterId: number;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface PortraitUploadOptions {
    characterId: number;
    data: PortraitUploadBody;
    progress?: (percent: number) => void;
    isRefresh?: boolean;
    isToast?: boolean;
}

const useCharacter = ({ loadList, characterId }: CharacterHookOptions = {}) => {
    const { user, handleApiError } = useApp();

    const [characterList, setCharacterList] = useState<Character[]>([]);
    const [character, setCharacter] = useState<Character>();

    const getCharacters = useCallback(
        async (userId?: number): Promise<Character[]> => {
            try {
                const characters = await getCharactersRequest(userId);
                return characters;
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [handleApiError]
    );

    const getCharacter = useCallback(
        async (charId: number): Promise<Character> => {
            try {
                return await getCharacterRequest(charId);
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [handleApiError]
    );

    const refreshCharacter = useCallback(
        async (charId: number) => {
            const char = await getCharacter(charId);
            setCharacter(char);
        },
        [getCharacter]
    );

    const refreshCharacterList = useCallback(async () => {
        if (user?.id) {
            const chars = await getCharacters(user.id);
            setCharacterList(chars);
        }
    }, [user, getCharacters]);

    const refresh = useCallback(async () => {
        const tasks = [];
        if (characterId) {
            tasks.push(refreshCharacter(characterId));
        }
        if (loadList) {
            tasks.push(refreshCharacterList());
        }
        await Promise.all(tasks);
    }, [loadList, characterId, refreshCharacter, refreshCharacterList]);

    const createCharacter = useCallback(
        async ({
            data,
            isRefresh = true,
            isToast = true
        }: CreateOptions): Promise<Character> => {
            try {
                const char = await createCharacterRequest(data);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Character created');
                }
                return char;
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [refresh, handleApiError]
    );

    const editCharacter = useCallback(
        async ({
            characterId: charId,
            data,
            isRefresh = true,
            isToast = true
        }: EditOptions): Promise<Character> => {
            try {
                const char = await editCharacterRequest(charId, data);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Character edited');
                }
                return char;
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [refresh, handleApiError]
    );

    const deleteCharacter = useCallback(
        async ({
            characterId: charId,
            isRefresh = true,
            isToast = true
        }: DeleteOptions): Promise<void> => {
            try {
                await deleteCharacterRequest(charId);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Character deleted');
                }
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [refresh, handleApiError]
    );

    const uploadPortrait = useCallback(
        async ({
            characterId: charId,
            data,
            progress,
            isRefresh = true,
            isToast = true
        }: PortraitUploadOptions): Promise<Character> => {
            try {
                const char = await uploadPortraitRequest({
                    characterId: charId,
                    body: data,
                    progress
                });
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Portrait uploaded');
                }
                return char;
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [refresh, handleApiError]
    );

    const deletePortrait = useCallback(
        async ({
            characterId: charId,
            isRefresh = true,
            isToast = true
        }: DeleteOptions): Promise<Character> => {
            try {
                const char = await deletePortraitRequest(charId);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Portrait deleted');
                }
                return char;
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [refresh, handleApiError]
    );

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        character,
        characterList,
        getCharacter,
        getCharacters,
        createCharacter,
        editCharacter,
        deleteCharacter,
        uploadPortrait,
        deletePortrait
    };
};

export default useCharacter;
