import React, {
    useRef,
    useCallback,
    useEffect,
    useState
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import useCharacter from '../../hooks/useCharacter';
import { CharacterSheet } from '../../ui';
import { Character, CharacterData } from '../../../types';
import { getDefaultData } from '../../ui/characterSheet/characterSheet.helper';

interface CharacterFormProps {
    create?: boolean;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ create }) => {
    const navigate = useNavigate();
    const { characterId, gameId } = useParams();
    const {
        getCharacter,
        editCharacter,
        createCharacter
    } = useCharacter();

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
            if (create && gameId) {
                const char = await createCharacter({
                    data: {
                        gameId,
                        name: '[No Name]',
                        data: getDefaultData(gameId)
                    },
                    isRefresh: false,
                    isToast: false
                });
                navigate(`/characters/${char.id}`, {
                    replace: true
                });
            } else if (characterId) {
                const char = await getCharacter(characterId);
                setCharacter(char);
            }
        })();
    }, [
        create,
        navigate,
        characterId,
        gameId,
        getCharacter,
        createCharacter
    ]);

    const changeTime = 1000;
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initialRender = useRef(true);
    useEffect(() => {
        if (character) {
            if (initialRender.current) {
                initialRender.current = false;
            } else {
                if (changeTimer.current) {
                    clearTimeout(changeTimer.current);
                }
                changeTimer.current = setTimeout(() => {
                    const { name, data } = character;
                    editCharacter({
                        characterId: character.id,
                        data: {
                            name,
                            data
                        },
                        isToast: false,
                        isRefresh: false
                    });
                }, changeTime);
            }
        }
    }, [
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
    ) : (
        <CircularProgress size={100} />
    );
};

export default CharacterForm;
