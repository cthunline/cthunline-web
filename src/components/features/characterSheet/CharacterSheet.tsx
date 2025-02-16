import type {
    AlienCharacter,
    ApocalypseWorldCharacter,
    CoCCharacter,
    DnD5Character,
    GameId,
    SWD6Character,
    SeventhSeaCharacter,
    WarhammerFantasyCharacter
} from '@cthunline/games';
import { Paper } from '@mantine/core';
import { useCallback, useRef } from 'react';

import useCharacterSheetStatus from '../../../hooks/api/useCharacterSheetStatus.js';
import type { CharacterData } from '../../../types/index.js';
import AlienSheet from './alien/AlienSheet.js';
import ApocalypseWorldSheet from './apocalypseWorld/ApocalypseWorldSheet.js';
import CoCSheet from './callOfCthulhu/CoCSheet.js';
import DnD5Sheet from './dnd5/DnD5Sheet.js';
import SeventhSeaSheet from './seventhSea/SeventhSeaSheet.js';
import SWD6Sheet from './starWarsD6/SWD6Sheet.js';
import WarhammerFantasySheet from './warhammerFantasy/WarhammerFantasySheet.js';

export interface CharacterSheetProps {
    readonly: boolean;
    gameId: GameId;
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

    const getContent = (): React.ReactElement => {
        if (gameId === 'alien') {
            return (
                <AlienSheet
                    status={status}
                    readonly={readonly}
                    data={data as AlienCharacter}
                    listening={listening}
                    onChange={onChangeBuffer}
                    portrait={portrait}
                    onPortraitChange={onPortraitChange}
                />
            );
        }
        if (gameId === 'apocalypseWorld') {
            return (
                <ApocalypseWorldSheet
                    status={status}
                    readonly={readonly}
                    data={data as ApocalypseWorldCharacter}
                    listening={listening}
                    onChange={onChangeBuffer}
                    portrait={portrait}
                    onPortraitChange={onPortraitChange}
                />
            );
        }
        if (gameId === 'callOfCthulhu') {
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
        if (gameId === 'dnd5') {
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
        if (gameId === 'seventhSea') {
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
        if (gameId === 'starWarsD6') {
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
        if (gameId === 'warhammerFantasy') {
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
