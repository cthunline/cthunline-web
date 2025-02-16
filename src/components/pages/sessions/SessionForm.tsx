import { gameIds, getGame, isGameId } from '@cthunline/games';
import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { MdOutlineSave } from 'react-icons/md';
import z from 'zod';

import { useApp } from '../../../contexts/App.js';
import type { SessionCreateBody } from '../../../types/index.js';
import Form from '../../common/Form.js';
import Select from '../../common/Select.js';

const gameOptions = gameIds.map((id) => ({
    value: id,
    label: getGame(id).name
}));

interface SessionFormProps {
    onSubmit: (data: SessionCreateBody) => Promise<void>;
}

const sessionFormSchema = z.object({
    gameId: z.string().min(1),
    name: z.string().min(3)
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

const SessionForm = ({ onSubmit }: SessionFormProps) => {
    const { T } = useApp();

    const { onSubmit: handleSubmit, getInputProps } = useForm<SessionFormData>({
        validate: zodResolver(sessionFormSchema),
        initialValues: {
            gameId: '',
            name: ''
        }
    });

    const onSessionSubmit = ({ gameId, name }: SessionFormData) => {
        if (isGameId(gameId)) {
            onSubmit({ gameId, name });
        } else {
            throw new Error(`Unexpected game ID ${gameId}`);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSessionSubmit)}>
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
