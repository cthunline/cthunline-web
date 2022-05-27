import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { Box } from '@mui/material';
import {
    GiCharacter,
    GiPerspectiveDiceSixFacesSix,
    GiLightSabers
} from 'react-icons/gi';
import {
    SWD6Character,
    SWD6Biography,
    SWD6AttributeKey,
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
import { ReactComponent as SWD6Logo } from '../../../../assets/games/starWarsD6.svg';
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
}

const SWD6Sheet: React.FC<SWD6SheetProps> = ({
    readonly,
    data,
    listening,
    onChange
}) => {
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<SWD6Character>(data);
    const [tabIndex, setTabIndex] = useState<number>(0);

    useEffect(() => {
        if (listening) {
            setCharacterData(data);
        }
    }, [
        listening,
        data
    ]);

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
    }, [
        readonly,
        onChange,
        characterData
    ]);

    const onBiographyChange = useCallback((biography: SWD6Biography) => {
        setCharacterData((previous) => ({
            ...previous,
            biography
        }));
    }, []);

    const onPortraitChange = useCallback((portrait: string) => {
        setCharacterData((previous) => ({
            ...previous,
            portrait
        }));
    }, []);

    const onAttributeChange = useCallback((
        attribute: SWD6AttributeKey,
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
    }, []);

    const onSkillCreate = useCallback((
        attribute: SWD6AttributeKey,
        skillData: SWD6Skill
    ) => {
        setCharacterData((previous) => ({
            ...previous,
            attributes: {
                ...previous.attributes,
                [attribute]: {
                    ...previous.attributes[attribute],
                    skills: [
                        ...previous.attributes[attribute].skills,
                        skillData
                    ].sort((a, b) => (
                        a.name.localeCompare(b.name)
                    ))
                }
            }
        }));
    }, []);

    const onSkillChange = useCallback((
        attribute: SWD6AttributeKey,
        skillIndex: number,
        skillData: SWD6Skill
    ) => {
        setCharacterData((previous) => ({
            ...previous,
            attributes: {
                ...previous.attributes,
                [attribute]: {
                    ...previous.attributes[attribute],
                    skills: previous.attributes[attribute].skills.map((skill, idx) => (
                        idx === skillIndex ? skillData : skill
                    ))
                }
            }
        }));
    }, []);

    const onSkillDelete = useCallback((
        attribute: SWD6AttributeKey,
        skillIndex: number
    ) => {
        setCharacterData((previous) => ({
            ...previous,
            attributes: {
                ...previous.attributes,
                [attribute]: {
                    ...previous.attributes[attribute],
                    skills: previous.attributes[attribute].skills.filter((skill, idx) => (
                        idx !== skillIndex
                    ))
                }
            }
        }));
    }, []);

    const onStatisticsChange = useCallback((statistics: SWD6Statistics) => {
        setCharacterData((previous) => ({
            ...previous,
            statistics
        }));
    }, []);

    const onWoundStatusChange = useCallback((woundStatus: SWD6WoundStatus) => {
        setCharacterData((previous) => (
            controlCharacterData({
                ...previous,
                woundStatus
            })
        ));
    }, []);

    const onWeaponCreate = useCallback((weaponData: SWD6Weapon) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: [
                ...previous.weapons,
                weaponData
            ].sort((a, b) => (
                a.name.localeCompare(b.name)
            ))
        }));
    }, []);

    const onWeaponChange = useCallback((weaponIndex: number, weaponData: SWD6Weapon) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: previous.weapons.map((weapon, idx) => (
                idx === weaponIndex ? weaponData : weapon
            ))
        }));
    }, []);

    const onWeaponDelete = useCallback((weaponIndex: number) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: previous.weapons.filter((s, idx) => (
                idx !== weaponIndex
            ))
        }));
    }, []);

    const onStoryChange = useCallback((story: SWD6Story) => {
        setCharacterData((previous) => ({
            ...previous,
            story
        }));
    }, []);

    const sheetTabs: SheetTab[] = [{
        key: 'biography',
        icon: <GiCharacter size={20} />,
        label: T('game.starWarsD6.common.biography')
    }, {
        key: 'attributesAndSkills',
        icon: <GiPerspectiveDiceSixFacesSix size={20} />,
        label: T('game.starWarsD6.common.attributesAndSkills')
    }, {
        key: 'weapons',
        icon: <GiLightSabers size={20} />,
        label: T('game.starWarsD6.common.weapons')
    }];

    return (
        <SheetTabs
            logoSvgComponent={SWD6Logo}
            tabs={sheetTabs}
            selectedIndex={tabIndex}
            onChange={(idx) => setTabIndex(idx)}
        >
            {/* bio & background */}
            {sheetTabs[tabIndex].key === 'biography' ? [
                // biography
                <Box gridColumn="span 9">
                    <SectionTitle text={T('game.starWarsD6.common.biography')} />
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
                <Box gridColumn="span 3">
                    <Portrait
                        base64={characterData.portrait}
                        readonly={readonly}
                        onChange={onPortraitChange}
                    />
                </Box>,
                // story
                <FieldLayout<SWD6Story>
                    gameId={GameId.starWarsD6}
                    fields={storyFields}
                    textSectionKey="story"
                    data={characterData.story}
                    readonly={readonly}
                    onChange={onStoryChange}
                />
            ] : null}
            {/* attributes & skills */}
            {sheetTabs[tabIndex].key === 'attributesAndSkills' ? [
                // attributes and skills
                <Box gridColumn="span 12">
                    <SectionTitle text={T('game.starWarsD6.common.attributesAndSkills')} />
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
                <Box gridColumn="span 6">
                    <SectionTitle text={T('game.starWarsD6.common.statistics')} />
                    <Statistics
                        statistics={characterData.statistics}
                        readonly={readonly}
                        onChange={onStatisticsChange}
                    />
                </Box>,
                // wound status
                <Box gridColumn="span 6">
                    <SectionTitle text={T('game.starWarsD6.common.woundStatus')} />
                    <WoundStatus
                        woundStatus={characterData.woundStatus}
                        readonly={readonly}
                        onChange={onWoundStatusChange}
                    />
                </Box>
            ] : null}
            {/* weapons */}
            {sheetTabs[tabIndex].key === 'weapons' ? (
                // weapons
                <Box gridColumn="span 12">
                    <SectionTitle text={T('game.starWarsD6.common.weapons')} />
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
