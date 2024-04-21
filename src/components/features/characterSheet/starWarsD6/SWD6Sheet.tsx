import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Group, Stack } from '@mantine/core';
import {
    GiCharacter,
    GiPerspectiveDiceSixFacesSix,
    GiLightSabers,
    GiRollingDices,
    GiHeartBeats,
    GiChart
} from 'react-icons/gi';
import {
    type SWD6Character,
    type SWD6Biography,
    type SWD6Attribute,
    type SWD6AttributeData,
    type SWD6Skill,
    type SWD6Statistics,
    type SWD6WoundStatus,
    type SWD6Weapon,
    type SWD6Story
} from '@cthunline/games';

import {
    type CharacterData,
    GameId,
    type CharacterSheetStatus
} from '../../../../types/index.js';
import SheetTabs, { type SheetTab } from '../generic/sheetTabs/SheetTabs.js';
import SectionTitle from '../generic/sectionTitle/SectionTitle.js';
import FieldLayout from '../generic/fieldLayout/FieldLayout.js';
import { controlCharacterData } from './swd6Sheet.helper.js';
import { biographyFields, storyFields } from './fields.js';
import SWD6Logo from '../../../svg/games/StarWarsD6.js';
import WoundStatus from './woundStatus/WoundStatus.js';
import Portrait from '../generic/portrait/Portrait.js';
import Attributes from './attributes/Attributes.js';
import Statistics from './statistics/Statistics.js';
import { useApp } from '../../../../contexts/App.js';
import Weapons from './weapons/Weapons.js';

export interface SWD6SheetProps {
    status: CharacterSheetStatus;
    readonly: boolean;
    data: SWD6Character;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
    portrait: string | null;
    onPortraitChange?: (file: File | null) => void;
}

