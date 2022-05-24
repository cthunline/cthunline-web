import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { Box } from '@mui/material';
import {
    DnD5Character,
    DnD5Biography,
    DnD5Story,
    DnD5Abilities,
    DnD5SavingThrows,
    DnD5Skills,
    DnD5Statistics
} from '@cthunline/games';

import { CharacterData, GameId } from '../../../../types';
import { useApp } from '../../../contexts/App';
import SectionTitle from '../generic/sectionTitle/SectionTitle';
import FieldLayout, { Field } from '../generic/fieldLayout/FieldLayout';
import Portrait from '../generic/portrait/Portrait';
import Abilities from './abilities/Abilities';
import SavingThrows from './savingThrows/SavingThrows';
import Skills from './skills/Skills';
import Statistics from './statistics/Statistics';
import { controlCharacterData } from './dnd5Sheet.helper';
import fields from './fields.json';

const biographyFields = fields.biography as Field<DnD5Biography>[];
const storyFields = fields.story as Field<DnD5Story>[];

type PartialDataField = 'abilities' | 'savingThrows' | 'skills' | 'statistics';
type PartialData = Partial<DnD5Abilities | DnD5SavingThrows | DnD5Skills | DnD5Statistics>;

export interface DnD5SheetProps {
    readonly: boolean;
    data: DnD5Character;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
}

const DnD5Sheet: React.FC<DnD5SheetProps> = ({
    readonly,
    data,
    listening,
    onChange
}) => {
    const { T } = useApp();

    const [characterData, setCharacterData] = useState<DnD5Character>(data);

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
            const { name, background } = characterData.biography;
            const properName = name ?? '[No Name]';
            const properBackground = background ? `(${background})` : '';
            const characterName = `${properName} ${properBackground}`;
            onChange(characterName, characterData);
        }
    }, [
        readonly,
        onChange,
        characterData
    ]);

    const onBiographyChange = useCallback((biography: DnD5Biography) => {
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

    const changePartialData = useCallback((field: PartialDataField, partialData: PartialData) => {
        setCharacterData((previous) => (
            controlCharacterData({
                ...previous,
                [field]: {
                    ...previous[field],
                    ...partialData
                }
            })
        ));
    }, []);

    const onStoryChange = useCallback((story: DnD5Story) => {
        setCharacterData((previous) => ({
            ...previous,
            story
        }));
    }, []);

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" columnGap={2} rowGap={4}>
            {/* biography */}
            <Box gridColumn="span 9">
                <SectionTitle text={T('game.dnd5.common.biography')} />
                <FieldLayout<DnD5Biography>
                    gameId={GameId.dnd5}
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
            <Box
                gridColumn="span 12"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                columnGap={6}
                rowGap={4}
            >
                <Box gridColumn="span 6">
                    {/* abilities */}
                    <SectionTitle text={T('game.dnd5.common.abilities')} />
                    <Abilities
                        abilities={characterData.abilities}
                        readonly={readonly}
                        onChange={(partial) => changePartialData('abilities', partial)}
                    />
                    {/* saving throws */}
                    <SectionTitle text={T('game.dnd5.common.savingThrows')} mt={5} />
                    <SavingThrows
                        savingThrows={characterData.savingThrows}
                        readonly={readonly}
                        onChange={(partial) => changePartialData('savingThrows', partial)}
                    />
                    {/* statistics */}
                    <SectionTitle text={T('game.dnd5.common.statistics')} mt={6} />
                    <Statistics
                        statistics={characterData.statistics}
                        readonly={readonly}
                        onChange={(partial) => changePartialData('statistics', partial)}
                    />
                </Box>
                <Box gridColumn="span 6">
                    {/* skills */}
                    <SectionTitle text={T('game.dnd5.common.skills')} />
                    <Skills
                        skills={characterData.skills}
                        readonly={readonly}
                        onChange={(partial) => changePartialData('skills', partial)}
                    />
                </Box>
            </Box>
            {/* story */}
            <Box gridColumn="span 12">
                <SectionTitle text={T('game.dnd5.common.story')} />
                <FieldLayout<DnD5Story>
                    gameId={GameId.dnd5}
                    fields={storyFields}
                    textSectionKey="story"
                    data={characterData.story}
                    readonly={readonly}
                    onChange={onStoryChange}
                />
            </Box>
        </Box>
    );
};

export default DnD5Sheet;
