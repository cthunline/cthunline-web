import { useRef, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@mantine/core';

import CharacterSheet from '../../features/characterSheet/CharacterSheet';
import { type Character, type CharacterData } from '../../../types';
import { deepEqual } from '../../../services/tools';
import useCharacter from '../../hooks/useCharacter';

const CharacterForm = () => {
    const { characterId: paramCharId } = useParams();
    const { getCharacter, editCharacter, uploadPortrait, deletePortrait } =
        useCharacter();

    const characterId = Number(paramCharId);

    const [character, setCharacter] = useState<Character>();

    const onChange = useCallback(
        (name: string, data: CharacterData) => {
            const changeData = {
                ...character,
                name,
                data
            };
            if (!deepEqual(changeData, character)) {
                setCharacter((previous) =>
                    previous
                        ? {
                              ...previous,
                              name,
                              data
                          }
                        : previous
                );
            }
        },
        [character]
    );

    const skipEdit = useRef(false);
    const onPortraitChange = useCallback(
        async (file: File | null) => {
            const options = {
                characterId,
                isToast: false,
                isRefresh: false
            };
            let updatedPortrait: string | null = null;
            if (file) {
                const { portrait } = await uploadPortrait({
                    ...options,
                    data: {
                        portrait: file
                    }
                });
                updatedPortrait = portrait;
            } else {
                await deletePortrait(options);
            }
            skipEdit.current = true;
            setCharacter((previous) =>
                previous
                    ? {
                          ...previous,
                          portrait: updatedPortrait
                      }
                    : previous
            );
        },
        [characterId, uploadPortrait, deletePortrait]
    );

    useEffect(() => {
        (async () => {
            if (characterId) {
                const char = await getCharacter(characterId);
                setCharacter(char);
            }
        })();
    }, [characterId, getCharacter]);

    const initialRender = useRef(true);
    useEffect(() => {
        if (character) {
            if (initialRender.current) {
                initialRender.current = false;
            } else if (skipEdit.current) {
                skipEdit.current = false;
            } else {
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
            }
        }
    }, [character, editCharacter]);

    return character ? (
        <CharacterSheet
            readonly={false}
            gameId={character.gameId}
            data={character.data}
            onChange={onChange}
            portrait={character.portrait}
            onPortraitChange={onPortraitChange}
        />
    ) : (
        <Loader size="xl" />
    );
};

export default CharacterForm;
