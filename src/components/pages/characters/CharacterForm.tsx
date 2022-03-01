import React from 'react';
import { useParams } from 'react-router-dom';

const CharacterForm = () => {
    const { gameId } = useParams();

    const text = `Game: ${gameId}`;

    return (
        <div>{text}</div>
    );
};

export default CharacterForm;
