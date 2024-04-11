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
import useCharacterSheetStatus from '../../hooks/useCharacterSheetStatus.js';
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
    const { status, updateStatus } = useCharacterSheetStatus();

    const changeTime = 1000;
    const changeTimer = useRef<number | null>(null);
    const onChangeBuffer = useCallback(
        (
            name: string,
            characterData: CharacterData,
            instantRefresh?: boolean | undefined
        ) => {
            if (onChange) {
                updateStatus('saving');
                if (changeTimer.current !== null) {
                    window.clearTimeout(changeTimer.current);
                }
                changeTimer.current = window.setTimeout(() => {
                    onChange(name, characterData, instantRefresh);
                    updateStatus('saved');
                }, changeTime);
            }
        },
        [onChange, updateStatus]
    );

    const getContent = (): JSX.Element => {
        if (gameId === GameId.callOfCthulhu) {
            return (
                <CoCSheet
                    status={status}
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
                    status={status}
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
                    status={status}
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
                    status={status}
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
                    status={status}
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
