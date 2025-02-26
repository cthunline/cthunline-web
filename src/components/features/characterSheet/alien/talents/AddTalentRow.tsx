import type { AlienTalent } from '@cthunline/games';
import { ActionIcon, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import z from 'zod';

import { useLocaleStore } from '../../../../../stores/locale.js';
import Form from '../../../../common/Form.js';
import TextInput from '../../../../common/TextInput.js';
import Textarea from '../../../../common/Textarea.js';

const talentFormSchema = z.object({
    name: z.string().min(1),
    description: z.string()
});

type TalentFormData = z.infer<typeof talentFormSchema>;

const formId = 'talent-add-form';

type AddTalentRowProps = {
    onCreate: (talent: AlienTalent) => void;
};

const AddTalentRow = ({ onCreate }: AddTalentRowProps) => {
    const T = useLocaleStore(({ T }) => T);

    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<TalentFormData>({
        validate: zodResolver(talentFormSchema),
        initialValues: {
            name: '',
            description: ''
        }
    });

    const onFormSubmit = ({ name, description }: TalentFormData) => {
        onCreate({ name, description });
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
                <Stack flex="1 0">
                    <TextInput
                        {...getInputProps('name')}
                        label={T('game.alien.talents.name')}
                        flex="1 0"
                        variant="contained"
                        form={formId}
                        size="sm"
                    />
                    <Textarea
                        {...getInputProps('description')}
                        variant="contained"
                        w="100%"
                        rows={5}
                        size="sm"
                        label={T('game.alien.talents.description')}
                    />
                </Stack>
                <ActionIcon type="submit" form={formId}>
                    <FiPlusCircle />
                </ActionIcon>
            </Group>
        </Stack>
    );
};

export default AddTalentRow;
