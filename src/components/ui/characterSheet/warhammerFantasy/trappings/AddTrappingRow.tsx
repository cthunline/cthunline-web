import { type WarhammerFantasyTrapping } from '@cthunline/games';
import { Box, IconButton, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Grid from '@mui/material/Unstable_Grid2';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { useApp } from '../../../../contexts/App';

const trappingFormSchema = z.object({
    name: z.string().min(1),
    encumbrance: z.preprocess((v) => Number(v), z.number().int())
});

type TrappingFormData = z.infer<typeof trappingFormSchema>;

const formId = 'trapping-add-form';

type AddTrappingRowProps = {
    onCreate: (trapping: WarhammerFantasyTrapping) => void;
};

const AddTrappingRow = ({ onCreate }: AddTrappingRowProps) => {
    const { T } = useApp();

    const { control, handleSubmit, reset } = useForm<TrappingFormData>({
        resolver: zodResolver(trappingFormSchema),
        defaultValues: {
            name: '',
            encumbrance: 0
        }
    });

    const onFormSubmit = async (trapping: TrappingFormData) => {
        onCreate(trapping);
        reset();
    };

    return (
        <>
            <Box
                id={formId}
                component="form"
                onSubmit={handleSubmit(onFormSubmit)}
            />
            <Grid xs={7} display="flex" alignItems="center">
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
                            label={T('game.warhammerFantasy.trapping.name')}
                            type="text"
                            size="small"
                            error={!!error}
                        />
                    )}
                />
            </Grid>
            <Grid xs={1} display="flex" alignItems="center">
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
                                'game.warhammerFantasy.trapping.encumbrance'
                            )}
                            type="text"
                            size="small"
                            error={!!error}
                        />
                    )}
                />
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

export default AddTrappingRow;
