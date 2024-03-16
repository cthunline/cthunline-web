import { type WarhammerFantasyWeapon } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { IconButton, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';

type WeaponRowInputProps = {
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

const WeaponRowInput = ({
    readonly,
    type,
    label,
    value,
    onChange
}: WeaponRowInputProps) => (
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

type WeaponRowProps = {
    readonly: boolean;
    weapon: WarhammerFantasyWeapon;
    onChange: (weapon: WarhammerFantasyWeapon) => void;
    onDelete: () => void;
};

const WeaponRow = ({
    readonly,
    weapon,
    onChange,
    onDelete
}: WeaponRowProps) => {
    const { T } = useApp();
    return (
        <>
            <Grid xs={14}>
                <Grid container columns={14} spacing={2}>
                    <Grid xs={6} display="flex" alignItems="center">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.name')}
                            value={weapon.name}
                            onChange={(name: string) => {
                                onChange({ ...weapon, name });
                            }}
                        />
                    </Grid>
                    <Grid xs={3} display="flex" alignItems="center">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.group')}
                            value={weapon.group}
                            onChange={(group: string) => {
                                onChange({ ...weapon, group });
                            }}
                        />
                    </Grid>
                    <Grid xs={2} display="flex" alignItems="center">
                        <WeaponRowInput
                            readonly={readonly}
                            type="number"
                            label={T(
                                'game.warhammerFantasy.weapon.encumbrance'
                            )}
                            value={weapon.encumbrance}
                            onChange={(encumbrance: number) => {
                                onChange({ ...weapon, encumbrance });
                            }}
                        />
                    </Grid>
                    <Grid xs={3} display="flex" alignItems="center">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.rangeReach')}
                            value={weapon.rangeReach}
                            onChange={(rangeReach: string) => {
                                onChange({ ...weapon, rangeReach });
                            }}
                        />
                    </Grid>
                    <Grid xs={3} display="flex" alignItems="center">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.damage')}
                            value={weapon.damage}
                            onChange={(damage: string) => {
                                onChange({ ...weapon, damage });
                            }}
                        />
                    </Grid>
                    <Grid xs={11} display="flex" alignItems="center">
                        <WeaponRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.weapon.qualities')}
                            value={weapon.qualities}
                            onChange={(qualities: string) => {
                                onChange({ ...weapon, qualities });
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

export default WeaponRow;
