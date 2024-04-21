import { GiSkills } from 'react-icons/gi';
import { Stack } from '@mantine/core';
import { useMemo } from 'react';
import {
    warhammerFantasy,
    type WarhammerFantasyCharacter,
    type WarhammerFantasyBasicSkillName
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../../contexts/App.js';
import SkillRow from './SkillRow.js';

const { basicSkillNames } = warhammerFantasy.data;

interface BasicSkillsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (
        basicSkills: Pick<WarhammerFantasyCharacter, 'basicSkills'>
    ) => void;
}

type SortedBasicSkillNameData = {
    name: WarhammerFantasyBasicSkillName;
    translatedName: string;
};

const BasicSkills = ({ readonly, character, onChange }: BasicSkillsProps) => {
    const { T } = useApp();

    const sortedBasicSkillNames: SortedBasicSkillNameData[] = useMemo(() => {
        const data = basicSkillNames.map((name) => ({
            name,
            translatedName: T(`game.warhammerFantasy.basicSkills.${name}`)
        }));
        data.sort((a, b) => {
            if (a.translatedName < b.translatedName) {
                return -1;
            }
            if (a.translatedName > b.translatedName) {
                return 1;
            }
            return 0;
        });
        return data;
    }, [T]);

    const onBasicSkillCareerLevelChange = (
        name: WarhammerFantasyBasicSkillName,
        careerLevel: number | undefined
    ) => {
        const basicSkill = character.basicSkills[name];
        onChange({
            basicSkills: {
                ...character.basicSkills,
                [name]: {
                    ...basicSkill,
                    careerLevel
                }
            }
        });
    };

    const onBasicSkillAdvancesChange = (
        name: WarhammerFantasyBasicSkillName,
        advances: number
    ) => {
        const basicSkill = character.basicSkills[name];
        const char = character.characteristics[basicSkill.characteristicName];
        onChange({
            basicSkills: {
                ...character.basicSkills,
                [name]: {
                    ...basicSkill,
                    advances,
                    skill: char.current + advances
                }
            }
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiSkills size={20} />}
                text={T('game.warhammerFantasy.common.basicSkills')}
            />
            <Stack gap="1rem" w="100%">
                {sortedBasicSkillNames.map(({ name, translatedName }) => (
                    <SkillRow
                        key={`basicSkill-row-${name}`}
                        readonly={readonly}
                        character={character}
                        skill={character.basicSkills[name]}
                        skillTranslatedName={translatedName}
                        onCareerLevelChange={(level: number | undefined) => {
                            onBasicSkillCareerLevelChange(name, level);
                        }}
                        onAdvancesChange={(val: number) => {
                            onBasicSkillAdvancesChange(name, val);
                        }}
                    />
                ))}
            </Stack>
        </Stack>
    );
};

export default BasicSkills;
