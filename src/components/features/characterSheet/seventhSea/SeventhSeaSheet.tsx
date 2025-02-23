import type {
    SeventhSeaAdvantage,
    SeventhSeaArcana,
    SeventhSeaBackground,
    SeventhSeaBiography,
    SeventhSeaCharacter,
    SeventhSeaSkills,
    SeventhSeaStory,
    SeventhSeaTraits
} from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import {
    GiArrowScope,
    GiBookmarklet,
    GiCardQueenHearts,
    GiCharacter,
    GiD10,
    GiHandBag,
    GiHeartBeats,
    GiNotebook,
    GiSaberAndPistol,
    GiScrollQuill,
    GiSeaStar,
    GiSkills
} from 'react-icons/gi';

import { useApp } from '../../../../contexts/App.js';
import type {
    CharacterData,
    CharacterSheetStatus
} from '../../../../types/index.js';
import Textarea from '../../../common/Textarea.js';
import SeventhSeaLogo from '../../../svg/games/seventhSea/SeventhSeaLogo.js';
import FieldLayout from '../generic/fieldLayout/FieldLayout.js';
import Portrait from '../generic/portrait/Portrait.js';
import SectionTitle from '../generic/sectionTitle/SectionTitle.js';
import SheetTabs, { type SheetTab } from '../generic/sheetTabs/SheetTabs.js';
import Advantages from './advantages/Advantages.js';
import Backgrounds from './backgrounds/Backgrounds.js';
import Characteristics from './characteristics/Characteristics.js';
import DeathSpiral from './deathSpiral/DeathSpiral.js';
import { arcanaFields, biographyFields } from './fields.js';
import {
    defaultAdvantage,
    defaultBackground,
    defaultStory
} from './seventhSeaSheet.helper.js';
import Stories from './stories/Stories.js';

export interface SeventhSeaSheetProps {
    status: CharacterSheetStatus;
    readonly: boolean;
    data: SeventhSeaCharacter;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
    portrait: string | null;
    onPortraitChange?: (file: File | null) => void;
}