const SWD6Sheet = ({
    status,
    readonly,
    data,
    listening,
    onChange,
    portrait,
    onPortraitChange
}: SWD6SheetProps) => {
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<SWD6Character>(data);
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
            const { name, occupation } = characterData.biography;
            const properName = name || '[No Name]';
            const properOccupation = occupation ? `(${occupation})` : '';
            const characterName = `${properName} ${properOccupation}`;
            onChange(characterName, characterData);
        }
    }, [readonly, onChange, characterData]);

    const onBiographyChange = useCallback((biography: SWD6Biography) => {
        setCharacterData((previous) => ({
            ...previous,
            biography
        }));
    }, []);

    const onAttributeChange = useCallback(
        (
            attribute: SWD6Attribute,
            attributeData: Partial<SWD6AttributeData>
        ) => {
            setCharacterData((previous) => ({
                ...previous,
                attributes: {
                    ...previous.attributes,
                    [attribute]: {
                        ...previous.attributes[attribute],
                        ...attributeData
                    }
                }
            }));
        },
        []
    );

    const onSkillCreate = useCallback(
        (attribute: SWD6Attribute, skillData: SWD6Skill) => {
            setCharacterData((previous) => ({
                ...previous,
                attributes: {
                    ...previous.attributes,
                    [attribute]: {
                        ...previous.attributes[attribute],
                        skills: [
                            ...previous.attributes[attribute].skills,
                            skillData
                        ].sort((a, b) => a.name.localeCompare(b.name))
                    }
                }
            }));
        },
        []
    );

    const onSkillChange = useCallback(
        (
            attribute: SWD6Attribute,
            skillIndex: number,
            skillData: SWD6Skill
        ) => {
            setCharacterData((previous) => ({
                ...previous,
                attributes: {
                    ...previous.attributes,
                    [attribute]: {
                        ...previous.attributes[attribute],
                        skills: previous.attributes[attribute].skills.map(
                            (skill, idx) =>
                                idx === skillIndex ? skillData : skill
                        )
                    }
                }
            }));
        },
        []
    );

    const onSkillDelete = useCallback(
        (attribute: SWD6Attribute, skillIndex: number) => {
            setCharacterData((previous) => ({
                ...previous,
                attributes: {
                    ...previous.attributes,
                    [attribute]: {
                        ...previous.attributes[attribute],
                        skills: previous.attributes[attribute].skills.filter(
                            (_skill, idx) => idx !== skillIndex
                        )
                    }
                }
            }));
        },
        []
    );

    const onStatisticsChange = useCallback((statistics: SWD6Statistics) => {
        setCharacterData((previous) => ({
            ...previous,
            statistics
        }));
    }, []);

    const onWoundStatusChange = useCallback((woundStatus: SWD6WoundStatus) => {
        setCharacterData((previous) =>
            controlCharacterData({
                ...previous,
                woundStatus
            })
        );
    }, []);

    const onWeaponCreate = useCallback((weaponData: SWD6Weapon) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: [...previous.weapons, weaponData].sort((a, b) =>
                a.name.localeCompare(b.name)
            )
        }));
    }, []);

    const onWeaponChange = useCallback(
        (weaponIndex: number, weaponData: SWD6Weapon) => {
            setCharacterData((previous) => ({
                ...previous,
                weapons: previous.weapons.map((weapon, idx) =>
                    idx === weaponIndex ? weaponData : weapon
                )
            }));
        },
        []
    );

    const onWeaponDelete = useCallback((weaponIndex: number) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: previous.weapons.filter((_s, idx) => idx !== weaponIndex)
        }));
    }, []);

    const onStoryChange = useCallback((story: SWD6Story) => {
        setCharacterData((previous) => ({
            ...previous,
            story
        }));
    }, []);

    const sheetTabs: Record<string, SheetTab> = {
        biography: {
            key: 'biography',
            icon: <GiCharacter size={20} />,
            label: T('game.starWarsD6.common.biography')
        },
        attributesAndSkills: {
            key: 'attributesAndSkills',
            icon: <GiPerspectiveDiceSixFacesSix size={20} />,
            label: T('game.starWarsD6.common.attributesAndSkills')
        },
        weapons: {
            key: 'weapons',
            icon: <GiLightSabers size={20} />,
            label: T('game.starWarsD6.common.weapons')
        }
    };

    return (
        <SheetTabs
            readonly={readonly}
            status={status}
            logoSvgComponent={SWD6Logo}
            tabs={Object.values(sheetTabs)}
            selectedValue={tabValue}
            onChange={(val) => setTabValue(val)}
        >
            {/* bio & background */}
            {sheetTabs[tabValue]?.key === 'biography' && (
                <Stack w="100%">
                    <Group w="100%" align="start">
                        {/* biography */}
                        <Stack flex="4 0">
                            <SectionTitle
                                iconBefore={<GiCharacter size={20} />}
                                text={T('game.starWarsD6.common.biography')}
                            />
                            <FieldLayout<SWD6Biography>
                                gameId={GameId.starWarsD6}
                                fields={biographyFields}
                                textSectionKey="biography"
                                data={characterData.biography}
                                readonly={readonly}
                                onChange={onBiographyChange}
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
                    {/* story */}
                    <FieldLayout<SWD6Story>
                        key="swd6-story"
                        gameId={GameId.starWarsD6}
                        fields={storyFields}
                        textSectionKey="story"
                        data={characterData.story}
                        readonly={readonly}
                        onChange={onStoryChange}
                    />
                </Stack>
            )}
            {/* attributes & skills */}
            {sheetTabs[tabValue]?.key === 'attributesAndSkills' && (
                <Stack w="100%">
                    {/* attributes and skills */}
                    <SectionTitle
                        iconBefore={<GiRollingDices size={20} />}
                        text={T('game.starWarsD6.common.attributesAndSkills')}
                    />
                    <Attributes
                        attributes={characterData.attributes}
                        readonly={readonly}
                        onChange={onAttributeChange}
                        onSkillCreate={onSkillCreate}
                        onSkillChange={onSkillChange}
                        onSkillDelete={onSkillDelete}
                    />
                    <Group w="100%" align="start">
                        {/* statistics */}
                        <Stack flex="1 0">
                            <SectionTitle
                                iconBefore={<GiChart size={20} />}
                                text={T('game.starWarsD6.common.statistics')}
                            />
                            <Statistics
                                statistics={characterData.statistics}
                                readonly={readonly}
                                onChange={onStatisticsChange}
                            />
                        </Stack>
                        {/* wound status */}
                        <Stack flex="1 0">
                            <SectionTitle
                                iconBefore={<GiHeartBeats size={20} />}
                                text={T('game.starWarsD6.common.woundStatus')}
                            />
                            <WoundStatus
                                woundStatus={characterData.woundStatus}
                                readonly={readonly}
                                onChange={onWoundStatusChange}
                            />
                        </Stack>
                    </Group>
                </Stack>
            )}
            {/* weapons */}
            {sheetTabs[tabValue]?.key === 'weapons' && (
                // weapons
                <Stack w="100%">
                    <SectionTitle
                        iconBefore={<GiLightSabers size={20} />}
                        text={T('game.starWarsD6.common.weapons')}
                    />
                    <Weapons
                        weapons={characterData.weapons}
                        readonly={readonly}
                        onCreate={onWeaponCreate}
                        onChange={onWeaponChange}
                        onDelete={onWeaponDelete}
                    />
                </Stack>
            )}
        </SheetTabs>
    );
};

export default SWD6Sheet;
