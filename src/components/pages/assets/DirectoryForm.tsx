import { Button, Stack, TextInput } from '@mantine/core';
import { zodResolver } from 'mantine-form-zod-resolver';
import { MdOutlineSave } from 'react-icons/md';
import { useForm } from '@mantine/form';
import z from 'zod';

import { useApp } from '../../contexts/App.js';
import Form from '../../common/Form.js';

const directoryFormSchema = z.object({
    name: z.string().min(1)
});

type DirectoryFormData = z.infer<typeof directoryFormSchema>;

interface DirectoryFormProps {
    name?: string;
    onSubmit: (name: string) => void;
}

const DirectoryForm = ({
    name: initialName = '',
    onSubmit
}: DirectoryFormProps) => {
    const { T } = useApp();

    const { onSubmit: handleSubmit, getInputProps } =
        useForm<DirectoryFormData>({
            validate: zodResolver(directoryFormSchema),
            initialValues: {
                name: initialName
            }
        });

    const onFormSubmit = ({ name }: DirectoryFormData) => {
        onSubmit(name);
    };

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Stack gap="1rem">
                <TextInput
                    {...getInputProps('name')}
                    label={T('common.name')}
                />
                <Button type="submit" leftSection={<MdOutlineSave />}>
                    {T('action.create')}
                </Button>
            </Stack>
        </Form>
    );
};

export default DirectoryForm;
