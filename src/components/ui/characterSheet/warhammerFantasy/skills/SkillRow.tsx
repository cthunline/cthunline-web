import { MdOutlineDeleteOutline } from 'react-icons/md';
import { IconButton, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyBasicSkill,
    type WarhammerFantasyOtherSkill
} from '@cthunline/games';

import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';

interface SkillRowInputProps {
    readonly: boolean;
    label?: string;
    value: number;
    onChange?: (value: number) => void;
}

const SkillRowInput = ({
    readonly,
    label,
    value,
    onChange
}: SkillRowInputProps) => (
    <TextField
        fullWidth
        InputProps={{
            readOnly: readonly,
            classes: {
                input: 'input-smaller-text'
            }
        }}
        sx={{ input: { textAlign: 'center' } }}
        type="text"
        size="small"
        label={label}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(Number(onlyNumbers(e.target.value)));
        }}
    />
);

const isOtherSkill = (
    skill: WarhammerFantasyBasicSkill | WarhammerFantasyOtherSkill
): skill is WarhammerFantasyOtherSkill => Object.hasOwn(skill, 'name');

type SkillRowProps = {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onAdvancesChange: (advances: number) => void;
} & (
    | {
          skill: WarhammerFantasyBasicSkill;
          skillTranslatedName: string;
          onDelete?: never;
      }
    | {
          skill: WarhammerFantasyOtherSkill;
          skillTranslatedName?: never;
          onDelete: () => void;
      }
);

const SkillRow = ({
    readonly,
    character,
    skill,
    skillTranslatedName,
    onDelete,
    onAdvancesChange
}: SkillRowProps) => {
    const { T } = useApp();
    const isOther = isOtherSkill(skill);
    return (
        <>
            <Grid xs={4} display="flex" alignItems="center">
                {isOther ? skill.name : skillTranslatedName}
            </Grid>
            <Grid xs={1} display="flex" alignItems="center">
                {T(
                    `game.warhammerFantasy.characteristics.${skill.characteristicName}.short`
                )}
            </Grid>
            <Grid xs={1} display="flex" alignItems="center">
                {character.characteristics[skill.characteristicName].current}
            </Grid>
            <Grid xs={1} display="flex" alignItems="center">
                <SkillRowInput
                    readonly={readonly}
                    label={T('game.warhammerFantasy.skill.advances')}
                    value={skill.advances}
                    onChange={onAdvancesChange}
                />
            </Grid>
            <Grid xs={1} display="flex" alignItems="center">
                <SkillRowInput
                    readonly
                    label={T('game.warhammerFantasy.skill.skill')}
                    value={skill.skill}
                />
            </Grid>
            {!readonly && !!onDelete && (
                <Grid
                    xs={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <IconButton size="medium" onClick={onDelete}>
                        <MdOutlineDeleteOutline />
                    </IconButton>
                </Grid>
            )}
        </>
    );
};

export default SkillRow;
