import { type WarhammerFantasySpell } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { IconButton, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';

type SpellRowInputProps = {
    readonly: boolean;
    lines?: number;
    center?: boolean;
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

const SpellRowInput = ({
    readonly,
    lines,
    center,
    label,
    type,
    value,
    onChange
}: SpellRowInputProps) => {
    const multiline = !!lines && lines > 1;
    return (
        <TextField
            fullWidth
            InputProps={{
                readOnly: readonly,
                classes: {
                    input: 'input-smaller-text'
                }
            }}
            multiline={multiline}
            rows={multiline ? lines : undefined}
            sx={center ? { input: { textAlign: 'center' } } : undefined}
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
};

type SpellRowProps = {
    readonly: boolean;
    spell: WarhammerFantasySpell;
    onChange: (spell: WarhammerFantasySpell) => void;
    onDelete: () => void;
};

const SpellRow = ({ readonly, spell, onChange, onDelete }: SpellRowProps) => {
    const { T } = useApp();
    return (
        <>
            <Grid xs={12}>
                <Grid container columns={12} spacing={2}>
                    <Grid xs={5} display="flex" alignItems="center">
                        <SpellRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.spell.name')}
                            value={spell.name}
                            onChange={(name: string) => {
                                onChange({ ...spell, name });
                            }}
                        />
                    </Grid>
                    <Grid xs={1} display="flex" alignItems="center">
                        <SpellRowInput
                            readonly={readonly}
                            type="number"
                            label={T(
                                'game.warhammerFantasy.spell.castingNumber'
                            )}
                            center
                            value={spell.castingNumber}
                            onChange={(castingNumber: number) => {
                                onChange({ ...spell, castingNumber });
                            }}
                        />
                    </Grid>
                    <Grid xs={2} display="flex" alignItems="center">
                        <SpellRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.spell.range')}
                            center
                            value={spell.range}
                            onChange={(range: string) => {
                                onChange({ ...spell, range });
                            }}
                        />
                    </Grid>
                    <Grid xs={2} display="flex" alignItems="center">
                        <SpellRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.spell.target')}
                            center
                            value={spell.target}
                            onChange={(target: string) => {
                                onChange({ ...spell, target });
                            }}
                        />
                    </Grid>
                    <Grid xs={2} display="flex" alignItems="center">
                        <SpellRowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.spell.duration')}
                            center
                            value={spell.duration}
                            onChange={(duration: string) => {
                                onChange({ ...spell, duration });
                            }}
                        />
                    </Grid>
                    <Grid xs={12} display="flex" alignItems="center">
                        <SpellRowInput
                            readonly={readonly}
                            lines={2}
                            type="string"
                            label={T('game.warhammerFantasy.spell.effect')}
                            value={spell.effect}
                            onChange={(effect: string) => {
                                onChange({ ...spell, effect });
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            {!readonly && (
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

export default SpellRow;
