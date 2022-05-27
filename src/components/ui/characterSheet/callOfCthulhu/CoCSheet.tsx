import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { Box } from '@mui/material';
import {
    GiCharacter,
    GiD10,
    GiPistolGun
} from 'react-icons/gi';
import {
    CoCCharacter,
    CoCBiography,
    CoCStatus,
    CoCSkill,
    CoCCharacteristics,
    CoCPoints,
    CoCWeapon,
    CoCStory
} from '@cthunline/games';

import { useApp } from '../../../contexts/App';
import { CharacterData, GameId } from '../../../../types';
import SheetTabs, { SheetTab } from '../generic/sheetTabs/SheetTabs';
import SectionTitle from '../generic/sectionTitle/SectionTitle';
import FieldLayout, { Field } from '../generic/fieldLayout/FieldLayout';
import Portrait from '../generic/portrait/Portrait';
import Characteristics from './characteristics/Characteristics';
import Status from './status/Status';
import Skills from './skills/Skills';
import Combat from './combat/Combat';
import Weapons from './weapons/Weapons';
import { ReactComponent as CoCLogo } from '../../../../assets/games/callOfCthulhu.svg';
import { controlCharacterData } from './cocSheet.helper';
import fields from './fields.json';

const biographyFields = fields.biography as Field<CoCBiography>[];
const storyFields = fields.story as Field<CoCStory>[];

export interface CoCSheetProps {
    readonly: boolean;
    data: CoCCharacter;
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
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<CoCCharacter>(data);
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

    const onLuckOrSanityChange = useCallback((partialData: Partial<CoCCharacter>) => {
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

    const sheetTabs: SheetTab[] = [{
        key: 'biographyAndStory',
        icon: <GiCharacter size={20} />,
        label: T('game.callOfCthulhu.common.biography')
    }, {
        key: 'characteristicsAndSkills',
        icon: <GiD10 size={20} />,
        label: T('game.callOfCthulhu.common.characteristics')
    }, {
        key: 'combat',
        icon: <GiPistolGun size={20} />,
        label: T('game.callOfCthulhu.common.combat')
    }];

    return (
        <SheetTabs
            logoSvgComponent={CoCLogo}
            tabs={sheetTabs}
            selectedIndex={tabIndex}
            onChange={(idx) => setTabIndex(idx)}
        >
            {/* bio & story */}
            {sheetTabs[tabIndex].key === 'biographyAndStory' ? [
                // biography
                <Box gridColumn="span 9">
                    <SectionTitle text={T('game.callOfCthulhu.common.biography')} />
                    <FieldLayout<CoCBiography>
                        gameId={GameId.callOfCthulhu}
                        fields={biographyFields}
                        textSectionKey="biography"
                        data={characterData.biography}
                        readonly={readonly}
                        onChange={onBiographyChange}
                    />
                </Box>,
                // portrait
                <Box gridColumn="span 3" gridRow="span 2">
                    <Portrait
                        base64={characterData.portrait}
                        readonly={readonly}
                        onChange={onPortraitChange}
                    />
                </Box>,
                // story
                <SectionTitle text={T('game.callOfCthulhu.common.story')} gridColumn="span 9" />,
                <FieldLayout<CoCStory>
                    gameId={GameId.callOfCthulhu}
                    fields={storyFields}
                    textSectionKey="story"
                    data={characterData.story}
                    readonly={readonly}
                    onChange={onStoryChange}
                />
            ] : null}
            {/* characteristics & skills */}
            {sheetTabs[tabIndex].key === 'characteristicsAndSkills' ? [
                // characteristics
                <SectionTitle text={T('game.callOfCthulhu.common.characteristics')} gridColumn="span 9" />,
                <Characteristics
                    readonly={readonly}
                    characteristics={characterData.characteristics}
                    points={characterData.points}
                    luck={characterData.luck}
                    sanity={characterData.sanity}
                    onCharacteristicsChange={onCharacteristicsChange}
                    onPointsChange={onPointsChange}
                    onLuckOrSanityChange={onLuckOrSanityChange}
                />,
                // skills
                <Box gridColumn="span 12">
                    <SectionTitle text={T('game.callOfCthulhu.common.skills')} />
                    <Skills
                        readonly={readonly}
                        skills={characterData.skills}
                        onChange={onSkillChange}
                        onDelete={onSkillDelete}
                        onCreate={onSkillCreate}
                    />
                </Box>
            ] : null}
            {/* combat & status */}
            {sheetTabs[tabIndex].key === 'combat' ? [
                // status
                <Box gridColumn="span 12">
                    <SectionTitle text={T('game.callOfCthulhu.common.status')} />
                    <Status
                        readonly={readonly}
                        status={characterData.status}
                        onChange={onStatusChange}
                    />
                </Box>,
                // combat
                <Box gridColumn="span 12">
                    <SectionTitle text={T('game.callOfCthulhu.common.combat')} />
                    <Combat combat={data.combat} />
                </Box>,
                // weapons
                <Box gridColumn="span 12">
                    <SectionTitle text={T('game.callOfCthulhu.common.weapons')} />
                    <Weapons
                        readonly={readonly}
                        weapons={characterData.weapons}
                        onChange={onWeaponChange}
                        onDelete={onWeaponDelete}
                        onCreate={onWeaponCreate}
                    />
                </Box>
            ] : null}
        </SheetTabs>
    );
};

export default CoCSheet;
