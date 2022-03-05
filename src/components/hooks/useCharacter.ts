import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';
import { Character } from '../../types';

interface CharacterHookOptions {
    loadList?: boolean;
    characterId?: string;
}

interface CreateOptions {
    data: Omit<Character, 'id' | 'userId'>;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditOptions {
    characterId: string;
    data: Omit<Character, 'id' | 'userId' | 'gameId'>;
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

    const refreshCharacter = useCallback(async (charId: string) => {
        try {
            const char = await Api.call({
                method: 'GET',
                route: `/characters/${charId}`
            });
            setCharacter(char);
        } catch (err: any) {
            toast.error(err.message);
        }
    }, [
        setCharacter
    ]);

    const refreshCharacterList = useCallback(async () => {
        try {
            const { characters } = await Api.call({
                method: 'GET',
                route: `/users/${user?.id}/characters`
            });
            setCharacterList(characters);
        } catch (err: any) {
            toast.error(err.message);
        }
    }, [
        user,
        setCharacterList
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

    const createCharacter = async ({
        data,
        isRefresh = true,
        isToast = true
    }: CreateOptions) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/users/${user?.id}/characters`,
                body: data
            });
            if (isRefresh) {
                await refresh();
            }
            if (isToast) {
                toast.success('Character created');
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const editCharacter = async ({
        characterId: charId,
        data,
        isRefresh = true,
        isToast = true
    }: EditOptions) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/characters/${charId}`,
                body: data
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
    };

    const deleteCharacter = async ({
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
    };

    useEffect(() => {
        refresh();
    }, [
        refresh
    ]);

    return {
        character,
        characterList,
        createCharacter,
        editCharacter,
        deleteCharacter
    };
};

export default useCharacter;
