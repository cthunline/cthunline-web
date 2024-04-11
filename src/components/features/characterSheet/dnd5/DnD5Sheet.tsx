import { useCallback, useEffect, useRef, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import {
    GiCharacter,
    GiDiceTwentyFacesTwenty,
    GiCrossedSwords,
    GiSkills,
    GiSpellBook,
    GiOpenBook,
    GiBodyBalance,
    GiDiceShield,
    GiChart,
    GiSwordman,
    GiHandBag
} from 'react-icons/gi';
import {
    type DnD5Character,
    type DnD5Biography,
    type DnD5Story,
    type DnD5Abilities,
    type DnD5SavingThrows,
    type DnD5Skills,
    type DnD5Statistics,
    type DnD5Combat,
    type DnD5Attack,
    type DnD5Equipment,
    type DnD5Features,
    type DnD5Spellcasting
} from '@cthunline/games';

import {
    type CharacterData,
    GameId,
    type CharacterSheetStatus
} from '../../../../types/index.js';
import SheetTabs, { type SheetTab } from '../generic/sheetTabs/SheetTabs.js';
import { biographyFields, featuresFields, storyFields } from './fields.js';
import { getDefaulSpellLevel } from './spellcasting/spellcasting.data.js';
import SectionTitle from '../generic/sectionTitle/SectionTitle.js';
import FieldLayout from '../generic/fieldLayout/FieldLayout.js';
import { controlCharacterData } from './dnd5Sheet.helper.js';
import SavingThrows from './savingThrows/SavingThrows.js';
import { defaultAttack } from './attacks/attacks.data.js';
import Spellcasting from './spellcasting/Spellcasting.js';
import Portrait from '../generic/portrait/Portrait.js';
import Statistics from './statistics/Statistics.js';
import { useApp } from '../../../contexts/App.js';
import DnD5Logo from '../../../svg/games/DnD5.js';
import Abilities from './abilities/Abilities.js';
import Equipment from './equipment/Equipment.js';
import Attacks from './attacks/Attacks.js';
import Combat from './combat/Combat.js';
import Skills from './skills/Skills.js';

type PartialDataField =
    | 'abilities'
    | 'savingThrows'
    | 'skills'
    | 'statistics'
    | 'combat'
    | 'attacks'
    | 'equipment'
    | 'spellcasting';

type PartialDataType =
    | DnD5Abilities
    | DnD5SavingThrows
    | DnD5Skills
    | DnD5Statistics
    | DnD5Combat
    | DnD5Attack
    | DnD5Equipment
    | DnD5Spellcasting;

type PartialData = Partial<PartialDataType>;

export interface DnD5SheetProps {
    status: CharacterSheetStatus;
    readonly: boolean;
    data: DnD5Character;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
    portrait: string | null;
    onPortraitChange?: (file: File | null) => void;
}

const DnD5Sheet = ({
    status,
    readonly,
    data,
    listening,
    onChange,
    portrait,
    onPortraitChange
}: DnD5SheetProps) => {
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<DnD5Character>(data);
    const [tabValue, setTabValue] = useState<string>('biographyAndStory');

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
            const { name, background } = characterData.biography;
            const properName = name || '[No Name]';
            const properBackground = background ? `(${background})` : '';
            const characterName = `${properName} ${properBackground}`;
            onChange(characterName, characterData);
        }
    }, [readonly, onChange, characterData]);

    const onBiographyChange = useCallback((biography: DnD5Biography) => {
        setCharacterData((previous) => ({
            ...previous,
            biography
        }));
    }, []);

    const changePartialData = useCallback(
        (field: PartialDataField, partialData: PartialData) => {
            setCharacterData((previous) =>
                controlCharacterData({
                    ...previous,
                    [field]: {
                        ...previous[field],
                        ...partialData
                    }
                })
            );
        },
        []
    );

    const onAttackCreate = useCallback(() => {
        setCharacterData((previous) => ({
            ...previous,
            attacks: [...previous.attacks, defaultAttack]
        }));
    }, []);

    const onAttackChange = useCallback((index: number, attack: DnD5Attack) => {
        setCharacterData((previous) => ({
            ...previous,
            attacks: previous.attacks.map((att, idx) =>
                idx === index ? attack : att
            )
        }));
    }, []);

    const onAttackDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            attacks: previous.attacks.filter((_a, idx) => idx !== index)
        }));
    }, []);

    const onFeaturesChange = useCallback((features: DnD5Features) => {
        setCharacterData((previous) => ({
            ...previous,
            features
        }));
    }, []);

    const onSpellLevelCreate = useCallback(() => {
        setCharacterData((previous) => {
            const nextLevel =
                Math.max(
                    0,
                    ...previous.spellcasting.levels.map((lvl) => lvl.level)
                ) + 1;
            return {
                ...previous,
                spellcasting: {
                    ...previous.spellcasting,
                    levels: [
                        ...previous.spellcasting.levels,
                        getDefaulSpellLevel(nextLevel)
                    ]
                }
            };
        });
    }, []);

    const onStoryChange = useCallback((story: DnD5Story) => {
        setCharacterData((previous) => ({
            ...previous,
            story
        }));
    }, []);

    const sheetTabs: Record<string, SheetTab> = {
        biographyAndStory: {
            key: 'biographyAndStory',
            icon: <GiCharacter size={20} />,
            label: T('game.dnd5.common.biography')
        },
        abilitiesAndSkills: {
            key: 'abilitiesAndSkills',
            icon: <GiDiceTwentyFacesTwenty size={20} />,
            label: T('game.dnd5.common.abilities')
        },
        combat: {
            key: 'combat',
            icon: <GiCrossedSwords size={20} />,
            label: T('game.dnd5.common.combat')
        },
        featuresAndEquipment: {
            key: 'featuresAndEquipment',
            icon: <GiSkills size={20} />,
            label: T('game.dnd5.common.features')
        },
        spells: {
            key: 'spells',
            icon: <GiSpellBook size={20} />,
            label: T('game.dnd5.common.spellcasting')
        }
    };

    const getAddButton = (handler: () => void) =>
        readonly ? undefined : (
            <ActionIcon size="sm" onClick={handler}>
                <FiPlusCircle />
            </ActionIcon>
        );

    return (
        <SheetTabs
            readonly={readonly}
            status={status}
            logoSvgComponent={DnD5Logo}
            tabs={Object.values(sheetTabs)}
            selectedValue={tabValue}
            onChange={(val) => setTabValue(val)}
        >
            {/* bio & story */}
            {sheetTabs[tabValue]?.key === 'biographyAndStory' && (
                <Stack w="100%">
                    <Group w="100%" align="start">
                        {/* biography */}
                        <Stack flex="4 0">
                            <SectionTitle
                                iconBefore={<GiCharacter size={20} />}
                                text={T('game.dnd5.common.biography')}
                            />
                            <FieldLayout<DnD5Biography>
                                gameId={GameId.dnd5}
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
                    <SectionTitle
                        iconBefore={<GiOpenBook size={20} />}
                        text={T('game.dnd5.common.story')}
                    />
                    <FieldLayout<DnD5Story>
                        gameId={GameId.dnd5}
                        fields={storyFields}
                        textSectionKey="story"
                        data={characterData.story}
                        readonly={readonly}
                        onChange={onStoryChange}
                    />
                </Stack>
            )}
            {/* abilities & skills */}
            {sheetTabs[tabValue]?.key === 'abilitiesAndSkills' && (
                <Group w="100%" align="start" gap="2rem">
                    <Stack flex="1 0">
                        {/* abilities */}
                        <SectionTitle
                            iconBefore={<GiDiceTwentyFacesTwenty size={20} />}
                            text={T('game.dnd5.common.abilities')}
                        />
                        <Abilities
                            abilities={characterData.abilities}
                            readonly={readonly}
                            onChange={(partial) =>
                                changePartialData('abilities', partial)
                            }
                        />
                        {/* saving throws */}
                        <SectionTitle
                            iconBefore={<GiDiceShield size={20} />}
                            text={T('game.dnd5.common.savingThrows')}
                            mt={5}
                        />
                        <SavingThrows
                            savingThrows={characterData.savingThrows}
                            readonly={readonly}
                            onChange={(partial) =>
                                changePartialData('savingThrows', partial)
                            }
                        />
                        {/* statistics */}
                        <SectionTitle
                            iconBefore={<GiChart size={20} />}
                            text={T('game.dnd5.common.statistics')}
                            mt={6}
                        />
                        <Statistics
                            statistics={characterData.statistics}
                            readonly={readonly}
                            onChange={(partial) =>
                                changePartialData('statistics', partial)
                            }
                        />
                    </Stack>
                    {/* skills */}
                    <Stack flex="1 0">
                        <SectionTitle
                            iconBefore={<GiBodyBalance size={20} />}
                            text={T('game.dnd5.common.skills')}
                        />
                        <Skills
                            skills={characterData.skills}
                            readonly={readonly}
                            onChange={(partial) =>
                                changePartialData('skills', partial)
                            }
                        />
                    </Stack>
                </Group>
            )}
            {/* combat & attacks */}
            {sheetTabs[tabValue]?.key === 'combat' && (
                <Stack w="100%">
                    {/* combat */}
                    <SectionTitle
                        iconBefore={<GiCrossedSwords size={20} />}
                        text={T('game.dnd5.common.combat')}
                    />
                    <Combat
                        combat={characterData.combat}
                        readonly={readonly}
                        onChange={(partial) =>
                            changePartialData('combat', partial)
                        }
                    />
                    {/* attacks */}
                    <SectionTitle
                        iconBefore={<GiSwordman size={20} />}
                        iconAfter={getAddButton(onAttackCreate)}
                        text={T('game.dnd5.common.attacks')}
                    />
                    <Attacks
                        attacks={characterData.attacks}
                        readonly={readonly}
                        onChange={onAttackChange}
                        onDelete={onAttackDelete}
                    />
                </Stack>
            )}
            {/* features & equipment */}
            {sheetTabs[tabValue]?.key === 'featuresAndEquipment' && (
                <Stack w="100%">
                    {/* features */}
                    <SectionTitle
                        iconBefore={<GiSkills size={20} />}
                        text={T('game.dnd5.common.features')}
                    />
                    <FieldLayout<DnD5Features>
                        gameId={GameId.dnd5}
                        fields={featuresFields}
                        textSectionKey="features"
                        data={characterData.features}
                        readonly={readonly}
                        onChange={onFeaturesChange}
                    />
                    {/* equipment */}
                    <SectionTitle
                        iconBefore={<GiHandBag size={20} />}
                        text={T('game.dnd5.common.equipment')}
                    />
                    <Equipment
                        equipment={characterData.equipment}
                        readonly={readonly}
                        onChange={(partial) =>
                            changePartialData('equipment', partial)
                        }
                    />
                </Stack>
            )}
            {/* spells */}
            {sheetTabs[tabValue]?.key === 'spells' && (
                <Stack w="100%">
                    {/* spellcasting */}
                    <SectionTitle
                        iconBefore={<GiSpellBook size={20} />}
                        iconAfter={getAddButton(onSpellLevelCreate)}
                        text={T('game.dnd5.common.spellcasting')}
                    />
                    <Spellcasting
                        spellcasting={characterData.spellcasting}
                        readonly={readonly}
                        onChange={(partial) =>
                            changePartialData('spellcasting', partial)
                        }
                    />
                </Stack>
            )}
        </SheetTabs>
    );
};

export default DnD5Sheet;
