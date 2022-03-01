import {
    useState,
    useEffect,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';
import { CharacterData } from '../../types/api';

interface CharacterHookOptions {
    loadList?: boolean;
}

const useCharacter = ({
    loadList = false
}: CharacterHookOptions = {}) => {
    const { user } = useAuth();

    const [characterList, setCharacterList] = useState<CharacterData[]>([]);

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

    const createCharacter = async (data: object) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/users/${user?.id}/characters`,
                body: data
            });
            if (loadList) {
                await refreshCharacterList();
            }
            toast.success('Character created');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const editCharacter = async (characterId: string, data: object) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/users/${user?.id}/characters/${characterId}`,
                body: data
            });
            if (loadList) {
                await refreshCharacterList();
            }
            toast.success('Character edited');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const deleteCharacter = async (characterId: string) => {
        try {
            await Api.call({
                method: 'DELETE',
                route: `/users/${user?.id}/characters/${characterId}`
            });
            if (loadList) {
                await refreshCharacterList();
            }
            toast.success('Character deleted');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        if (loadList) {
            refreshCharacterList();
        }
    }, [
        loadList,
        refreshCharacterList
    ]);

    return {
        characterList,
        createCharacter,
        editCharacter,
        deleteCharacter
    };
};

export default useCharacter;
