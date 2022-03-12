import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';
import {
    Character,
    CharacterCreateBody,
    CharacterEditBody
} from '../../types';

interface CharacterHookOptions {
    loadList?: boolean;
    characterId?: string;
}

interface CreateOptions {
    data: CharacterCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditOptions {
    characterId: string;
    data: CharacterEditBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteOptions {
    characterId: string;
    isRefresh?: boolean;
    isToast?: boolean;
}

const useCharacter = ({
    loadList,
    characterId
}: CharacterHookOptions = {}) => {
    const { user } = useAuth();

    const [characterList, setCharacterList] = useState<Character[]>([]);
    const [character, setCharacter] = useState<Character>();

    const getCharacters = useCallback(async (userId: string) => {
        try {
            const { characters } = await Api.call({
                method: 'GET',
                route: `/users/${userId}/characters`
            });
            return characters;
        } catch (err: any) {
            toast.error(err.message);
            return undefined;
        }
    }, []);

    const getCharacter = useCallback(async (charId: string) => {
        try {
            const char = await Api.call({
                method: 'GET',
                route: `/characters/${charId}`
            });
            return char;
        } catch (err: any) {
            toast.error(err.message);
            return undefined;
        }
    }, []);

    const refreshCharacter = useCallback(async (charId: string) => {
        const char = await getCharacter(charId);
        if (char) {
            setCharacter(char);
        }
    }, [
        getCharacter
    ]);

    const refreshCharacterList = useCallback(async () => {
        if (user?.id) {
            const chars = await getCharacters(user.id);
            if (chars) {
                setCharacterList(chars);
            }
        }
    }, [
        user,
        getCharacters
    ]);

    const refresh = useCallback(async () => {
        const tasks = [];
        if (characterId) {
            tasks.push(
                refreshCharacter(characterId)
            );
        }
        if (loadList) {
            tasks.push(
                refreshCharacterList()
            );
        }
        await Promise.all(tasks);
    }, [
        loadList,
        characterId,
        refreshCharacter,
        refreshCharacterList
    ]);

    const createCharacter = useCallback(async ({
        data,
        isRefresh = true,
        isToast = true
    }: CreateOptions): Promise<Character | null> => {
        try {
            const char = await Api.call({
                method: 'POST',
                route: `/users/${user?.id}/characters`,
                data
            });
            if (isRefresh) {
                await refresh();
            }
            if (isToast) {
                toast.success('Character created');
            }
            return char;
        } catch (err: any) {
            toast.error(err.message);
            return null;
        }
    }, [
        refresh,
        user
    ]);

    const editCharacter = useCallback(async ({
        characterId: charId,
        data,
        isRefresh = true,
        isToast = true
    }: EditOptions) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/characters/${charId}`,
                data
            });
            if (isRefresh) {
                await refresh();
            }
            if (isToast) {
                toast.success('Character edited');
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    }, [
        refresh
    ]);

    const deleteCharacter = useCallback(async ({
        characterId: charId,
        isRefresh = true,
        isToast = true
    }: DeleteOptions) => {
        try {
            await Api.call({
                method: 'DELETE',
                route: `/characters/${charId}`
            });
            if (isRefresh) {
                await refresh();
            }
            if (isToast) {
                toast.success('Character deleted');
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    }, [
        refresh
    ]);

    useEffect(() => {
        refresh();
    }, [
        refresh
    ]);

    return {
        character,
        characterList,
        getCharacter,
        getCharacters,
        createCharacter,
        editCharacter,
        deleteCharacter
    };
};

export default useCharacter;
