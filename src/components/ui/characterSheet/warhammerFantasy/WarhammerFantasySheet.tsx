import { type WarhammerFantasyCharacter } from '@cthunline/games';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import {
    GiCharacter,
    GiD10,
    GiSpellBook,
    GiLightBackpack
} from 'react-icons/gi';

import { controlCharacteristics } from './warhammerFantasySheet.helper';
import WarhammerFantasyLogo from '../../../svg/games/WarhammerFantasy';
import SheetTabs, { SheetTab } from '../generic/sheetTabs/SheetTabs';
import Characteristics from './characteristics/Characteristics';
import { type CharacterData } from '../../../../types';
import Portrait from '../generic/portrait/Portrait';
import { useApp } from '../../../contexts/App';
import BasicSkills from './skills/BasicSkills';
import Biography from './biography/Biography';
import Status from './status/Status';
import OtherSkills from './skills/OtherSkills';

export interface WarhammerFantasySheetProps {
    readonly: boolean;
    data: WarhammerFantasyCharacter;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
    portrait: string | null;
    onPortraitChange?: (file: File | null) => void;
}

const WarhammerFantasySheet = ({
    readonly,
    data,
    listening,
    onChange,
    portrait,
    onPortraitChange
}: WarhammerFantasySheetProps) => {
    const { T } = useApp();

    const [characterData, setCharacterData] =
        useState<WarhammerFantasyCharacter>(data);
    const [tabIndex, setTabIndex] = useState<number>(0);

    useEffect(() => {
        if (listening) {
            setCharacterData(data);
        }
    }, [listening, data]);

    const initialRender = useRef(true);
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else if (!readonly) {
            const { name, species, class: charClass } = characterData.biography;
            const properName = name || '[No Name]';
            const speciesClassParts: string[] = [];
            if (species) {
                speciesClassParts.push(species);
            }
            if (charClass) {
                speciesClassParts.push(charClass);
            }
            const speciesClass = speciesClassParts.length
                ? ` (${speciesClassParts.join(' / ')})`
                : '';
            const characterName = `${properName}${speciesClass}`;
            onChange(characterName, characterData);
        }
    }, [readonly, onChange, characterData]);

    const onPartialCharacterChange = useCallback(
        (partialChar: Partial<WarhammerFantasyCharacter>) => {
            setCharacterData((previous) => ({
                ...previous,
                ...partialChar
            }));
        },
        []
    );

    const onCharacteristicsChange = useCallback(
        (partialChar: Partial<WarhammerFantasyCharacter>) => {
            setCharacterData((previous) =>
                controlCharacteristics({
                    ...previous,
                    ...partialChar
                })
            );
        },
        []
    );

    const sheetTabs: SheetTab[] = [
        {
            key: 'biographyAndStatus',
            icon: <GiCharacter size={20} />,
            label: T('game.warhammerFantasy.tabs.biographyAndStatus')
        },
        {
            key: 'characteristicsAndSkills',
            icon: <GiD10 size={20} />,
            label: T('game.warhammerFantasy.tabs.characteristicsAndSkills')
        },
        {
            key: 'talentsAndSpells',
            icon: <GiSpellBook size={20} />,
            label: T('game.warhammerFantasy.tabs.talentsAndSpells')
        },
        {
            key: 'equipment',
            icon: <GiLightBackpack size={20} />,
            label: T('game.warhammerFantasy.tabs.equipment')
        }
    ];

    return (
        <SheetTabs
            logoSvgComponent={WarhammerFantasyLogo}
            tabs={sheetTabs}
            selectedIndex={tabIndex}
            onChange={(idx) => setTabIndex(idx)}
            wrapContentGrid={false}
        >
            {/* bio & status */}
            {sheetTabs[tabIndex].key === 'biographyAndStatus' ? (
                <Stack
                    direction="column"
                    gap="1rem"
                    flex={1}
                    width="100%"
                    className="scroll p-25 pt-15"
                >
                    <Stack
                        direction="row"
                        className="full-width"
                        gap="1rem"
                        width="100%"
                    >
                        <Biography
                            readonly={readonly}
                            character={characterData}
                            onChange={onPartialCharacterChange}
                            flex={1}
                        />
                        <Box width="25%">
                            <Portrait
                                value={portrait}
                                readonly={readonly}
                                onChange={onPortraitChange}
                            />
                        </Box>
                    </Stack>
                    <Status
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            ) : null}
            {/* characteristics & skills */}
            {sheetTabs[tabIndex].key === 'characteristicsAndSkills' ? (
                <Stack
                    direction="column"
                    gap="1rem"
                    flex={1}
                    width="100%"
                    className="scroll p-25 pt-15"
                >
                    <Characteristics
                        readonly={readonly}
                        character={characterData}
                        onChange={onCharacteristicsChange}
                    />
                    <BasicSkills
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                    <OtherSkills
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            ) : null}
        </SheetTabs>
    );
};

export default WarhammerFantasySheet;
