import { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import {
    GiCharacter,
    GiPerspectiveDiceSixFacesSix,
    GiLightSabers,
    GiRollingDices,
    GiHeartBeats,
    GiChart
} from 'react-icons/gi';
import {
    SWD6Character,
    SWD6Biography,
    SWD6Attribute,
    SWD6AttributeData,
    SWD6Skill,
    SWD6Statistics,
    SWD6WoundStatus,
    SWD6Weapon,
    SWD6Story
} from '@cthunline/games';

import { CharacterData, GameId } from '../../../../types';
import { useApp } from '../../../contexts/App';
import SheetTabs, { SheetTab } from '../generic/sheetTabs/SheetTabs';
import SectionTitle from '../generic/sectionTitle/SectionTitle';
import FieldLayout, { Field } from '../generic/fieldLayout/FieldLayout';
import Portrait from '../generic/portrait/Portrait';
import Attributes from './attributes/Attributes';
import Statistics from './statistics/Statistics';
import WoundStatus from './woundStatus/WoundStatus';
import Weapons from './weapons/Weapons';
import SWD6Logo from '../../../svg/games/StarWarsD6';
import { controlCharacterData } from './swd6Sheet.helper';
import fields from './fields.json';

const biographyFields = fields.biography as Field<SWD6Biography>[];
const storyFields = fields.story as Field<SWD6Story>[];

export interface SWD6SheetProps {
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
    readonly,
    data,
    listening,
    onChange,
    portrait,
    onPortraitChange
}: SWD6SheetProps) => {
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<SWD6Character>(data);
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
            const { name, occupation } = characterData.biography;
            const properName = name ?? '[No Name]';
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

    const sheetTabs: SheetTab[] = [
        {
            key: 'biography',
            icon: <GiCharacter size={20} />,
            label: T('game.starWarsD6.common.biography')
        },
        {
            key: 'attributesAndSkills',
            icon: <GiPerspectiveDiceSixFacesSix size={20} />,
            label: T('game.starWarsD6.common.attributesAndSkills')
        },
        {
            key: 'weapons',
            icon: <GiLightSabers size={20} />,
            label: T('game.starWarsD6.common.weapons')
        }
    ];

    return (
        <SheetTabs
            logoSvgComponent={SWD6Logo}
            tabs={sheetTabs}
            selectedIndex={tabIndex}
            onChange={(idx) => setTabIndex(idx)}
        >
            {/* bio & background */}
            {sheetTabs[tabIndex].key === 'biography'
                ? [
                      // biography
                      <Box key="swd6-biography" gridColumn="span 9">
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
                      </Box>,
                      // portrait
                      <Box key="swd6-portrait" gridColumn="span 3">
                          <Portrait
                              value={portrait}
                              readonly={readonly}
                              onChange={onPortraitChange}
                          />
                      </Box>,
                      // story
                      <FieldLayout<SWD6Story>
                          key="swd6-story"
                          gameId={GameId.starWarsD6}
                          fields={storyFields}
                          textSectionKey="story"
                          data={characterData.story}
                          readonly={readonly}
                          onChange={onStoryChange}
                      />
                  ]
                : null}
            {/* attributes & skills */}
            {sheetTabs[tabIndex].key === 'attributesAndSkills'
                ? [
                      // attributes and skills
                      <Box key="swd6-attributesAndSkills" gridColumn="span 12">
                          <SectionTitle
                              iconBefore={<GiRollingDices size={20} />}
                              text={T(
                                  'game.starWarsD6.common.attributesAndSkills'
                              )}
                          />
                          <Attributes
                              attributes={characterData.attributes}
                              readonly={readonly}
                              onChange={onAttributeChange}
                              onSkillCreate={onSkillCreate}
                              onSkillChange={onSkillChange}
                              onSkillDelete={onSkillDelete}
                          />
                      </Box>,
                      // statistics
                      <Box key="swd6-statistics" gridColumn="span 6">
                          <SectionTitle
                              iconBefore={<GiChart size={20} />}
                              text={T('game.starWarsD6.common.statistics')}
                          />
                          <Statistics
                              statistics={characterData.statistics}
                              readonly={readonly}
                              onChange={onStatisticsChange}
                          />
                      </Box>,
                      // wound status
                      <Box key="swd6-status" gridColumn="span 6">
                          <SectionTitle
                              iconBefore={<GiHeartBeats size={20} />}
                              text={T('game.starWarsD6.common.woundStatus')}
                          />
                          <WoundStatus
                              woundStatus={characterData.woundStatus}
                              readonly={readonly}
                              onChange={onWoundStatusChange}
                          />
                      </Box>
                  ]
                : null}
            {/* weapons */}
            {sheetTabs[tabIndex].key === 'weapons' ? (
                // weapons
                <Box key="swd6-weapons" gridColumn="span 12">
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
                </Box>
            ) : null}
        </SheetTabs>
    );
};

export default SWD6Sheet;
