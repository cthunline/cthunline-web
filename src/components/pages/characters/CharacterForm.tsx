import React, {
    useRef,
    useCallback,
    useEffect,
    useState
} from 'react';
import { useParams } from 'react-router-dom';

import useCharacter from '../../hooks/useCharacter';
import { Character, CharacterData } from '../../../types';
import { CharacterSheet } from '../../ui';

const CharacterForm = () => {
    // const { gameId, characterId } = useParams();
    const { characterId } = useParams();
    const { getCharacter, editCharacter } = useCharacter();

    const [character, setCharacter] = useState<Character>();

    const onChange = useCallback((name: string, data: CharacterData) => {
        setCharacter((previous) => (
            previous ? {
                ...previous,
                name,
                data
            } : previous
        ));
    }, []);

    useEffect(() => {
        (async () => {
            if (characterId) {
                const char = await getCharacter(characterId);
                setCharacter(char);
            }
        })();
    }, [
        characterId,
        getCharacter
    ]);

    const changeTime = 1000;
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (characterId && character) {
            if (changeTimer.current) {
                clearTimeout(changeTimer.current);
            }
            changeTimer.current = setTimeout(() => {
                const { name, data } = character;
                editCharacter({
                    characterId,
                    data: {
                        name,
                        data
                    },
                    isToast: false,
                    isRefresh: false
                });
            }, changeTime);
        }
    }, [
        characterId,
        character,
        editCharacter
    ]);

    return character ? (
        <CharacterSheet
            readonly={false}
            gameId={character.gameId}
            data={character.data}
            onChange={onChange}
        />
    ) : null;
};

export default CharacterForm;
