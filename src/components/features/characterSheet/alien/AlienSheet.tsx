import type {
    AlienArmor,
    AlienAttributes,
    AlienBiography,
    AlienCharacter,
    AlienConsumables,
    AlienEquipment,
    AlienExperience,
    AlienRelationships,
    AlienStatus
} from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    GiCharacter,
    GiChestArmor,
    GiD10,
    GiLightBackpack,
    GiRelationshipBounds
} from 'react-icons/gi';

import { useApp } from '../../../../contexts/App.js';
import type {
    CharacterData,
    CharacterSheetStatus
} from '../../../../types/index.js';
import AlienLogo from '../../../svg/games/alien/AlienLogo.js';
import FieldLayout from '../generic/fieldLayout/FieldLayout.js';
import Portrait from '../generic/portrait/Portrait.js';
import SectionTitle from '../generic/sectionTitle/SectionTitle.js';
import SheetTabs, { type SheetTab } from '../generic/sheetTabs/SheetTabs.js';
import AttributesAndSkills from './attributes/AttributesAndSkills.js';
import {
    armorFields,
    biographyIdentityFields,
    biographyStoryFields,
    consumablesFields,
    encumbranceFields,
    equipmentFields,
    experienceFields,
    relationshipsFields
} from './fields.js';
import Status from './status/Status.js';
import Talents from './talents/Talents.js';
import Weapons from './weapons/Weapons.js';

export interface AlienSheetProps {
    status: CharacterSheetStatus;
    readonly: boolean;
    data: AlienCharacter;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
    portrait: string | null;
    onPortraitChange?: (file: File | null) => void;
}