const SeventhSeaSheet = ({
    status,
    readonly,
    data,
    listening,
    onChange,
    portrait,
    onPortraitChange
}: SeventhSeaSheetProps) => {
    const { T } = useApp();

    const [characterData, setCharacterData] =
        useState<SeventhSeaCharacter>(data);
    const [tabValue, setTabValue] = useState<string>('biography');

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
            const { name, concept } = characterData.biography;
            const properName = name || '[No Name]';
            const properConcept = concept ? `(${concept})` : '';
            const characterName = `${properName} ${properConcept}`;
            onChange(characterName, characterData);
        }
    }, [readonly, onChange, characterData]);

    const onBiographyChange = useCallback((biography: SeventhSeaBiography) => {
        setCharacterData((previous) => ({
            ...previous,
            biography
        }));
    }, []);

    const onArcanaChange = useCallback((arcana: SeventhSeaArcana) => {
        setCharacterData((previous) => ({
            ...previous,
            arcana
        }));
    }, []);

    const onBackgroundAdd = useCallback(() => {
        setCharacterData((previous) => ({
            ...previous,
            backgrounds: [...previous.backgrounds, defaultBackground]
        }));
    }, []);

    const onBackgroundChange = useCallback(
        (index: number, background: SeventhSeaBackground) => {
            setCharacterData((previous) => ({
                ...previous,
                backgrounds: previous.backgrounds.map((bck, idx) =>
                    idx === index ? background : bck
                )
            }));
        },
        []
    );

    const onBackgroundDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            backgrounds: previous.backgrounds.filter((_b, idx) => idx !== index)
        }));
    }, []);

    const onStoryAdd = useCallback(() => {
        setCharacterData((previous) => ({
            ...previous,
            stories: [...previous.stories, defaultStory]
        }));
    }, []);

    const onStoryChange = useCallback(
        (index: number, story: SeventhSeaStory) => {
            setCharacterData((previous) => ({
                ...previous,
                stories: previous.stories.map((st, idx) =>
                    idx === index ? story : st
                )
            }));
        },
        []
    );

    const onStoryDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            stories: previous.stories.filter((_s, idx) => idx !== index)
        }));
    }, []);

    const onTraitsChange = useCallback((traits: SeventhSeaTraits) => {
        setCharacterData((previous) => ({
            ...previous,
            traits
        }));
    }, []);

    const onDeathSpiralChange = useCallback((deathSpiral: number) => {
        setCharacterData((previous) => ({
            ...previous,
            deathSpiral
        }));
    }, []);

    const onSkillsChange = useCallback((skills: SeventhSeaSkills) => {
        setCharacterData((previous) => ({
            ...previous,
            skills
        }));
    }, []);

    const onAdvantageAdd = useCallback(() => {
        setCharacterData((previous) => ({
            ...previous,
            advantages: [...previous.advantages, defaultAdvantage]
        }));
    }, []);

    const onAdvantageChange = useCallback(
        (index: number, advantage: SeventhSeaAdvantage) => {
            setCharacterData((previous) => ({
                ...previous,
                advantages: previous.advantages.map((ad, idx) =>
                    idx === index ? advantage : ad
                )
            }));
        },
        []
    );

    const onAdvantageDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            advantages: previous.advantages.filter((_a, idx) => idx !== index)
        }));
    }, []);

    const onItemsChange = useCallback((items: string) => {
        setCharacterData((previous) => ({
            ...previous,
            items
        }));
    }, []);

    const onNotesChange = useCallback((notes: string) => {
        setCharacterData((previous) => ({
            ...previous,
            notes
        }));
    }, []);

    const onHeroPointsChange = useCallback((heroPoints: number) => {
        setCharacterData((previous) => ({
            ...previous,
            heroPoints
        }));
    }, []);

    const sheetTabs: Record<string, SheetTab> = {
        biography: {
            key: 'biography',
            icon: <GiCharacter size={20} />,
            label: T('game.seventhSea.common.biography')
        },
        stories: {
            key: 'stories',
            icon: <GiBookmarklet size={20} />,
            label: T('game.seventhSea.common.stories')
        },
        characteristics: {
            key: 'characteristics',
            icon: <GiD10 size={20} />,
            label: T('game.seventhSea.common.characteristics')
        },
        advantages: {
            key: 'advantages',
            icon: <GiArrowScope size={20} />,
            label: T('game.seventhSea.common.advantages')
        },
        misc: {
            key: 'misc',
            icon: <GiHandBag size={20} />,
            label: T('game.seventhSea.common.misc')
        }
    };

    const getAddButton = (handler: () => void) =>
        readonly ? undefined : (
            <ActionIcon onClick={handler}>
                <FiPlusCircle />
            </ActionIcon>
        );

    return (
        <SheetTabs
            readonly={readonly}
            status={status}
            logoSvgComponent={SeventhSeaLogo}
            tabs={Object.values(sheetTabs)}
            selectedValue={tabValue}
            onChange={(val) => setTabValue(val)}
        >
            {/* biography / backgrounds */}
            {sheetTabs[tabValue]?.key === 'biography' && (
                <Stack w="100%">
                    <Group w="100%" align="start">
                        {/* biography */}
                        <Stack flex="4 0">
                            <SectionTitle
                                iconBefore={<GiCharacter size={20} />}
                                text={T('game.seventhSea.common.biography')}
                            />
                            <FieldLayout<SeventhSeaBiography>
                                gameId="seventhSea"
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
                    {/* hero points */}
                    <SectionTitle
                        iconBefore={<GiSeaStar size={20} />}
                        text={T('game.seventhSea.common.heroPoints')}
                        input={{
                            value: characterData.heroPoints,
                            onChange: onHeroPointsChange
                        }}
                    />
                    {/* arcana */}
                    <SectionTitle
                        iconBefore={<GiCardQueenHearts size={20} />}
                        text={T('game.seventhSea.common.arcana')}
                    />
                    <FieldLayout<SeventhSeaArcana>
                        gameId="seventhSea"
                        fields={arcanaFields}
                        textSectionKey="arcana"
                        data={characterData.arcana}
                        readonly={readonly}
                        onChange={onArcanaChange}
                    />
                    {/* backgrounds */}
                    <SectionTitle
                        iconBefore={<GiScrollQuill size={20} />}
                        iconAfter={getAddButton(onBackgroundAdd)}
                        text={T('game.seventhSea.common.backgrounds')}
                    />
                    <Backgrounds
                        backgrounds={characterData.backgrounds}
                        readonly={readonly}
                        onChange={onBackgroundChange}
                        onDelete={onBackgroundDelete}
                    />
                </Stack>
            )}
            {/* stories */}
            {sheetTabs[tabValue]?.key === 'stories' && (
                <Stack w="100%">
                    {/* stories */}
                    <SectionTitle
                        iconBefore={<GiCharacter size={20} />}
                        iconAfter={getAddButton(onStoryAdd)}
                        text={T('game.seventhSea.common.stories')}
                    />
                    <Stories
                        stories={characterData.stories}
                        readonly={readonly}
                        onChange={onStoryChange}
                        onDelete={onStoryDelete}
                    />
                </Stack>
            )}
            {/* characteristics */}
            {sheetTabs[tabValue]?.key === 'characteristics' && (
                <Stack w="100%">
                    {/* traits */}
                    <SectionTitle
                        iconBefore={<GiD10 size={20} />}
                        text={T('game.seventhSea.common.traits')}
                    />
                    <Characteristics<SeventhSeaTraits>
                        data={characterData.traits}
                        textKey="game.seventhSea.trait"
                        readonly={readonly}
                        onChange={onTraitsChange}
                    />
                    {/* skills */}
                    <SectionTitle
                        iconBefore={<GiSkills size={20} />}
                        text={T('game.seventhSea.common.skills')}
                    />
                    <Characteristics<SeventhSeaSkills>
                        data={characterData.skills}
                        textKey="game.seventhSea.skill"
                        sortByText
                        readonly={readonly}
                        onChange={onSkillsChange}
                    />
                    {/* death spiral */}
                    <SectionTitle
                        iconBefore={<GiHeartBeats size={20} />}
                        text={T('game.seventhSea.common.deathSpiral')}
                    />
                    <DeathSpiral
                        value={characterData.deathSpiral}
                        readonly={readonly}
                        onChange={onDeathSpiralChange}
                    />
                </Stack>
            )}
            {/* advantages */}
            {sheetTabs[tabValue]?.key === 'advantages' && (
                <Stack w="100%">
                    {/* advantages */}
                    <SectionTitle
                        iconBefore={<GiArrowScope size={20} />}
                        iconAfter={getAddButton(onAdvantageAdd)}
                        text={T('game.seventhSea.common.advantages')}
                    />
                    <Advantages
                        advantages={characterData.advantages}
                        readonly={readonly}
                        onChange={onAdvantageChange}
                        onDelete={onAdvantageDelete}
                    />
                </Stack>
            )}
            {/* misc */}
            {sheetTabs[tabValue]?.key === 'misc' && (
                <Stack w="100%">
                    {/* items */}
                    <SectionTitle
                        iconBefore={<GiSaberAndPistol size={20} />}
                        text={T('game.seventhSea.common.items')}
                    />
                    <Textarea
                        w="100%"
                        rows={8}
                        readOnly={readonly}
                        size="sm"
                        value={characterData.items}
                        onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                            onItemsChange(e.target.value);
                        }}
                    />
                    {/* notes */}
                    <SectionTitle
                        iconBefore={<GiNotebook size={20} />}
                        text={T('game.seventhSea.common.notes')}
                    />
                    <Textarea
                        w="100%"
                        rows={8}
                        readOnly={readonly}
                        size="sm"
                        value={characterData.notes}
                        onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                            onNotesChange(e.target.value);
                        }}
                    />
                </Stack>
            )}
        </SheetTabs>
    );
};

export default SeventhSeaSheet;
