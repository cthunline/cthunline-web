import React from 'react';
import { Paper } from '@mui/material';

import CoCSheet from './callOfCthulhu/CoCSheet';
import { CharacterData } from '../../../types';

import './CharacterSheet.css';

export interface CharacterSheetProps {
    readonly: boolean;
    gameId: string;
    data: CharacterData;
    onChange?: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({
    readonly,
    gameId,
    data,
    onChange = () => { /* default */ }
}) => {
    const getContent = (): JSX.Element => {
        if (gameId === 'callOfCthulhu') {
            return (
                <CoCSheet
                    readonly={readonly}
                    data={data}
                    onChange={onChange}
                />
            );
        }
        throw new Error('Could not get character sheet content');
    };

    return (
        <Paper elevation={3} className="character-sheet box scroll">
            {getContent()}
        </Paper>
    );
};

export default CharacterSheet;
