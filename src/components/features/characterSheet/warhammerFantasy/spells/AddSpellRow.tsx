import { ActionIcon, Box, Group, Stack, Textarea } from '@mantine/core';
import { type WarhammerFantasySpell } from '@cthunline/games';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FiPlusCircle } from 'react-icons/fi';
import { useForm } from '@mantine/form';
import z from 'zod';

import TextInput from '../../../../common/TextInput';
import { useApp } from '../../../../contexts/App';
import Form from '../../../../common/Form';

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

    const {
        onSubmit: handleSubmit,
        getInputProps,
        reset
    } = useForm<SpellFormData>({
        validate: zodResolver(spellFormSchema),
        initialValues: {
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
        <Group w="100%" gap="0.25rem">
            <Stack w="100%" gap="0.25rem">
                <Group w="100%" gap="0.25rem">
                    <Form id={formId} onSubmit={handleSubmit(onFormSubmit)} />
                    <Box flex="5 0">
                        <TextInput
                            {...getInputProps('name')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            label={T('game.warhammerFantasy.spell.name')}
                            size="sm"
                        />
                    </Box>
                    <Box flex="1 0">
                        <TextInput
                            {...getInputProps('castingNumber')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            ta="center"
                            label={T(
                                'game.warhammerFantasy.spell.castingNumber'
                            )}
                            size="sm"
                        />
                    </Box>
                    <Box flex="2 0">
                        <TextInput
                            {...getInputProps('range')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            label={T('game.warhammerFantasy.spell.range')}
                            size="sm"
                        />
                    </Box>
                    <Box flex="2 0">
                        <TextInput
                            {...getInputProps('target')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            label={T('game.warhammerFantasy.spell.target')}
                            size="sm"
                        />
                    </Box>
                    <Box flex="2 0">
                        <TextInput
                            {...getInputProps('duration')}
                            variant="contained"
                            w="100%"
                            form={formId}
                            label={T('game.warhammerFantasy.spell.duration')}
                            size="sm"
                        />
                    </Box>
                </Group>
                <Textarea
                    {...getInputProps('effect')}
                    w="100%"
                    form={formId}
                    label={T('game.warhammerFantasy.spell.effect')}
                    size="sm"
                    rows={2}
                />
            </Stack>
            <ActionIcon type="submit" form={formId}>
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default AddSpellRow;
