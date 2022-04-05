import React from 'react';
import { Paper } from '@mui/material';

import { CharacterData } from '../../../types';
import CoCSheet from './callOfCthulhu/CoCSheet';
import { CoCCharacterData } from '../../../types/games/callOfCthulhu';
import SWD6Sheet from './starWarsD6/SWD6Sheet';
import { SWD6CharacterData } from '../../../types/games/starWarsD6';

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
                    data={data as CoCCharacterData}
                    onChange={onChange}
                />
            );
        }
        if (gameId === 'starWarsD6') {
            return (
                <SWD6Sheet
                    readonly={readonly}
                    data={data as SWD6CharacterData}
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
