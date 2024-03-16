import { type WarhammerFantasyArmour } from '@cthunline/games';
import { Box, IconButton, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Grid from '@mui/material/Unstable_Grid2';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { useApp } from '../../../../contexts/App';

const armourFormSchema = z.object({
    name: z.string().min(1),
    locations: z.string(),
    encumbrance: z.preprocess((v) => Number(v), z.number().int()),
    armourPoints: z.preprocess((v) => Number(v), z.number().int()),
    qualities: z.string()
});

type ArmourFormData = z.infer<typeof armourFormSchema>;

const formId = 'armour-add-form';

type AddArmourRowProps = {
    onCreate: (armour: WarhammerFantasyArmour) => void;
};

const AddArmourRow = ({ onCreate }: AddArmourRowProps) => {
    const { T } = useApp();

    const { control, handleSubmit, reset } = useForm<ArmourFormData>({
        resolver: zodResolver(armourFormSchema),
        defaultValues: {
            name: '',
            locations: '',
            encumbrance: 0,
            armourPoints: 0,
            qualities: ''
        }
    });

    const onFormSubmit = async (armour: ArmourFormData) => {
        onCreate(armour);
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
                                        'game.warhammerFantasy.armour.name'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={4} display="flex" alignItems="center">
                        <Controller
                            name="locations"
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
                                        'game.warhammerFantasy.armour.locations'
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
                                        'game.warhammerFantasy.armour.encumbrance'
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
                            name="armourPoints"
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
                                        'game.warhammerFantasy.armour.armourPoints'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={14} display="flex" alignItems="center">
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
                                        'game.warhammerFantasy.armour.qualities'
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

export default AddArmourRow;
