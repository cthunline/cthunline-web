import { type WarhammerFantasyTalent } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { IconButton, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';

type TalentRowInputProps = {
    readonly: boolean;
    label?: string;
} & (
    | {
          type: 'string';
          value: string;
          onChange?: (value: string) => void;
      }
    | {
          type: 'number';
          value: number;
          onChange?: (value: number) => void;
      }
);

const TalentRowInput = ({
    readonly,
    type,
    label,
    value,
    onChange
}: TalentRowInputProps) => (
    <TextField
        fullWidth
        InputProps={{
            readOnly: readonly,
            classes: {
                input: 'input-smaller-text'
            }
        }}
        sx={type === 'number' ? { input: { textAlign: 'center' } } : undefined}
        type="text"
        size="small"
        label={label}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (type === 'number') {
                onChange?.(Number(onlyNumbers(e.target.value)));
            } else {
                onChange?.(e.target.value);
            }
        }}
    />
);

type TalentRowProps = {
    readonly: boolean;
    talent: WarhammerFantasyTalent;
    onChange: (talent: WarhammerFantasyTalent) => void;
    onDelete: () => void;
};

const TalentRow = ({
    readonly,
    talent,
    onChange,
    onDelete
}: TalentRowProps) => {
    const { T } = useApp();
    return (
        <>
            <Grid xs={3} display="flex" alignItems="center">
                <TalentRowInput
                    readonly={readonly}
                    type="string"
                    label={T('game.warhammerFantasy.talent.name')}
                    value={talent.name}
                    onChange={(name: string) => {
                        onChange({ ...talent, name });
                    }}
                />
            </Grid>
            <Grid xs={1} display="flex" alignItems="center">
                <TalentRowInput
                    readonly={readonly}
                    type="number"
                    label={T('game.warhammerFantasy.talent.timesTaken')}
                    value={talent.timesTaken}
                    onChange={(timesTaken: number) => {
                        onChange({ ...talent, timesTaken });
                    }}
                />
            </Grid>
            <Grid xs={4} display="flex" alignItems="center">
                <TalentRowInput
                    readonly={readonly}
                    type="string"
                    label={T('game.warhammerFantasy.talent.description')}
                    value={talent.description}
                    onChange={(description: string) => {
                        onChange({ ...talent, description });
                    }}
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

export default TalentRow;
