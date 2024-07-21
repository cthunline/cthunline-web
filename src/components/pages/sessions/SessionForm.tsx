import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMemo } from 'react';
import { MdOutlineSave } from 'react-icons/md';
import z from 'zod';

import { useApp } from '../../../contexts/App.js';
import useGame from '../../../hooks/api/useGame.js';
import type { SelectOption, SessionCreateBody } from '../../../types/index.js';
import Form from '../../common/Form.js';
import Select from '../../common/Select.js';

interface SessionFormProps {
    onSubmit: (data: SessionCreateBody) => Promise<void>;
}

const sessionFormSchema = z.object({
    name: z.string().min(3),
    gameId: z.string().min(1)
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

const SessionForm = ({ onSubmit }: SessionFormProps) => {
    const { T } = useApp();
    const { gameList } = useGame();

    const gameOptions: SelectOption<string>[] = useMemo(
        () =>
            gameList.map(({ id, name }) => ({
                label: name,
                value: id
            })),
        [gameList]
    );

    const { onSubmit: handleSubmit, getInputProps } = useForm<SessionFormData>({
        validate: zodResolver(sessionFormSchema),
        initialValues: {
            name: '',
            gameId: ''
        }
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="1rem" py="0.25rem">
                <TextInput
                    {...getInputProps('name')}
                    label={T('common.name')}
                />
                <Select
                    {...getInputProps('gameId')}
                    valueType="string"
                    options={gameOptions}
                    label={T('entity.game')}
                />
                <Button type="submit" leftSection={<MdOutlineSave />}>
                    {T('action.create')}
                </Button>
            </Stack>
        </Form>
    );
};

export default SessionForm;
