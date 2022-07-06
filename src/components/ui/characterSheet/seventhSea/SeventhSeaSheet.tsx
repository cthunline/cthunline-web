import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { Box, IconButton, TextField } from '@mui/material';
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
    GiHandBag
} from 'react-icons/gi';
import { FiPlusCircle } from 'react-icons/fi';
import {
    SeventhSeaCharacter,
    SeventhSeaBiography,
    SeventhSeaArcana,
    SeventhSeaBackground,
    SeventhSeaStory,
    SeventhSeaTraits,
    SeventhSeaSkills,
    SeventhSeaAdvantage
} from '@cthunline/games';

import { CharacterData, GameId } from '../../../../types';
import { useApp } from '../../../contexts/App';
import SheetTabs, { SheetTab } from '../generic/sheetTabs/SheetTabs';
import SectionTitle from '../generic/sectionTitle/SectionTitle';
import FieldLayout, { Field } from '../generic/fieldLayout/FieldLayout';
import Portrait from '../generic/portrait/Portrait';
import Backgrounds from './backgrounds/Backgrounds';
import Stories from './stories/Stories';
import Characteristics from './characteristics/Characteristics';
import DeathSpiral from './deathSpiral/DeathSpiral';
import Advantages from './advantages/Advantages';
import { ReactComponent as SeventhSeaLogo } from '../../../../assets/games/seventhSea.svg';
import {
    defaultBackground,
    defaultStory,
    defaultAdvantage
} from './seventhSeaSheet.helper';
import fields from './fields.json';

const biographyFields = fields.biography as Field<SeventhSeaBiography>[];
const arcanaFields = fields.arcana as Field<SeventhSeaArcana>[];

export interface SeventhSeaSheetProps {
    readonly: boolean;
    data: SeventhSeaCharacter;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
}

