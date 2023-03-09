import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, IconButton } from '@mui/material';
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
import { FiPlusCircle } from 'react-icons/fi';
import {
    DnD5Character,
    DnD5Biography,
    DnD5Story,
    DnD5Abilities,
    DnD5SavingThrows,
    DnD5Skills,
    DnD5Statistics,
    DnD5Combat,
    DnD5Attack,
    DnD5Equipment,
    DnD5Features,
    DnD5Spellcasting
} from '@cthunline/games';

import { CharacterData, GameId } from '../../../../types';
import { useApp } from '../../../contexts/App';
import SheetTabs, { SheetTab } from '../generic/sheetTabs/SheetTabs';
import SectionTitle from '../generic/sectionTitle/SectionTitle';
import FieldLayout, { Field } from '../generic/fieldLayout/FieldLayout';
import Portrait from '../generic/portrait/Portrait';
import Abilities from './abilities/Abilities';
import SavingThrows from './savingThrows/SavingThrows';
import Skills from './skills/Skills';
import Statistics from './statistics/Statistics';
import Combat from './combat/Combat';
import Attacks from './attacks/Attacks';
import Equipment from './equipment/Equipment';
import Spellcasting from './spellcasting/Spellcasting';
import { ReactComponent as DnD5Logo } from '../../../../assets/games/dnd5.svg';
import { getDefaulSpellLevel } from './spellcasting/spellcasting.data';
import { defaultAttack } from './attacks/attacks.data';
import { controlCharacterData } from './dnd5Sheet.helper';
import fields from './fields.json';

const biographyFields = fields.biography as Field<DnD5Biography>[];
const featuresFields = fields.features as Field<DnD5Features>[];
const storyFields = fields.story as Field<DnD5Story>[];

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

const DnD5Sheet: React.FC<DnD5SheetProps> = ({
    readonly,
    data,
    listening,
    onChange,
    portrait,
    onPortraitChange
}) => {
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<DnD5Character>(data);
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
            const { name, background } = characterData.biography;
            const properName = name ?? '[No Name]';
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

    const sheetTabs: SheetTab[] = [
        {
            key: 'biographyAndStory',
            icon: <GiCharacter size={20} />,
            label: T('game.dnd5.common.biography')
        },
        {
            key: 'abilitiesAndSkills',
            icon: <GiDiceTwentyFacesTwenty size={20} />,
            label: T('game.dnd5.common.abilities')
        },
        {
            key: 'combat',
            icon: <GiCrossedSwords size={20} />,
            label: T('game.dnd5.common.combat')
        },
        {
            key: 'featuresAndEquipment',
            icon: <GiSkills size={20} />,
            label: T('game.dnd5.common.features')
        },
        {
            key: 'spells',
            icon: <GiSpellBook size={20} />,
            label: T('game.dnd5.common.spellcasting')
        }
    ];

    const getAddButton = (handler: () => void) =>
        readonly ? undefined : (
            <IconButton size="medium" onClick={handler}>
                <FiPlusCircle />
            </IconButton>
        );

    return (
        <SheetTabs
            logoSvgComponent={DnD5Logo}
            tabs={sheetTabs}
            selectedIndex={tabIndex}
            onChange={(idx) => setTabIndex(idx)}
        >
            {/* bio & story */}
            {sheetTabs[tabIndex].key === 'biographyAndStory'
                ? [
                      // biography
                      <Box key="dnd5-biography" gridColumn="span 9">
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
                      </Box>,
                      // portrait
                      <Box key="dnd5-portrait" gridColumn="span 3">
                          <Portrait
                              value={portrait}
                              readonly={readonly}
                              onChange={onPortraitChange}
                          />
                      </Box>,
                      // story
                      <Box key="dnd5-story" gridColumn="span 12">
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
                      </Box>
                  ]
                : null}
            {/* abilities & skills */}
            {sheetTabs[tabIndex].key === 'abilitiesAndSkills' ? (
                <Box
                    key="dnd5-abilitiesAndSkills"
                    gridColumn="span 12"
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    columnGap={6}
                    rowGap={4}
                >
                    <Box gridColumn="span 6">
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
                    </Box>
                    <Box gridColumn="span 6">
                        {/* skills */}
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
                    </Box>
                </Box>
            ) : null}
            {/* combat & attacks */}
            {sheetTabs[tabIndex].key === 'combat'
                ? [
                      // combat
                      <Box key="dnd5-combat" gridColumn="span 12">
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
                      </Box>,
                      // attacks
                      <Box key="dnd5-attacks" gridColumn="span 12">
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
                      </Box>
                  ]
                : null}
            {/* features & equipment */}
            {sheetTabs[tabIndex].key === 'featuresAndEquipment'
                ? [
                      // features
                      <Box key="dnd5-features" gridColumn="span 12">
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
                      </Box>,
                      // equipment
                      <Box key="dnd5-equipment" gridColumn="span 12">
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
                      </Box>
                  ]
                : null}
            {/* spells */}
            {sheetTabs[tabIndex].key === 'spells' ? (
                // spellcasting
                <Box key="dnd5-spellcasting" gridColumn="span 12">
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
                </Box>
            ) : null}
        </SheetTabs>
    );
};

export default DnD5Sheet;
