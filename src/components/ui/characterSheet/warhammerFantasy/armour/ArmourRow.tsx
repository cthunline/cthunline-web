import { type WarhammerFantasyArmour } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { IconButton, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';

type ArmourRowInputProps = {
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

const ArmourRowInput = ({
    readonly,
    type,
    label,
    value,
    onChange
}: ArmourRowInputProps) => (
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

type ArmourRowProps = {
    readonly: boolean;
    armour: WarhammerFantasyArmour;
    onChange: (armour: WarhammerFantasyArmour) => void;
    onDelete: () => void;
};

const ArmourRow = ({
    readonly,
    armour,
    onChange,
    onDelete
}: ArmourRowProps) => {
    const { T } = useApp();
    return (
        <>
            <Grid xs={14}>
                <Grid container columns={14} spacing={2}>
                    <Grid xs={6} display="flex" alignItems="center">
                        <ArmourRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.armour.name')}
                            value={armour.name}
                            onChange={(name: string) => {
                                onChange({ ...armour, name });
                            }}
                        />
                    </Grid>
                    <Grid xs={4} display="flex" alignItems="center">
                        <ArmourRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.armour.locations')}
                            value={armour.locations}
                            onChange={(locations: string) => {
                                onChange({ ...armour, locations });
                            }}
                        />
                    </Grid>
                    <Grid xs={2} display="flex" alignItems="center">
                        <ArmourRowInput
                            readonly={readonly}
                            type="number"
                            label={T(
                                'game.warhammerFantasy.armour.encumbrance'
                            )}
                            value={armour.encumbrance}
                            onChange={(encumbrance: number) => {
                                onChange({ ...armour, encumbrance });
                            }}
                        />
                    </Grid>
                    <Grid xs={2} display="flex" alignItems="center">
                        <ArmourRowInput
                            readonly={readonly}
                            type="number"
                            label={T(
                                'game.warhammerFantasy.armour.armourPoints'
                            )}
                            value={armour.armourPoints}
                            onChange={(armourPoints: number) => {
                                onChange({ ...armour, armourPoints });
                            }}
                        />
                    </Grid>
                    <Grid xs={14} display="flex" alignItems="center">
                        <ArmourRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.armour.qualities')}
                            value={armour.qualities}
                            onChange={(qualities: string) => {
                                onChange({ ...armour, qualities });
                            }}
                        />
                    </Grid>
                </Grid>
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

export default ArmourRow;
