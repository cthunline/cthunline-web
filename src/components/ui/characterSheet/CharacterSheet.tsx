import React from 'react';
import { Paper } from '@mui/material';

import { defaultData as defaultCoCData } from '../../../types/games/callOfCthulhu';
import CoCSheet from './callOfCthulhu/CoCSheet';
import { CharacterData } from '../../../types';

import './CharacterSheet.css';

export interface CharacterSheetProps {
    readonly: boolean;
    gameId: string;
    data?: CharacterData;
    onChange?: (data: CharacterData, instantRefresh?: boolean) => void;
}

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
