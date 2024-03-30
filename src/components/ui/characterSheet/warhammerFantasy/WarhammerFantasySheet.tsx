import { type WarhammerFantasyCharacter } from '@cthunline/games';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import {
    GiCharacter,
    GiD10,
    GiSpellBook,
    GiLightBackpack
} from 'react-icons/gi';

import WarhammerFantasyLogo from '../../../svg/games/WarhammerFantasy';
import SheetTabs, { SheetTab } from '../generic/sheetTabs/SheetTabs';
import Characteristics from './characteristics/Characteristics';
import { type CharacterData } from '../../../../types';
import ArmourPoints from './armourPoints/ArmourPoints';
import Portrait from '../generic/portrait/Portrait';
import Encumbrance from './encumbrance/Encumbrance';
import { useApp } from '../../../contexts/App';
import BasicSkills from './skills/BasicSkills';
import OtherSkills from './skills/OtherSkills';
import Biography from './biography/Biography';
import Trappings from './trappings/Trappings';
import Talents from './talents/Talents';
import Weapons from './weapons/Weapons';
import Status from './status/Status';
import Spells from './spells/Spells';
import Armour from './armour/Armour';
import Wealth from './wealth/Wealth';
import {
    type ControlItemsSortOnly,
    controlCharacteristics,
    controlItems,
    controlSpells,
    controlTalents,
    sortOtherSkills,
    controlEncumbrance
} from './warhammerFantasySheet.helper';

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

    const onTalentsChange = useCallback(
        (partialChar: Partial<WarhammerFantasyCharacter>) => {
            setCharacterData((previous) =>
                controlTalents({
                    ...previous,
                    ...partialChar
                })
            );
        },
        []
    );

    const onSpellsChange = useCallback(
        (partialChar: Partial<WarhammerFantasyCharacter>) => {
            setCharacterData((previous) =>
                controlSpells({
                    ...previous,
                    ...partialChar
                })
            );
        },
        []
    );

    const onItemsChange = useCallback(
        (
            partialChar: Partial<WarhammerFantasyCharacter>,
            sortOnly?: ControlItemsSortOnly
        ) => {
            setCharacterData((previous) =>
                controlItems(
                    {
                        ...previous,
                        ...partialChar
                    },
                    sortOnly
                )
            );
        },
        []
    );

    const onEncumbranceChange = useCallback(
        (partialChar: Partial<WarhammerFantasyCharacter>) => {
            setCharacterData((previous) => {
                const updatedChar = {
                    ...previous,
                    ...partialChar
                };
                return {
                    ...updatedChar,
                    encumbrance: controlEncumbrance(updatedChar)
                };
            });
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

    const onOtherSkillsChange = useCallback(
        (partialChar: Partial<WarhammerFantasyCharacter>) => {
            setCharacterData((previous) =>
                sortOtherSkills({
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
            label: T('game.warhammerFantasy.tab.biographyAndStatus')
        },
        {
            key: 'characteristicsAndSkills',
            icon: <GiD10 size={20} />,
            label: T('game.warhammerFantasy.tab.characteristicsAndSkills')
        },
        {
            key: 'talentsAndSpells',
            icon: <GiSpellBook size={20} />,
            label: T('game.warhammerFantasy.tab.talentsAndSpells')
        },
        {
            key: 'equipment',
            icon: <GiLightBackpack size={20} />,
            label: T('game.warhammerFantasy.tab.equipment')
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
                        onChange={onCharacteristicsChange}
                    />
                    <OtherSkills
                        readonly={readonly}
                        character={characterData}
                        onChange={onOtherSkillsChange}
                    />
                </Stack>
            ) : null}
            {/* talents & spells */}
            {sheetTabs[tabIndex].key === 'talentsAndSpells' ? (
                <Stack
                    direction="column"
                    gap="1rem"
                    flex={1}
                    width="100%"
                    className="scroll p-25 pt-15"
                >
                    <Talents
                        readonly={readonly}
                        character={characterData}
                        onChange={onTalentsChange}
                    />
                    <Spells
                        readonly={readonly}
                        character={characterData}
                        onChange={onSpellsChange}
                    />
                </Stack>
            ) : null}
            {/* equipment */}
            {sheetTabs[tabIndex].key === 'equipment' ? (
                <Stack
                    direction="column"
                    gap="1rem"
                    flex={1}
                    width="100%"
                    className="scroll p-25 pt-15"
                >
                    <Stack direction="row" gap="2rem">
                        <ArmourPoints
                            readonly={readonly}
                            character={characterData}
                            onChange={onPartialCharacterChange}
                            flex="6"
                        />
                        <Wealth
                            readonly={readonly}
                            character={characterData}
                            onChange={onPartialCharacterChange}
                            flex="3"
                        />
                        <Encumbrance
                            readonly={readonly}
                            character={characterData}
                            onChange={onEncumbranceChange}
                            flex="4"
                        />
                    </Stack>
                    <Armour
                        readonly={readonly}
                        character={characterData}
                        onChange={(partialChar) =>
                            onItemsChange(partialChar, 'armour')
                        }
                    />
                    <Weapons
                        readonly={readonly}
                        character={characterData}
                        onChange={(partialChar) =>
                            onItemsChange(partialChar, 'weapons')
                        }
                    />
                    <Trappings
                        readonly={readonly}
                        character={characterData}
                        onChange={(partialChar) =>
                            onItemsChange(partialChar, 'trappings')
                        }
                    />
                </Stack>
            ) : null}
        </SheetTabs>
    );
};

export default WarhammerFantasySheet;
