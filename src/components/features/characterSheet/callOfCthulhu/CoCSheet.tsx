import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Group, Stack } from '@mantine/core';
import {
    GiCharacter,
    GiD10,
    GiPistolGun,
    GiOpenBook,
    GiBodyBalance,
    GiHeartBeats,
    GiStrong
} from 'react-icons/gi';
import {
    type CoCCharacter,
    type CoCBiography,
    type CoCStatus,
    type CoCSkill,
    type CoCCharacteristics,
    type CoCPoints,
    type CoCWeapon,
    type CoCStory
} from '@cthunline/games';

import {
    type CharacterData,
    GameId,
    type CharacterSheetStatus
} from '../../../../types/index.js';
import SheetTabs, { type SheetTab } from '../generic/sheetTabs/SheetTabs.js';
import SectionTitle from '../generic/sectionTitle/SectionTitle.js';
import Characteristics from './characteristics/Characteristics.js';
import FieldLayout from '../generic/fieldLayout/FieldLayout.js';
import { controlCharacterData } from './cocSheet.helper.js';
import { biographyFields, storyFields } from './fields.js';
import CoCLogo from '../../../svg/games/CallOfCthulhu.js';
import Portrait from '../generic/portrait/Portrait.js';
import { useApp } from '../../../contexts/App.js';
import Weapons from './weapons/Weapons.js';
import Status from './status/Status.js';
import Skills from './skills/Skills.js';
import Combat from './combat/Combat.js';

export interface CoCSheetProps {
    status: CharacterSheetStatus;
    readonly: boolean;
    data: CoCCharacter;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
    portrait: string | null;
    onPortraitChange?: (file: File | null) => void;
}

