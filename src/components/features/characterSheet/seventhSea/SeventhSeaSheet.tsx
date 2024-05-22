import { useCallback, useEffect, useRef, useState } from 'react';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { FiPlusCircle } from 'react-icons/fi';
import {
    GiCharacter,
    GiD10,
    GiBookmarklet,
    GiCardQueenHearts,
    GiScrollQuill,
    GiSkills,
    GiHeartBeats,
    GiArrowScope,
    GiNotebook,
    GiSaberAndPistol,
    GiHandBag,
    GiSeaStar
} from 'react-icons/gi';
import {
    type SeventhSeaCharacter,
    type SeventhSeaBiography,
    type SeventhSeaArcana,
    type SeventhSeaBackground,
    type SeventhSeaStory,
    type SeventhSeaTraits,
    type SeventhSeaSkills,
    type SeventhSeaAdvantage
} from '@cthunline/games';

import SeventhSeaLogo from '../../../svg/games/seventhSea/SeventhSeaLogo.js';
import SheetTabs, { type SheetTab } from '../generic/sheetTabs/SheetTabs.js';
import SectionTitle from '../generic/sectionTitle/SectionTitle.js';
import Characteristics from './characteristics/Characteristics.js';
import FieldLayout from '../generic/fieldLayout/FieldLayout.js';
import { biographyFields, arcanaFields } from './fields.js';
import Backgrounds from './backgrounds/Backgrounds.js';
import Portrait from '../generic/portrait/Portrait.js';
import DeathSpiral from './deathSpiral/DeathSpiral.js';
import { useApp } from '../../../../contexts/App.js';
import Advantages from './advantages/Advantages.js';
import Textarea from '../../../common/Textarea.js';
import Stories from './stories/Stories.js';
import {
    defaultBackground,
    defaultStory,
    defaultAdvantage
} from './seventhSeaSheet.helper.js';
import {
    type CharacterData,
    GameId,
    type CharacterSheetStatus
} from '../../../../types/index.js';

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
                                gameId={GameId.seventhSea}
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
                        gameId={GameId.seventhSea}
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
