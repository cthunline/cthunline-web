import { type WarhammerFantasyWeapon } from '@cthunline/games';
import { Box, IconButton, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Grid from '@mui/material/Unstable_Grid2';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { useApp } from '../../../../contexts/App';

const weaponFormSchema = z.object({
    name: z.string().min(1),
    group: z.string(),
    encumbrance: z.preprocess((v) => Number(v), z.number().int()),
    rangeReach: z.string(),
    damage: z.string(),
    qualities: z.string()
});

type WeaponFormData = z.infer<typeof weaponFormSchema>;

const formId = 'weapon-add-form';

type AddWeaponRowProps = {
    onCreate: (weapon: WarhammerFantasyWeapon) => void;
};

const AddWeaponRow = ({ onCreate }: AddWeaponRowProps) => {
    const { T } = useApp();

    const { control, handleSubmit, reset } = useForm<WeaponFormData>({
        resolver: zodResolver(weaponFormSchema),
        defaultValues: {
            name: '',
            group: '',
            encumbrance: 0,
            rangeReach: '',
            damage: '',
            qualities: ''
        }
    });

    const onFormSubmit = async (weapon: WeaponFormData) => {
        onCreate(weapon);
        reset();
    };

    return (
        <>
            <Grid xs={14}>
                <Grid container columns={14} spacing={2}>
                    <Box
                        id={formId}
                        component="form"
                        onSubmit={handleSubmit(onFormSubmit)}
                    />
                    <Grid xs={6} display="flex" alignItems="center">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    InputProps={{
                                        inputProps: { form: formId },
                                        classes: {
                                            input: 'input-smaller-text'
                                        }
                                    }}
                                    label={T(
                                        'game.warhammerFantasy.weapon.name'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={3} display="flex" alignItems="center">
                        <Controller
                            name="group"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    InputProps={{
                                        inputProps: { form: formId },
                                        classes: {
                                            input: 'input-smaller-text'
                                        }
                                    }}
                                    label={T(
                                        'game.warhammerFantasy.weapon.group'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={2} display="flex" alignItems="center">
                        <Controller
                            name="encumbrance"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    InputProps={{
                                        inputProps: { form: formId },
                                        classes: {
                                            input: 'input-smaller-text'
                                        }
                                    }}
                                    sx={{ input: { textAlign: 'center' } }}
                                    label={T(
                                        'game.warhammerFantasy.weapon.encumbrance'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={3} display="flex" alignItems="center">
                        <Controller
                            name="rangeReach"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    InputProps={{
                                        inputProps: { form: formId },
                                        classes: {
                                            input: 'input-smaller-text'
                                        }
                                    }}
                                    label={T(
                                        'game.warhammerFantasy.weapon.rangeReach'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={3} display="flex" alignItems="center">
                        <Controller
                            name="damage"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    InputProps={{
                                        inputProps: { form: formId },
                                        classes: {
                                            input: 'input-smaller-text'
                                        }
                                    }}
                                    label={T(
                                        'game.warhammerFantasy.weapon.damage'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={11} display="flex" alignItems="center">
                        <Controller
                            name="qualities"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    InputProps={{
                                        inputProps: { form: formId },
                                        classes: {
                                            input: 'input-smaller-text'
                                        }
                                    }}
                                    label={T(
                                        'game.warhammerFantasy.weapon.qualities'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                xs={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <IconButton size="medium" type="submit" form={formId}>
                    <FiPlusCircle />
                </IconButton>
            </Grid>
        </>
    );
};

export default AddWeaponRow;
