import { type WarhammerFantasyTalent } from '@cthunline/games';
import { zodResolver } from 'mantine-form-zod-resolver';
import { ActionIcon, Box, Group } from '@mantine/core';
import { FiPlusCircle } from 'react-icons/fi';
import { useForm } from '@mantine/form';
import z from 'zod';

import TextInput from '../../../../common/TextInput';
import { useApp } from '../../../../contexts/App';
import Form from '../../../../common/Form';

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

    return (
        <Group w="100%">
            <Form id={formId} onSubmit={handleSubmit(onFormSubmit)} />
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
                    {...getInputProps('timesTaken')}
                    variant="contained"
                    w="100%"
                    form={formId}
                    ta="center"
                    label={T('game.warhammerFantasy.talent.timesTaken')}
                    size="sm"
                />
            </Box>
            <Box flex="4 0">
                <TextInput
                    {...getInputProps('description')}
                    variant="contained"
                    w="100%"
                    form={formId}
                    label={T('game.warhammerFantasy.talent.description')}
                    size="sm"
                />
            </Box>
            <ActionIcon type="submit" form={formId}>
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default AddTalentRow;
