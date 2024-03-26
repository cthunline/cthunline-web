import Grid from '@mui/material/Unstable_Grid2';
import { GiSkills } from 'react-icons/gi';
import { Stack } from '@mui/material';
import { useMemo } from 'react';
import {
    warhammerFantasy,
    type WarhammerFantasyCharacter,
    type WarhammerFantasyBasicSkillName
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';
import SkillRow from './SkillRow';

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
        <Stack direction="column" gap="0.5rem" flex={1}>
            <SectionTitle
                iconBefore={<GiSkills size={20} />}
                text={T('game.warhammerFantasy.common.basicSkills')}
            />
            <Grid container columns={8} spacing={2}>
                {sortedBasicSkillNames.map(({ name, translatedName }) => (
                    <SkillRow
                        key={`basicSkill-row-${name}`}
                        readonly={readonly}
                        character={character}
                        skill={character.basicSkills[name]}
                        skillTranslatedName={translatedName}
                        onAdvancesChange={(val: number) => {
                            onBasicSkillAdvancesChange(name, val);
                        }}
                    />
                ))}
            </Grid>
        </Stack>
    );
};

export default BasicSkills;