const CoCSheet = ({
    status,
    readonly,
    data,
    listening,
    onChange,
    portrait,
    onPortraitChange
}: CoCSheetProps) => {
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<CoCCharacter>(data);
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
            const { name, occupation } = characterData.biography;
            const properName = name || '[No Name]';
            const properOccupation = occupation ? `(${occupation})` : '';
            const characterName = `${properName} ${properOccupation}`;
            onChange(characterName, characterData);
        }
    }, [readonly, onChange, characterData]);

    const onBiographyChange = useCallback((biography: CoCBiography) => {
        setCharacterData((previous) =>
            controlCharacterData({
                ...previous,
                biography
            })
        );
    }, []);

    const onCharacteristicsChange = useCallback(
        (partialChars: Partial<CoCCharacteristics>) => {
            setCharacterData((previous) =>
                controlCharacterData({
                    ...previous,
                    characteristics: {
                        ...previous.characteristics,
                        ...partialChars
                    }
                })
            );
        },
        []
    );

    const onPointsChange = useCallback((partialPoints: Partial<CoCPoints>) => {
        setCharacterData((previous) =>
            controlCharacterData({
                ...previous,
                points: {
                    ...previous.points,
                    ...partialPoints
                }
            })
        );
    }, []);

    const onLuckOrSanityChange = useCallback(
        (partialData: Partial<CoCCharacter>) => {
            setCharacterData((previous) =>
                controlCharacterData({
                    ...previous,
                    ...partialData
                })
            );
        },
        []
    );

    const onStatusChange = useCallback((cocStatus: CoCStatus) => {
        setCharacterData((previous) => ({
            ...previous,
            status: cocStatus
        }));
    }, []);

    const onSkillChange = useCallback(
        (index: number, updatedSkill: CoCSkill) => {
            setCharacterData((previous) => ({
                ...previous,
                skills: previous.skills.map((skill, idx) =>
                    idx === index ? updatedSkill : skill
                )
            }));
        },
        []
    );

    const onSkillDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            skills: previous.skills.filter((_s, idx) => idx !== index)
        }));
    }, []);

    const onSkillCreate = useCallback((newSkill: CoCSkill) => {
        setCharacterData((previous) => ({
            ...previous,
            skills: [...previous.skills, newSkill].sort((a, b) =>
                a.name.localeCompare(b.name)
            )
        }));
    }, []);

    const onWeaponChange = useCallback(
        (index: number, updatedWeapon: CoCWeapon) => {
            setCharacterData((previous) => ({
                ...previous,
                weapons: previous.weapons.map((weapon, idx) =>
                    idx === index ? updatedWeapon : weapon
                )
            }));
        },
        []
    );

    const onWeaponDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: previous.weapons.filter((_s, idx) => idx !== index)
        }));
    }, []);

    const onWeaponCreate = useCallback((newWeapon: CoCWeapon) => {
        setCharacterData((previous) => ({
            ...previous,
            weapons: [...previous.weapons, newWeapon].sort((a, b) =>
                a.name.localeCompare(b.name)
            )
        }));
    }, []);

    const onStoryChange = useCallback((story: CoCStory) => {
        setCharacterData((previous) => ({
            ...previous,
            story
        }));
    }, []);

    const sheetTabs: Record<string, SheetTab> = {
        biographyAndStory: {
            key: 'biographyAndStory',
            icon: <GiCharacter size={20} />,
            label: T('game.callOfCthulhu.common.biography')
        },
        characteristicsAndSkills: {
            key: 'characteristicsAndSkills',
            icon: <GiD10 size={20} />,
            label: T('game.callOfCthulhu.common.characteristics')
        },
        combat: {
            key: 'combat',
            icon: <GiPistolGun size={20} />,
            label: T('game.callOfCthulhu.common.combat')
        }
    };

    return (
        <SheetTabs
            readonly={readonly}
            status={status}
            logoSvgComponent={CoCLogo}
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
                                text={T('game.callOfCthulhu.common.biography')}
                            />
                            <FieldLayout<CoCBiography>
                                textSectionKey="biography"
                                gameId={GameId.callOfCthulhu}
                                fields={biographyFields}
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
                        text={T('game.callOfCthulhu.common.story')}
                    />
                    <FieldLayout<CoCStory>
                        gameId={GameId.callOfCthulhu}
                        fields={storyFields}
                        textSectionKey="story"
                        data={characterData.story}
                        readonly={readonly}
                        onChange={onStoryChange}
                    />
                </Stack>
            )}
            {/* characteristics & skills */}
            {sheetTabs[tabValue]?.key === 'characteristicsAndSkills' && (
                <Stack w="100%">
                    {/* characteristics */}
                    <SectionTitle
                        iconBefore={<GiD10 size={20} />}
                        text={T('game.callOfCthulhu.common.characteristics')}
                    />
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
                    {/* skills */}
                    <SectionTitle
                        iconBefore={<GiBodyBalance size={20} />}
                        text={T('game.callOfCthulhu.common.skills')}
                    />
                    <Skills
                        readonly={readonly}
                        skills={characterData.skills}
                        onChange={onSkillChange}
                        onDelete={onSkillDelete}
                        onCreate={onSkillCreate}
                    />
                </Stack>
            )}
            {/* combat & status */}
            {sheetTabs[tabValue]?.key === 'combat' && (
                <Stack w="100%">
                    {/* status */}
                    <SectionTitle
                        iconBefore={<GiHeartBeats size={20} />}
                        text={T('game.callOfCthulhu.common.status')}
                    />
                    <Status
                        readonly={readonly}
                        status={characterData.status}
                        onChange={onStatusChange}
                    />
                    {/* combat */}
                    <SectionTitle
                        iconBefore={<GiStrong size={20} />}
                        text={T('game.callOfCthulhu.common.combat')}
                    />
                    <Combat combat={data.combat} />
                    {/* weapons */}
                    <SectionTitle
                        iconBefore={<GiPistolGun size={20} />}
                        text={T('game.callOfCthulhu.common.weapons')}
                    />
                    <Weapons
                        readonly={readonly}
                        weapons={characterData.weapons}
                        onChange={onWeaponChange}
                        onDelete={onWeaponDelete}
                        onCreate={onWeaponCreate}
                    />
                </Stack>
            )}
        </SheetTabs>
    );
};

export default CoCSheet;
