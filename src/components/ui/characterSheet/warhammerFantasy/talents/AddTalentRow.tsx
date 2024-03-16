import { type WarhammerFantasyTalent } from '@cthunline/games';
import { Box, IconButton, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Grid from '@mui/material/Unstable_Grid2';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { useApp } from '../../../../contexts/App';

const talentFormSchema = z.object({
    name: z.string().min(1),
    timesTaken: z.preprocess((v) => Number(v), z.number().int().min(1)),
    description: z.string()
});

type TalentFormData = z.infer<typeof talentFormSchema>;

const formId = 'talent-add-form';

type AddTalentRowProps = {
    onCreate: (talent: WarhammerFantasyTalent) => void;
};

const AddTalentRow = ({ onCreate }: AddTalentRowProps) => {
    const { T } = useApp();

    const { control, handleSubmit, reset } = useForm<TalentFormData>({
        resolver: zodResolver(talentFormSchema),
        defaultValues: {
            name: '',
            timesTaken: 1,
            description: ''
        }
    });

    const onFormSubmit = async (talent: TalentFormData) => {
        onCreate(talent);
        reset();
    };

    return (
        <>
            <Box
                id={formId}
                component="form"
                onSubmit={handleSubmit(onFormSubmit)}
            />
            <Grid xs={3} display="flex" alignItems="center">
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
                            label={T('game.warhammerFantasy.talent.name')}
                            type="text"
                            size="small"
                            error={!!error}
                        />
                    )}
                />
            </Grid>
            <Grid xs={1} display="flex" alignItems="center">
                <Controller
                    name="timesTaken"
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
                            label={T('game.warhammerFantasy.talent.timesTaken')}
                            type="text"
                            size="small"
                            error={!!error}
                        />
                    )}
                />
            </Grid>
            <Grid xs={4} display="flex" alignItems="center">
                <Controller
                    name="description"
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
                                'game.warhammerFantasy.talent.description'
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

export default AddTalentRow;
