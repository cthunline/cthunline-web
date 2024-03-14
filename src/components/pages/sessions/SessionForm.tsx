import { TextField, Button, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdOutlineSave } from 'react-icons/md';
import { useMemo } from 'react';
import z from 'zod';

import { useApp } from '../../contexts/App';
import Selector from '../../ui/selector/Selector';
import { SessionCreateBody } from '../../../types';
import useGame from '../../hooks/useGame';

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

    const gameOptions = useMemo(
        () =>
            gameList.map(({ id, name }) => ({
                name,
                value: id
            })),
        [gameList]
    );

    const { control, handleSubmit } = useForm<SessionFormData>({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            name: '',
            gameId: ''
        }
    });

    return (
        <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
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
            <Controller
                name="gameId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Selector
                        {...field}
                        label={T('entity.game')}
                        options={gameOptions}
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

export default SessionForm;
