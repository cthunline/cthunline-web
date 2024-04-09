import { useCallback, useRef } from 'react';
import { Paper } from '@mantine/core';
import {
    type WarhammerFantasyCharacter,
    type SeventhSeaCharacter,
    type SWD6Character,
    type DnD5Character,
    type CoCCharacter
} from '@cthunline/games';

import WarhammerFantasySheet from './warhammerFantasy/WarhammerFantasySheet.js';
import { type CharacterData, GameId } from '../../../types/index.js';
import SeventhSeaSheet from './seventhSea/SeventhSeaSheet.js';
import CoCSheet from './callOfCthulhu/CoCSheet.js';
import SWD6Sheet from './starWarsD6/SWD6Sheet.js';
import DnD5Sheet from './dnd5/DnD5Sheet.js';

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
        if (gameId === GameId.warhammerFantasy) {
            return (
                <WarhammerFantasySheet
                    readonly={readonly}
                    data={data as WarhammerFantasyCharacter}
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
        <Paper shadow="md" w="750px" h="100%">
            {getContent()}
        </Paper>
    );
};

export default CharacterSheet;
