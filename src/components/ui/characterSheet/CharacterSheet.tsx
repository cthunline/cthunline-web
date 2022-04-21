import React, { useRef } from 'react';
import { Paper } from '@mui/material';

import { CharacterData, GameId } from '../../../types';
import CoCSheet from './callOfCthulhu/CoCSheet';
import { CoCCharacterData } from '../../../types/games/callOfCthulhu';
import SWD6Sheet from './starWarsD6/SWD6Sheet';
import { SWD6CharacterData } from '../../../types/games/starWarsD6';

import './CharacterSheet.css';

export interface CharacterSheetProps {
    readonly: boolean;
    gameId: string;
    data: CharacterData;
    listening?: boolean;
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
    listening,
    onChange
}) => {
    const changeTime = 1000;
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onChangeBuffer = (
        name: string,
        characterData: CharacterData,
        instantRefresh?: boolean | undefined
    ) => {
        if (onChange) {
            if (changeTimer.current) {
                clearTimeout(changeTimer.current);
            }
            changeTimer.current = setTimeout(() => {
                onChange(name, characterData, instantRefresh);
            }, changeTime);
        }
    };

    const getContent = (): JSX.Element => {
        if (gameId === GameId.callOfCthulhu) {
            return (
                <CoCSheet
                    readonly={readonly}
                    data={data as CoCCharacterData}
                    listening={listening}
                    onChange={onChangeBuffer}
                />
            );
        }
        if (gameId === GameId.starWarsD6) {
            return (
                <SWD6Sheet
                    readonly={readonly}
                    data={data as SWD6CharacterData}
                    listening={listening}
                    onChange={onChangeBuffer}
                />
            );
        }
        throw new Error('Could not get character sheet content');
    };

    return (
        <Paper elevation={3} className="character-sheet p-25 scroll">
            {getContent()}
        </Paper>
    );
};

export default CharacterSheet;
