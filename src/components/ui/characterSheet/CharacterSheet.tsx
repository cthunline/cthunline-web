import React from 'react';
import { Paper } from '@mui/material';

import { defaultData as defaultCoCData } from '../../../types/games/callOfCthulhu';
import { CharacterSheetProps } from './characterSheetProps';
import CoCSheet from './callOfCthulhu/CoCSheet';

import './CharacterSheet.css';

const CharacterSheet: React.FC<CharacterSheetProps> = ({
    readonly,
    gameId,
    data,
    onChange
}) => {
    const getContent = (): JSX.Element | null => {
        switch (gameId) {
            case 'callOfCthulhu':
                return (
                    <CoCSheet
                        readonly={readonly}
                        data={data ?? defaultCoCData}
                        onChange={onChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Paper elevation={3} className="character-sheet box">
            {getContent()}
        </Paper>
    );
};

export default CharacterSheet;
