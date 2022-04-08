import React, {
    useCallback,
    useEffect,
    useRef,
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
    CoCWeapon,
    CoCStory
} from '../../../../types/games/callOfCthulhu';
import { CharacterData } from '../../../../types';
import FieldLayout from '../generic/fieldLayout/FieldLayout';
import Portrait from '../generic/portrait/Portrait';
import Characteristics from './sections/characteristics/Characteristics';
import Status from './sections/status/Status';
import Skills from './sections/skills/Skills';
import Combat from './sections/combat/Combat';
import Weapons from './sections/weapons/Weapons';
import { biographyFields, storyFields } from './cocSheet.data';
import { controlCharacterData } from './cocSheet.helper';

export interface CoCSheetProps {
    readonly: boolean;
    data: CoCCharacterData;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
}

const CoCSheet: React.FC<CoCSheetProps> = ({
    readonly,
    data,
    listening,
    onChange
}) => {
    const [characterData, setCharacterData] = useState<CoCCharacterData>(data);

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

    const onBiographyChange = useCallback((biography: CoCBiography) => {
        setCharacterData((previous) => (
            controlCharacterData({
                ...previous,
                biography
            })
        ));
    }, []);

    const onPortraitChange = useCallback((portrait: string) => {
        setCharacterData((previous) => ({
            ...previous,
            portrait
        }));
    }, []);

    const onCharacteristicsChange = useCallback((partialChars: Partial<CoCCharacteristics>) => {
        setCharacterData((previous) => (
            controlCharacterData({
                ...previous,
                characteristics: {
                    ...previous.characteristics,
                    ...partialChars
                }
            })
        ));
    }, []);

    const onPointsChange = useCallback((partialPoints: Partial<CoCPoints>) => {
        setCharacterData((previous) => (
            controlCharacterData({
                ...previous,
                points: {
                    ...previous.points,
                    ...partialPoints
                }
            })
        ));
    }, []);

    const onLuckOrSanityChange = useCallback((partialData: Partial<CoCCharacterData>) => {
        setCharacterData((previous) => (
            controlCharacterData({
                ...previous,
                ...partialData
            })
        ));
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

    const onStoryChange = useCallback((story: CoCStory) => {
        setCharacterData((previous) => ({
            ...previous,
            story
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
                    <FieldLayout<CoCBiography>
                        fields={biographyFields}
                        data={characterData.biography}
                        readonly={readonly}
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
            {/* combat */}
            <Typography variant="h6" gridColumn="span 12">
                Combat
            </Typography>
            <Box gridColumn="span 12">
                <Combat combat={data.combat} />
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
            {/* story */}
            <Typography variant="h6" gridColumn="span 12">
                Story
            </Typography>
            <Box gridColumn="span 12">
                <FieldLayout<CoCStory>
                    fields={storyFields}
                    data={characterData.story}
                    readonly={readonly}
                    onChange={onStoryChange}
                />
            </Box>
        </Box>
    );
};

export default CoCSheet;
