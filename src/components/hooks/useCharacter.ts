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

const useCharacter = ({
    loadList = false,
    characterId
}: CharacterHookOptions = {}) => {
    const { user } = useAuth();

    const [characterList, setCharacterList] = useState<Character[]>([]);
    const [character, setCharacter] = useState<Character>();

    const refreshCharacter = useCallback(async (charId: string) => {
        try {
            const char = await Api.call({
                method: 'GET',
                route: `/users/${user?.id}/characters/${charId}`
            });
            setCharacter(char);
        } catch (err: any) {
            toast.error(err.message);
        }
    }, [
        user
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
        user
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

    const createCharacter = async (data: object) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/users/${user?.id}/characters`,
                body: data
            });
            await refresh();
            toast.success('Character created');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const editCharacter = async (charId: string, data: object) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/users/${user?.id}/characters/${charId}`,
                body: data
            });
            await refresh();
            toast.success('Character edited');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const deleteCharacter = async (charId: string) => {
        try {
            await Api.call({
                method: 'DELETE',
                route: `/users/${user?.id}/characters/${charId}`
            });
            await refresh();
            toast.success('Character deleted');
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
