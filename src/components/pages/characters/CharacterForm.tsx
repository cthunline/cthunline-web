import React from 'react';
import { useParams } from 'react-router-dom';

import { CharacterData } from '../../../types';
import useCharacter from '../../hooks/useCharacter';
import { CharacterSheet } from '../../ui';

const CharacterForm = () => {
    const { gameId, characterId } = useParams();
    const { character, setCharacter } = useCharacter({
        characterId
    });

    const onChange = (data: CharacterData) => {
        setCharacter((previous) => (previous ? {
            ...previous,
            data
        } : previous));
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
