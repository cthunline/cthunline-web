import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Group, Stack } from '@mantine/core';
import {
    type WarhammerFantasyBiography,
    type WarhammerFantasyCharacter
} from '@cthunline/games';
import {
    GiCharacter,
    GiD10,
    GiSpellBook,
    GiLightBackpack
} from 'react-icons/gi';

import SheetTabs, { type SheetTab } from '../generic/sheetTabs/SheetTabs.js';
import WarhammerFantasyLogo from '../../../svg/games/WarhammerFantasy.js';
import { GameId, type CharacterData } from '../../../../types/index.js';
import Characteristics from './characteristics/Characteristics.js';
import SectionTitle from '../generic/sectionTitle/SectionTitle.js';
import FieldLayout from '../generic/fieldLayout/FieldLayout.js';
import ArmourPoints from './armourPoints/ArmourPoints.js';
import Portrait from '../generic/portrait/Portrait.js';
import Encumbrance from './encumbrance/Encumbrance.js';
import { useApp } from '../../../contexts/App.js';
import BasicSkills from './skills/BasicSkills.js';
import OtherSkills from './skills/OtherSkills.js';
import Trappings from './trappings/Trappings.js';
import { biographyFields } from './fields.js';
import Talents from './talents/Talents.js';
import Weapons from './weapons/Weapons.js';
import Status from './status/Status.js';
import Spells from './spells/Spells.js';
import Armour from './armour/Armour.js';
import Wealth from './wealth/Wealth.js';
import {
    type ControlItemsSortOnly,
    controlCharacteristics,
    controlItems,
    controlSpells,
    controlTalents,
    sortOtherSkills,
    controlEncumbrance
} from './warhammerFantasySheet.helper.js';

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
    const [tabValue, setTabValue] = useState<string>('biographyAndStatus');

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

    const sheetTabs: Record<string, SheetTab> = {
        biographyAndStatus: {
            key: 'biographyAndStatus',
            icon: <GiCharacter size={20} />,
            label: T('game.warhammerFantasy.tab.biographyAndStatus')
        },
        characteristicsAndSkills: {
            key: 'characteristicsAndSkills',
            icon: <GiD10 size={20} />,
            label: T('game.warhammerFantasy.tab.characteristicsAndSkills')
        },
        talentsAndSpells: {
            key: 'talentsAndSpells',
            icon: <GiSpellBook size={20} />,
            label: T('game.warhammerFantasy.tab.talentsAndSpells')
        },
        equipment: {
            key: 'equipment',
            icon: <GiLightBackpack size={20} />,
            label: T('game.warhammerFantasy.tab.equipment')
        }
    };

    return (
        <SheetTabs
            logoSvgComponent={WarhammerFantasyLogo}
            tabs={Object.values(sheetTabs)}
            selectedValue={tabValue}
            onChange={(val) => setTabValue(val)}
        >
            {/* bio & status */}
            {sheetTabs[tabValue]?.key === 'biographyAndStatus' && (
                <Stack w="100%">
                    <Group w="100%" align="start">
                        {/* biography */}
                        <Stack flex="4 0">
                            <SectionTitle
                                iconBefore={<GiCharacter size={20} />}
                                text={T(
                                    'game.warhammerFantasy.biography.biography'
                                )}
                            />
                            <FieldLayout<WarhammerFantasyBiography>
                                gameId={GameId.warhammerFantasy}
                                fields={biographyFields}
                                textSectionKey="biography"
                                data={data.biography}
                                readonly={readonly}
                                onChange={(
                                    biography: WarhammerFantasyBiography
                                ) => {
                                    onPartialCharacterChange({ biography });
                                }}
                            />
                        </Stack>
                        {/* portrait */}
                        <Box flex="1 0">
                            <Portrait
                                value={portrait}
                                readonly={readonly}
                                onChange={onPortraitChange}
                            />
                        </Box>
                    </Group>
                    <Status
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {/* characteristics & skills */}
            {sheetTabs[tabValue]?.key === 'characteristicsAndSkills' && (
                <Stack w="100%">
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
            )}
            {/* talents & spells */}
            {sheetTabs[tabValue]?.key === 'talentsAndSpells' && (
                <Stack w="100%">
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
            )}
            {/* equipment */}
            {sheetTabs[tabValue]?.key === 'equipment' && (
                <Stack w="100%">
                    <Group w="100%">
                        <ArmourPoints
                            readonly={readonly}
                            character={characterData}
                            onChange={onPartialCharacterChange}
                            flex="6 0"
                        />
                        <Wealth
                            readonly={readonly}
                            character={characterData}
                            onChange={onPartialCharacterChange}
                            flex="3 0"
                        />
                        <Encumbrance
                            readonly={readonly}
                            character={characterData}
                            onChange={onEncumbranceChange}
                            flex="4 0"
                        />
                    </Group>
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
            )}
        </SheetTabs>
    );
};

export default WarhammerFantasySheet;
