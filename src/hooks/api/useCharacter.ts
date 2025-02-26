import { useCallback, useEffect, useState } from 'react';

import { handleApiError } from '../../services/api.js';
import {
    createCharacter as createCharacterRequest,
    deleteCharacter as deleteCharacterRequest,
    deletePortrait as deletePortraitRequest,
    editCharacter as editCharacterRequest,
    getCharacter as getCharacterRequest,
    getCharacters as getCharactersRequest,
    transferCharacter as transferCharacterRequest,
    uploadPortrait as uploadPortraitRequest
} from '../../services/requests/character.js';
import { toast } from '../../services/toast.js';
import { useAuthStore } from '../../stores/auth.js';
import type {
    Character,
    CharacterCreateBody,
    CharacterEditBody,
    PortraitUploadBody
} from '../../types/index.js';

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

interface TransferOptions {
    characterId: number;
    userId: number;
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
    const user = useAuthStore(({ user }) => user);

    const [characterList, setCharacterList] = useState<Character[]>([]);
    const [character, setCharacter] = useState<Character>();

    const getCharacters = useCallback(
        async (userId?: number): Promise<Character[]> => {
            try {
                const characters = await getCharactersRequest(userId);
                return characters;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        []
    );

    const getCharacter = useCallback(
        async (charId: number): Promise<Character> => {
            try {
                return await getCharacterRequest(charId);
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        []
    );

    const refreshCharacter = useCallback(
        async (charId: number) => {
            const char = await getCharacter(charId);
            setCharacter(char);
        },
        [getCharacter]
    );

    const refreshCharacterList = useCallback(async () => {
        if (user.id) {
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
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh]
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
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh]
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
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh]
    );

    const transferCharacter = useCallback(
        async ({
            characterId: charId,
            userId,
            isRefresh = true,
            isToast = true
        }: TransferOptions): Promise<void> => {
            try {
                await transferCharacterRequest(charId, userId);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Character transfered');
                }
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh]
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
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh]
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
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh]
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
        transferCharacter,
        uploadPortrait,
        deletePortrait
    };
};

export default useCharacter;
