import Grid from '@mui/material/Unstable_Grid2';
import { GiSkills } from 'react-icons/gi';
import { Stack } from '@mui/material';
import {
    warhammerFantasy,
    type WarhammerFantasyCharacter,
    type WarhammerFantasyBasicSkillName
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';
import { columnHeads } from './skills.data';
import SkillRow from './SkillRow';

const { basicSkillNames } = warhammerFantasy.data;

interface BasicSkillsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (
        basicSkills: Pick<WarhammerFantasyCharacter, 'basicSkills'>
    ) => void;
}

const BasicSkills = ({ readonly, character, onChange }: BasicSkillsProps) => {
    const { T } = useApp();

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
                {columnHeads.map(({ textKey, columnSpan, center }) => (
                    <Grid
                        key={`basicSkill-columnHead-${textKey}`}
                        xs={columnSpan}
                        display="flex"
                        alignItems="center"
                        justifyContent={center ? 'center' : undefined}
                    >
                        {T(`game.warhammerFantasy.${textKey}`)}
                    </Grid>
                ))}
                {basicSkillNames.map((basicSkillName) => (
                    <SkillRow
                        key={`basicSkill-row-${basicSkillName}`}
                        readonly={readonly}
                        character={character}
                        skill={character.basicSkills[basicSkillName]}
                        skillName={basicSkillName}
                        onAdvancesChange={(val: number) => {
                            onBasicSkillAdvancesChange(basicSkillName, val);
                        }}
                    />
                ))}
            </Grid>
        </Stack>
    );
};

export default BasicSkills;
