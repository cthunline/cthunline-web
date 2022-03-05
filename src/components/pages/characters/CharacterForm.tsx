import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';

import useCharacter from '../../hooks/useCharacter';
import { CharacterData } from '../../../types';
import { CharacterSheet } from '../../ui';

const CharacterForm = () => {
    const { gameId, characterId } = useParams();
    const { character, editCharacter } = useCharacter({
        characterId
    });

    const changeTime = 1000;
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onChange = (data: CharacterData) => {
        if (characterId) {
            if (changeTimer.current) {
                clearTimeout(changeTimer.current);
            }
            changeTimer.current = setTimeout(() => {
                const { name, occupation } = data.biography;
                editCharacter({
                    characterId,
                    data: {
                        name: `${name} (${occupation})`,
                        data
                    },
                    isRefresh: false,
                    isToast: false
                });
            }, changeTime);
        }
    };

    return character ? (
        <CharacterSheet
            readonly={false}
            gameId={character?.gameId ?? String(gameId)}
            data={character?.data}
            onChange={onChange}
        />
    ) : null;
};

export default CharacterForm;
