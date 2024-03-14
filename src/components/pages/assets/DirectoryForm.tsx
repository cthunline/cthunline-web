import { TextField, Button, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdOutlineSave } from 'react-icons/md';
import z from 'zod';

import { useApp } from '../../contexts/App';

const directoryFormSchema = z.object({
    name: z.string().min(1)
});

type DirectoryFormData = z.infer<typeof directoryFormSchema>;

interface DirectoryFormProps {
    onSubmit: (name: string) => void;
}

const DirectoryForm = ({ onSubmit }: DirectoryFormProps) => {
    const { T } = useApp();

    const { control, handleSubmit } = useForm<DirectoryFormData>({
        resolver: zodResolver(directoryFormSchema),
        defaultValues: {
            name: ''
        }
    });

    const onFormSubmit = ({ name }: DirectoryFormData) => {
        onSubmit(name);
    };

    return (
        <Stack
            component="form"
            onSubmit={handleSubmit(onFormSubmit)}
            direction="column"
            gap="1rem"
            padding="0.25rem 0"
        >
            <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        className="form-input"
                        label={T('common.name')}
                        error={!!error}
                    />
                )}
            />
            <Button
                className="form-button"
                type="submit"
                variant="contained"
                size="large"
                startIcon={<MdOutlineSave />}
            >
                {T('action.create')}
            </Button>
        </Stack>
    );
};

export default DirectoryForm;
