import { ActionIcon, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import Form from '../../../../common/Form.js';
import TextInput from '../../../../common/TextInput.js';

const talentFormSchema = z.object({
    name: z.string().min(1)
});

type TalentFormData = z.infer<typeof talentFormSchema>;

const formId = 'talent-add-form';

type AddTalentRowProps = {
    onCreate: (talent: string) => void;
};

const AddTalentRow = ({ onCreate }: AddTalentRowProps) => {
    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<TalentFormData>({
        validate: zodResolver(talentFormSchema),
        initialValues: {
            name: ''
        }
    });

    const onFormSubmit = ({ name }: TalentFormData) => {
        onCreate(name);
        reset();
    };

    return (
        <Stack w="100%" gap={0}>
            <Form
                id={formId}
                onSubmit={handleSubmit(onFormSubmit)}
                w={0}
                h={0}
            />
            <Group w="100%" gap="1rem">
                <TextInput
                    {...getInputProps('name')}
                    flex="1 0"
                    variant="contained"
                    form={formId}
                    size="sm"
                />
                <ActionIcon type="submit" form={formId}>
                    <FiPlusCircle />
                </ActionIcon>
            </Group>
        </Stack>
    );
};

export default AddTalentRow;
