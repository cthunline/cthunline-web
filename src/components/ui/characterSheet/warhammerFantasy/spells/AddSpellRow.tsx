import { type WarhammerFantasySpell } from '@cthunline/games';
import { Box, IconButton, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Grid from '@mui/material/Unstable_Grid2';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { useApp } from '../../../../contexts/App';

const spellFormSchema = z.object({
    name: z.string().min(1),
    castingNumber: z.preprocess((v) => Number(v), z.number().int()),
    range: z.string(),
    target: z.string(),
    duration: z.string(),
    effect: z.string()
});

type SpellFormData = z.infer<typeof spellFormSchema>;

const formId = 'spell-add-form';

type AddSpellRowProps = {
    onCreate: (spell: WarhammerFantasySpell) => void;
};

const AddSpellRow = ({ onCreate }: AddSpellRowProps) => {
    const { T } = useApp();

    const { control, handleSubmit, reset } = useForm<SpellFormData>({
        resolver: zodResolver(spellFormSchema),
        defaultValues: {
            name: '',
            castingNumber: 0,
            range: '',
            target: '',
            duration: '',
            effect: ''
        }
    });

    const onFormSubmit = async (spell: SpellFormData) => {
        onCreate(spell);
        reset();
    };

    return (
        <>
            <Grid xs={12}>
                <Grid container columns={12} spacing={2}>
                    <Box
                        id={formId}
                        component="form"
                        onSubmit={handleSubmit(onFormSubmit)}
                    />
                    <Grid xs={5} display="flex" alignItems="center">
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
                                        'game.warhammerFantasy.spell.name'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={1} display="flex" alignItems="center">
                        <Controller
                            name="castingNumber"
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
                                        'game.warhammerFantasy.spell.timesTaken'
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
                            name="range"
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
                                        'game.warhammerFantasy.spell.range'
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
                            name="target"
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
                                        'game.warhammerFantasy.spell.target'
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
                            name="duration"
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
                                        'game.warhammerFantasy.spell.duration'
                                    )}
                                    type="text"
                                    size="small"
                                    error={!!error}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={12} display="flex" alignItems="center">
                        <Controller
                            name="effect"
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
                                        'game.warhammerFantasy.spell.effect'
                                    )}
                                    type="text"
                                    size="small"
                                    multiline
                                    rows={2}
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

export default AddSpellRow;
