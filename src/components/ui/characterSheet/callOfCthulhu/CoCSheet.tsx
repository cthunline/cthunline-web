import React, {
    useCallback,
    useEffect,
    useState
} from 'react';
import { Box, Typography } from '@mui/material';

import {
    CoCCharacterData,
    CoCBiography,
    CoCStatus,
    CoCSkill,
    CoCCharacteristics,
    CoCPoints,
    CoCWeapon
} from '../../../../types/games/callOfCthulhu';
import { CharacterData } from '../../../../types';
import Biography from './sections/biography/Biography';
import Characteristics from './sections/characteristics/Characteristics';
import Status from './sections/status/Status';
import Skills from './sections/skills/Skills';
import Weapons from './sections/weapons/Weapons';

export interface CoCSheetProps {
    readonly: boolean;
    data: CoCCharacterData;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
}

const CoCSheet: React.FC<CoCSheetProps> = ({
    readonly,
    data,
    onChange
}) => {
    const [characterData, setCharacterData] = useState<CoCCharacterData>(data);

    useEffect(() => {
        const { name, occupation } = characterData.biography;
        const characterName = `${name} (${occupation})`;
        onChange(characterName, characterData);
    }, [
        onChange,
        characterData
    ]);

    const onBiographyChange = useCallback((biography: CoCBiography) => {
        setCharacterData((previous) => ({
            ...previous,
            biography
        }));
    }, []);

    const onCharacteristicsChange = useCallback((partialChars: Partial<CoCCharacteristics>) => {
        setCharacterData((previous) => ({
            ...previous,
            characteristics: {
                ...previous.characteristics,
                ...partialChars
            }
        }));
    }, []);

    const onPointsChange = useCallback((partialPoints: Partial<CoCPoints>) => {
        setCharacterData((previous) => ({
            ...previous,
            points: {
                ...previous.points,
                ...partialPoints
            }
        }));
    }, []);

    const onLuckOrSanityChange = useCallback((partialData: Partial<CoCCharacterData>) => {
        setCharacterData((previous) => ({
            ...previous,
            ...partialData
        }));
    }, []);

    const onStatusChange = useCallback((status: CoCStatus) => {
        setCharacterData((previous) => ({
            ...previous,
            status
        }));
    }, []);

    const onSkillChange = useCallback((index: number, updatedSkill: CoCSkill) => {
        setCharacterData((previous) => ({
            ...previous,
            skills: previous.skills.map((skill, idx) => (
                idx === index ? updatedSkill : skill
            ))
        }));
    }, []);

    const onSkillDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            skills: previous.skills.filter((s, idx) => (
                idx !== index
            ))
        }));
    }, []);

    const onSkillCreate = useCallback((newSkill: CoCSkill) => {
        setCharacterData((previous) => ({
            ...previous,
            skills: [
                ...previous.skills,
                newSkill
            ].sort((a, b) => (
                a.name.localeCompare(b.name)
            ))
        }));
    }, []);

    const onWeaponChange = useCallback((index: number, updatedWeapon: CoCWeapon) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: previous.weapons.map((weapon, idx) => (
                idx === index ? updatedWeapon : weapon
            ))
        }));
    }, []);

    const onWeaponDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: previous.weapons.filter((s, idx) => (
                idx !== index
            ))
        }));
    }, []);

    const onWeaponCreate = useCallback((newWeapon: CoCWeapon) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: [
                ...previous.weapons,
                newWeapon
            ].sort((a, b) => (
                a.name.localeCompare(b.name)
            ))
        }));
    }, []);

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
            <Box gridColumn="span 3" gridRow="span 2" style={{ background: 'grey' }} />
            {/* characteristics */}
            <Typography variant="h6" gridColumn="span 9">
                Characteristics
            </Typography>
            <Box gridColumn="span 12">
                <Characteristics
                    readonly={readonly}
                    characteristics={characterData.characteristics}
                    points={characterData.points}
                    luck={characterData.luck}
                    sanity={characterData.sanity}
                    onCharacteristicsChange={onCharacteristicsChange}
                    onPointsChange={onPointsChange}
                    onLuckOrSanityChange={onLuckOrSanityChange}
                />
            </Box>
            {/* status */}
            <Typography variant="h6" gridColumn="span 12">
                Status
            </Typography>
            <Box gridColumn="span 12">
                <Status
                    readonly={readonly}
                    status={characterData.status}
                    onChange={onStatusChange}
                />
            </Box>
            {/* skills */}
            <Typography variant="h6" gridColumn="span 12">
                Skills
            </Typography>
            <Box gridColumn="span 12">
                <Skills
                    readonly={readonly}
                    skills={characterData.skills}
                    onChange={onSkillChange}
                    onDelete={onSkillDelete}
                    onCreate={onSkillCreate}
                />
            </Box>
            {/* weapons */}
            <Typography variant="h6" gridColumn="span 12">
                Weapons
            </Typography>
            <Box gridColumn="span 12">
                <Weapons
                    readonly={readonly}
                    weapons={characterData.weapons}
                    onChange={onWeaponChange}
                    onDelete={onWeaponDelete}
                    onCreate={onWeaponCreate}
                />
            </Box>
        </Box>
    );
};

export default CoCSheet;
