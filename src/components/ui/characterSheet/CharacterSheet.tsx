import { useCallback, useRef } from 'react';
import { Paper } from '@mui/material';
import {
    CoCCharacter,
    DnD5Character,
    SeventhSeaCharacter,
    SWD6Character
} from '@cthunline/games';

import { CharacterData, GameId } from '../../../types';
import CoCSheet from './callOfCthulhu/CoCSheet';
import DnD5Sheet from './dnd5/DnD5Sheet';
import SeventhSeaSheet from './seventhSea/SeventhSeaSheet';
import SWD6Sheet from './starWarsD6/SWD6Sheet';

import './CharacterSheet.css';

export interface CharacterSheetProps {
    readonly: boolean;
    gameId: string;
    data: CharacterData;
    listening?: boolean;
    rawContent?: boolean;
    onChange?: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
    portrait: string | null;
    onPortraitChange?: (file: File | null) => void;
}

const CharacterSheet = ({
    readonly,
    gameId,
    data,
    listening,
    rawContent,
    onChange,
    portrait,
    onPortraitChange
}: CharacterSheetProps) => {
    const changeTime = 1000;
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onChangeBuffer = useCallback(
        (
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
        },
        [onChange]
    );

    const getContent = (): JSX.Element => {
        if (gameId === GameId.callOfCthulhu) {
            return (
                <CoCSheet
                    readonly={readonly}
                    data={data as CoCCharacter}
                    listening={listening}
                    onChange={onChangeBuffer}
                    portrait={portrait}
                    onPortraitChange={onPortraitChange}
                />
            );
        }
        if (gameId === GameId.dnd5) {
            return (
                <DnD5Sheet
                    readonly={readonly}
                    data={data as DnD5Character}
                    listening={listening}
                    onChange={onChangeBuffer}
                    portrait={portrait}
                    onPortraitChange={onPortraitChange}
                />
            );
        }
        if (gameId === GameId.seventhSea) {
            return (
                <SeventhSeaSheet
                    readonly={readonly}
                    data={data as SeventhSeaCharacter}
                    listening={listening}
                    onChange={onChangeBuffer}
                    portrait={portrait}
                    onPortraitChange={onPortraitChange}
                />
            );
        }
        if (gameId === GameId.starWarsD6) {
            return (
                <SWD6Sheet
                    readonly={readonly}
                    data={data as SWD6Character}
                    listening={listening}
                    onChange={onChangeBuffer}
                    portrait={portrait}
                    onPortraitChange={onPortraitChange}
                />
            );
        }
        throw new Error('Could not get character sheet content');
    };

    if (rawContent) {
        return getContent();
    }

    return (
        <Paper elevation={3} className="character-sheet">
            {getContent()}
        </Paper>
    );
};

export default CharacterSheet;
