import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { Box, Typography } from '@mui/material';

import {
    SWD6CharacterData,
    SWD6Biography,
    SWD6Attribute,
    SWD6AttributeData,
    SWD6Skill
    // SWD6Statistics,
    // SWD6WoundStatus,
    // SWD6Story,
    // SWD6Weapon
} from '../../../../types/games/starWarsD6';
import { CharacterData } from '../../../../types';
import Portrait from '../generic/portrait/Portrait';
import Biography from './sections/biography/Biography';
import Attribute from './sections/attributes/Attribute';
// import { controlCharacterData } from './swd6Sheet.helper';

export interface SWD6SheetProps {
    readonly: boolean;
    data: SWD6CharacterData;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
}

const SWD6Sheet: React.FC<SWD6SheetProps> = ({
    readonly,
    data,
    onChange
}) => {
    const [characterData, setCharacterData] = useState<SWD6CharacterData>(data);

    useEffect(() => {
        setCharacterData(data);
    }, [
        data
    ]);

    const initialRender = useRef(true);
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
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

    // const onSkillDelete = useCallback((
    //     attribute: SWD6Attribute,
    //     skillIndex: number
    // ) => {
    //     setCharacterData((previous) => ({
    //         ...previous,
    //         attributes: {
    //             ...previous.attributes,
    //             [attribute]: {
    //                 ...previous.attributes[attribute],
    //                 skills: previous.attributes[attribute].skills.filter((skill, idx) => (
    //                     idx !== skillIndex
    //                 ))
    //             }
    //         }
    //     }));
    // }, []);

    // const onStatisticsChange = useCallback((statistics: SWD6Statistics) => {
    //     setCharacterData((previous) => ({
    //         ...previous,
    //         statistics
    //     }));
    // }, []);

    // const onWoundStatusChange = useCallback((woundStatus: SWD6WoundStatus) => {
    //     setCharacterData((previous) => (
    //         controlCharacterData({
    //             ...previous,
    //             woundStatus
    //         })
    //     ));
    // }, []);

    // const onStoryChange = useCallback((story: SWD6Story) => {
    //     setCharacterData((previous) => ({
    //         ...previous,
    //         story
    //     }));
    // }, []);

    // const onWeaponCreate = useCallback((weaponData: SWD6Weapon) => {
    //     setCharacterData((previous) => ({
    //         ...previous,
    //         weapons: [
    //             ...previous.weapons,
    //             weaponData
    //         ].sort((a, b) => (
    //             a.name.localeCompare(b.name)
    //         ))
    //     }));
    // }, []);

    // const onWeaponChange = useCallback((weaponIndex: number, weaponData: SWD6Weapon) => {
    //     setCharacterData((previous) => ({
    //         ...previous,
    //         weapons: previous.weapons.map((weapon, idx) => (
    //             idx === weaponIndex ? weaponData : weapon
    //         ))
    //     }));
    // }, []);

    // const onWeaponDelete = useCallback((weaponIndex: number) => {
    //     setCharacterData((previous) => ({
    //         ...previous,
    //         weapons: previous.weapons.filter((s, idx) => (
    //             idx !== weaponIndex
    //         ))
    //     }));
    // }, []);

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            {/* biography */}
            <Box gridColumn="span 9" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Typography variant="h6" gridColumn="span 12">
                    Biography
                </Typography>
                <Box gridColumn="span 12">
                    <Biography
                        readonly={readonly}
                        biography={characterData.biography}
                        onChange={onBiographyChange}
                    />
                </Box>
            </Box>
            {/* portrait */}
            <Box gridColumn="span 3" gridRow="span 2">
                <Portrait
                    base64={characterData.portrait}
                    readonly={readonly}
                    onChange={onPortraitChange}
                />
            </Box>
            {/* attributes */}
            <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Typography variant="h6" gridColumn="span 12">
                    Attributes & Skills
                </Typography>
                <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    {(Object.keys(data.attributes) as SWD6Attribute[]).map((attribute) => (
                        <Attribute
                            key={`attribute-${attribute}`}
                            attribute={attribute}
                            data={data.attributes[attribute]}
                            readonly={readonly}
                            onChange={onAttributeChange}
                            onSkillChange={onSkillChange}
                            onSkillCreate={onSkillCreate}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default SWD6Sheet;
