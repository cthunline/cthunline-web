import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { Box } from '@mui/material';

import {
    SWD6CharacterData,
    SWD6Biography,
    SWD6Attribute,
    SWD6AttributeData,
    SWD6Skill,
    SWD6Statistics,
    SWD6WoundStatus,
    SWD6Weapon,
    SWD6Story
} from '../../../../types/games/starWarsD6';
import { CharacterData, GameId } from '../../../../types';
import SectionTitle from '../generic/sectionTitle/SectionTitle';
import FieldLayout, { Field } from '../generic/fieldLayout/FieldLayout';
import Portrait from '../generic/portrait/Portrait';
import Attributes from './sections/attributes/Attributes';
import Statistics from './sections/statistics/Statistics';
import WoundStatus from './sections/woundStatus/WoundStatus';
import Weapons from './sections/weapons/Weapons';
import { controlCharacterData } from './swd6Sheet.helper';
import fields from './fields.json';

const biographyFields = fields.biography as Field<SWD6Biography>[];
const storyFields = fields.story as Field<SWD6Story>[];

export interface SWD6SheetProps {
    readonly: boolean;
    data: SWD6CharacterData;
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
    const [characterData, setCharacterData] = useState<SWD6CharacterData>(data);

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
    }, []);

    const onSkillCreate = useCallback((
        attribute: SWD6Attribute,
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
                    skills: previous.attributes[attribute].skills.map((skill, idx) => (
                        idx === skillIndex ? skillData : skill
                    ))
                }
            }
        }));
    }, []);

    const onSkillDelete = useCallback((
        attribute: SWD6Attribute,
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

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" columnGap={2} rowGap={4}>
            {/* biography */}
            <Box gridColumn="span 9">
                <SectionTitle text="Biography" />
                <FieldLayout<SWD6Biography>
                    gameId={GameId.starWarsD6}
                    fields={biographyFields}
                    textSectionKey="biography"
                    data={characterData.biography}
                    readonly={readonly}
                    onChange={onBiographyChange}
                />
            </Box>
            {/* portrait */}
            <Box gridColumn="span 3">
                <Portrait
                    base64={characterData.portrait}
                    readonly={readonly}
                    onChange={onPortraitChange}
                />
            </Box>
            {/* attributes */}
            <Box gridColumn="span 12">
                <SectionTitle text="Attributes & Skills" />
                <Attributes
                    attributes={characterData.attributes}
                    readonly={readonly}
                    onChange={onAttributeChange}
                    onSkillCreate={onSkillCreate}
                    onSkillChange={onSkillChange}
                    onSkillDelete={onSkillDelete}
                />
            </Box>
            {/* statistics */}
            <Box gridColumn="span 6">
                <SectionTitle text="Statistics" />
                <Statistics
                    statistics={characterData.statistics}
                    readonly={readonly}
                    onChange={onStatisticsChange}
                />
            </Box>
            {/* wound status */}
            <Box gridColumn="span 6">
                <SectionTitle text="Wound status" />
                <WoundStatus
                    woundStatus={characterData.woundStatus}
                    readonly={readonly}
                    onChange={onWoundStatusChange}
                />
            </Box>
            {/* weapons */}
            <Box gridColumn="span 12">
                <SectionTitle text="Weapons" />
                <Weapons
                    weapons={characterData.weapons}
                    readonly={readonly}
                    onCreate={onWeaponCreate}
                    onChange={onWeaponChange}
                    onDelete={onWeaponDelete}
                />
            </Box>
            {/* story */}
            <FieldLayout<SWD6Story>
                gameId={GameId.starWarsD6}
                fields={storyFields}
                textSectionKey="story"
                data={characterData.story}
                readonly={readonly}
                onChange={onStoryChange}
            />
        </Box>
    );
};

export default SWD6Sheet;