const SeventhSeaSheet: React.FC<SeventhSeaSheetProps> = ({
    readonly,
    data,
    listening,
    onChange
}) => {
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<SeventhSeaCharacter>(data);
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
            const { name, concept } = characterData.biography;
            const properName = name ?? '[No Name]';
            const properConcept = concept ? `(${concept})` : '';
            const characterName = `${properName} ${properConcept}`;
            onChange(characterName, characterData);
        }
    }, [
        readonly,
        onChange,
        characterData
    ]);

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

    const onPortraitChange = useCallback((portrait: string) => {
        setCharacterData((previous) => ({
            ...previous,
            portrait
        }));
    }, []);

    const onBackgroundAdd = useCallback(() => {
        setCharacterData((previous) => ({
            ...previous,
            backgrounds: [
                ...previous.backgrounds,
                defaultBackground
            ]
        }));
    }, []);

    const onBackgroundChange = useCallback((index: number, background: SeventhSeaBackground) => {
        setCharacterData((previous) => ({
            ...previous,
            backgrounds: previous.backgrounds.map((bck, idx) => (
                idx === index ? background : bck
            ))
        }));
    }, []);

    const onBackgroundDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            backgrounds: previous.backgrounds.filter((_b, idx) => (
                idx !== index
            ))
        }));
    }, []);

    const onStoryAdd = useCallback(() => {
        setCharacterData((previous) => ({
            ...previous,
            stories: [
                ...previous.stories,
                defaultStory
            ]
        }));
    }, []);

    const onStoryChange = useCallback((index: number, story: SeventhSeaStory) => {
        setCharacterData((previous) => ({
            ...previous,
            stories: previous.stories.map((st, idx) => (
                idx === index ? story : st
            ))
        }));
    }, []);

    const onStoryDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            stories: previous.stories.filter((_s, idx) => (
                idx !== index
            ))
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
            advantages: [
                ...previous.advantages,
                defaultAdvantage
            ]
        }));
    }, []);

    const onAdvantageChange = useCallback((index: number, advantage: SeventhSeaAdvantage) => {
        setCharacterData((previous) => ({
            ...previous,
            advantages: previous.advantages.map((ad, idx) => (
                idx === index ? advantage : ad
            ))
        }));
    }, []);

    const onAdvantageDelete = useCallback((index: number) => {
        setCharacterData((previous) => ({
            ...previous,
            advantages: previous.advantages.filter((_a, idx) => (
                idx !== index
            ))
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

    const sheetTabs: SheetTab[] = [{
        key: 'biography',
        icon: <GiCharacter size={20} />,
        label: T('game.seventhSea.common.biography')
    }, {
        key: 'stories',
        icon: <GiBookmarklet size={20} />,
        label: T('game.seventhSea.common.stories')
    }, {
        key: 'characteristics',
        icon: <GiD10 size={20} />,
        label: T('game.seventhSea.common.characteristics')
    }, {
        key: 'advantages',
        icon: <GiArrowScope size={20} />,
        label: T('game.seventhSea.common.advantages')
    }, {
        key: 'misc',
        icon: <GiHandBag size={20} />,
        label: T('game.seventhSea.common.misc')
    }];

    const getAddButton = (handler: () => void) => (
        readonly ? undefined : (
            <IconButton size="medium" onClick={handler}>
                <FiPlusCircle />
            </IconButton>
        )
    );

    return (
        <SheetTabs
            logoSvgComponent={SeventhSeaLogo}
            tabs={sheetTabs}
            selectedIndex={tabIndex}
            onChange={(idx) => setTabIndex(idx)}
        >
            {/* biography / backgrounds */}
            {sheetTabs[tabIndex].key === 'biography' ? [
                // biography
                <Box key="SeventhSea-biography" gridColumn="span 9">
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
                </Box>,
                // portrait
                <Box key="SeventhSea-portrait" gridColumn="span 3">
                    <Portrait
                        base64={characterData.portrait}
                        readonly={readonly}
                        onChange={onPortraitChange}
                    />
                </Box>,
                // arcana
                <Box key="SeventhSea-arcana" gridColumn="span 12">
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
                </Box>,
                // backgrounds
                <Box key="SeventhSea-backgrounds" gridColumn="span 12">
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
                </Box>
            ] : null}
            {/* stories */}
            {sheetTabs[tabIndex].key === 'stories' ? [
                // stories
                <Box key="SeventhSea-stories" gridColumn="span 12">
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
                </Box>
            ] : null}
            {/* characteristics */}
            {sheetTabs[tabIndex].key === 'characteristics' ? [
                // traits
                <Box key="SeventhSea-traits" gridColumn="span 12">
                    <SectionTitle
                        iconBefore={<GiD10 size={20} />}
                        text={T('game.seventhSea.common.traits')}
                    />
                    <Characteristics<SeventhSeaTraits>
                        data={characterData.traits}
                        textKey="game.seventhSea.trait"
                        columns={2}
                        readonly={readonly}
                        onChange={onTraitsChange}
                    />
                </Box>,
                // skills
                <Box key="SeventhSea-skills" gridColumn="span 12">
                    <SectionTitle
                        iconBefore={<GiSkills size={20} />}
                        text={T('game.seventhSea.common.skills')}
                    />
                    <Characteristics<SeventhSeaSkills>
                        data={characterData.skills}
                        textKey="game.seventhSea.skill"
                        columns={2}
                        readonly={readonly}
                        onChange={onSkillsChange}
                    />
                </Box>,
                // death spiral
                <Box key="SeventhSea-deathSpiral" gridColumn="span 12">
                    <SectionTitle
                        iconBefore={<GiHeartBeats size={20} />}
                        text={T('game.seventhSea.common.deathSpiral')}
                    />
                    <DeathSpiral
                        value={characterData.deathSpiral}
                        readonly={readonly}
                        onChange={onDeathSpiralChange}
                    />
                </Box>
            ] : null}
            {/* advantages */}
            {sheetTabs[tabIndex].key === 'advantages' ? [
                // advantages
                <Box key="SeventhSea-advantages" gridColumn="span 12">
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
                </Box>
            ] : null}
            {/* misc */}
            {sheetTabs[tabIndex].key === 'misc' ? [
                // items
                <Box key="SeventhSea-items" gridColumn="span 12">
                    <SectionTitle
                        iconBefore={<GiSaberAndPistol size={20} />}
                        text={T('game.seventhSea.common.items')}
                    />
                    <TextField
                        fullWidth
                        multiline
                        minRows={6}
                        maxRows={6}
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        value={characterData.items}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onItemsChange(e.target.value);
                        }}
                    />
                </Box>,
                // notes
                <Box key="SeventhSea-notes" gridColumn="span 12">
                    <SectionTitle
                        iconBefore={<GiNotebook size={20} />}
                        text={T('game.seventhSea.common.notes')}
                    />
                    <TextField
                        fullWidth
                        multiline
                        minRows={6}
                        maxRows={6}
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        value={characterData.notes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onNotesChange(e.target.value);
                        }}
                    />
                </Box>
            ] : null}
        </SheetTabs>
    );
};

export default SeventhSeaSheet;