const AlienSheet = ({
    status,
    readonly,
    data,
    listening,
    onChange,
    portrait,
    onPortraitChange
}: AlienSheetProps) => {
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<AlienCharacter>(data);
    const [tabValue, setTabValue] = useState<string>('biography');

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
            const { name, career } = characterData.biography;
            let characterName = name.trim() || '[No Name]';
            if (career) {
                characterName = `${characterName} (${career})`;
            }
            onChange(characterName, characterData);
        }
    }, [readonly, onChange, characterData]);

    const onPartialCharacterChange = useCallback(
        (partialChar: Partial<AlienCharacter>) => {
            setCharacterData((previous) => ({
                ...previous,
                ...partialChar
            }));
        },
        []
    );

    const onEquipmentChange = useCallback(
        (partialEquipment: Partial<AlienEquipment>) => {
            setCharacterData((previous) => ({
                ...previous,
                equipment: {
                    ...previous.equipment,
                    ...partialEquipment
                }
            }));
        },
        []
    );

    const sheetTabs: Record<string, SheetTab> = {
        biography: {
            key: 'biography',
            icon: <GiCharacter size={20} />,
            label: T('game.alien.tab.biography')
        },
        statistics: {
            key: 'statistics',
            icon: <GiD10 size={20} />,
            label: T('game.alien.tab.statistics')
        },
        equipment: {
            key: 'equipment',
            icon: <GiLightBackpack size={20} />,
            label: T('game.alien.tab.equipment')
        }
    };

    return (
        <SheetTabs
            readonly={readonly}
            status={status}
            logoSvgComponent={AlienLogo}
            tabs={Object.values(sheetTabs)}
            selectedValue={tabValue}
            onChange={(val) => setTabValue(val)}
        >
            {/* biography */}
            {sheetTabs[tabValue]?.key === 'biography' && (
                <Stack w="100%">
                    <Group w="100%" align="start">
                        {/* biography (identity) */}
                        <Stack flex="4 0">
                            <SectionTitle
                                iconBefore={<GiCharacter size={20} />}
                                text={T('game.alien.biography.biography')}
                            />
                            <FieldLayout<AlienBiography>
                                gameId="alien"
                                fields={biographyIdentityFields}
                                textSectionKey="biography"
                                data={characterData.biography}
                                readonly={readonly}
                                onChange={(biography: AlienBiography) => {
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
                    {/* biography (story) */}
                    <FieldLayout<AlienBiography>
                        gameId="alien"
                        fields={biographyStoryFields}
                        textSectionKey="biography"
                        data={characterData.biography}
                        readonly={readonly}
                        onChange={(biography: AlienBiography) => {
                            onPartialCharacterChange({ biography });
                        }}
                    />
                    {/* relationships */}
                    <Stack flex="1 0">
                        <SectionTitle
                            iconBefore={<GiRelationshipBounds size={20} />}
                            text={T('game.alien.relationships.relationships')}
                        />
                        <FieldLayout<AlienRelationships>
                            gameId="alien"
                            fields={relationshipsFields}
                            textSectionKey="relationships"
                            data={characterData.relationships}
                            readonly={readonly}
                            onChange={(relationships: AlienRelationships) => {
                                onPartialCharacterChange({ relationships });
                            }}
                        />
                    </Stack>
                </Stack>
            )}
            {/* statistics (attributes, skills, talents, status, experience) */}
            {sheetTabs[tabValue]?.key === 'statistics' && (
                <Stack w="100%">
                    {/* attributes */}
                    <AttributesAndSkills
                        attributes={characterData.attributes}
                        readonly={readonly}
                        onChange={(attributes: AlienAttributes) => {
                            onPartialCharacterChange({ attributes });
                        }}
                    />
                    <Group w="100%" align="start" gap="4rem">
                        {/* status */}
                        <Status
                            flex="4 0"
                            status={characterData.status}
                            readonly={readonly}
                            onChange={(status: AlienStatus) => {
                                onPartialCharacterChange({ status });
                            }}
                        />
                        <Stack flex="4 0">
                            <SectionTitle
                                iconBefore={<GiCharacter size={20} />}
                                text={T('game.alien.experience.experience')}
                            />
                            <FieldLayout<AlienExperience>
                                gameId="alien"
                                fields={experienceFields}
                                textSectionKey="experience"
                                data={characterData.experience}
                                readonly={readonly}
                                onChange={(experience: AlienExperience) => {
                                    onPartialCharacterChange({ experience });
                                }}
                            />
                            {/* talents */}
                            <Talents
                                flex="5 0"
                                talents={characterData.talents}
                                readonly={readonly}
                                onChange={(
                                    talents: AlienCharacter['talents']
                                ) => {
                                    onPartialCharacterChange({ talents });
                                }}
                            />
                        </Stack>
                    </Group>
                </Stack>
            )}
            {/* equipment */}
            {sheetTabs[tabValue]?.key === 'equipment' && (
                <Stack w="100%">
                    <Stack gap="1rem">
                        <SectionTitle
                            iconBefore={<GiChestArmor size={20} />}
                            text={T('game.alien.consumables.consumables')}
                        />
                        <FieldLayout<AlienConsumables>
                            gameId="alien"
                            fields={consumablesFields}
                            textSectionKey="consumables"
                            data={characterData.consumables}
                            readonly={readonly}
                            onChange={(consumables: AlienConsumables) => {
                                onPartialCharacterChange({ consumables });
                            }}
                        />
                    </Stack>
                    <FieldLayout<AlienEquipment>
                        gameId="alien"
                        fields={equipmentFields}
                        textSectionKey="equipment"
                        data={characterData.equipment}
                        readonly={readonly}
                        onChange={(equipment: Partial<AlienEquipment>) => {
                            onEquipmentChange(equipment);
                        }}
                    />
                    <Group w="100%" align="start" gap="4rem">
                        <Stack gap="1rem" flex="5 0">
                            <SectionTitle
                                iconBefore={<GiChestArmor size={20} />}
                                text={T('game.alien.equipment.armor.armor')}
                            />
                            <FieldLayout<AlienArmor>
                                gameId="alien"
                                fields={armorFields}
                                textSectionKey="equipment.armor"
                                data={characterData.equipment.armor}
                                readonly={readonly}
                                onChange={(armor: AlienArmor) => {
                                    onEquipmentChange({ armor });
                                }}
                            />
                        </Stack>
                        <FieldLayout<AlienEquipment>
                            flex="2 0"
                            gameId="alien"
                            fields={encumbranceFields}
                            textSectionKey="equipment"
                            data={characterData.equipment}
                            readonly={readonly}
                            onChange={(equipment: Partial<AlienEquipment>) => {
                                onEquipmentChange(equipment);
                            }}
                        />
                    </Group>
                    <Weapons
                        weapons={characterData.equipment.weapons}
                        readonly={readonly}
                        onChange={(weapons: AlienEquipment['weapons']) => {
                            onEquipmentChange({ weapons });
                        }}
                    />
                </Stack>
            )}
        </SheetTabs>
    );
};

export default AlienSheet;
