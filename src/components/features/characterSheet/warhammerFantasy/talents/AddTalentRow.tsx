import { type WarhammerFantasyTalent } from '@cthunline/games';
import { zodResolver } from 'mantine-form-zod-resolver';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { FiPlusCircle } from 'react-icons/fi';
import { useForm } from '@mantine/form';
import z from 'zod';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';
import Form from '../../../../common/Form.js';

const talentFormSchema = z.object({
    name: z.string().min(1),
    timesTaken: z.number().int().min(1),
    description: z.string()
});

type TalentFormData = z.infer<typeof talentFormSchema>;

const formId = 'talent-add-form';

type AddTalentRowProps = {
    onCreate: (talent: WarhammerFantasyTalent) => void;
};

const AddTalentRow = ({ onCreate }: AddTalentRowProps) => {
    const { T } = useApp();

    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<TalentFormData>({
        validate: zodResolver(talentFormSchema),
        initialValues: {
            name: '',
            timesTaken: 1,
            description: ''
        }
    });

    const onFormSubmit = async (talent: TalentFormData) => {
        onCreate(talent);
        reset();
    };

    const timesTakenProps = getInputProps('timesTaken');

    return (
        <Stack w="100%" gap={0}>
            <Form
                id={formId}
                onSubmit={handleSubmit(onFormSubmit)}
                w={0}
                h={0}
            />
            <Group w="100%" gap="1rem">
                <Group flex="1 0" gap="0.5rem">
                    <Box flex="3 0">
                        <TextInput
                            {...getInputProps('name')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            label={T('game.warhammerFantasy.talent.name')}
                            size="sm"
                        />
                    </Box>
                    <Box flex="1 0">
                        <TextInput
                            {...timesTakenProps}
                            variant="contained"
                            w="100%"
                            form={formId}
                            center
                            label={T('game.warhammerFantasy.talent.timesTaken')}
                            size="sm"
                            onChange={(e) => {
                                timesTakenProps.onChange?.(
                                    Number(onlyNumbers(e.target.value))
                                );
                            }}
                        />
                    </Box>
                    <Box flex="4 0">
                        <TextInput
                            {...getInputProps('description')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            label={T(
                                'game.warhammerFantasy.talent.description'
                            )}
                            size="sm"
                        />
                    </Box>
                </Group>
                <ActionIcon type="submit" form={formId}>
                    <FiPlusCircle />
                </ActionIcon>
            </Group>
        </Stack>
    );
};

export default AddTalentRow;
