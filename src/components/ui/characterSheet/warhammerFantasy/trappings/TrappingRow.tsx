import { type WarhammerFantasyTrapping } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { IconButton, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';

type TrappingRowInputProps = {
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

const TrappingRowInput = ({
    readonly,
    type,
    label,
    value,
    onChange
}: TrappingRowInputProps) => (
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

type TrappingRowProps = {
    readonly: boolean;
    trapping: WarhammerFantasyTrapping;
    onChange: (trapping: WarhammerFantasyTrapping) => void;
    onDelete: () => void;
};

const TrappingRow = ({
    readonly,
    trapping,
    onChange,
    onDelete
}: TrappingRowProps) => {
    const { T } = useApp();
    return (
        <>
            <Grid xs={7} display="flex" alignItems="center">
                <TrappingRowInput
                    readonly={readonly}
                    type="string"
                    label={T('game.warhammerFantasy.trapping.name')}
                    value={trapping.name}
                    onChange={(name: string) => {
                        onChange({ ...trapping, name });
                    }}
                />
            </Grid>
            <Grid xs={1} display="flex" alignItems="center">
                <TrappingRowInput
                    readonly={readonly}
                    type="number"
                    label={T('game.warhammerFantasy.trapping.encumbrance')}
                    value={trapping.encumbrance}
                    onChange={(encumbrance: number) => {
                        onChange({ ...trapping, encumbrance });
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

export default TrappingRow;
