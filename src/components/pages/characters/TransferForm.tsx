import { zodResolver } from 'mantine-form-zod-resolver';
import { Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMemo } from 'react';
import z from 'zod';

import { type SelectOption } from '../../../types';
import { useApp } from '../../contexts/App';
import useUser from '../../hooks/useUser';
import Select from '../../common/Select';
import Form from '../../common/Form';

const transferFormSchema = z.object({
    userId: z.number().int().min(1)
});

type TransferFormData = z.infer<typeof transferFormSchema>;

export interface TransferData {
    characterId: number;
    userId: number;
}

interface TransferFormProps {
    characterId: number;
    onConfirm: (data: TransferData) => void;
    onCancel: () => void;
}

const TransferForm = ({
    characterId,
    onConfirm,
    onCancel
}: TransferFormProps) => {
    const { userList } = useUser({ loadList: true });
    const { T } = useApp();

    const { onSubmit: handleSubmit, getInputProps } = useForm<TransferFormData>(
        {
            validate: zodResolver(transferFormSchema)
        }
    );

    const userOptions: SelectOption<number>[] = useMemo(
        () =>
            userList.map(({ id, name }) => ({
                value: id,
                label: name
            })),
        [userList]
    );

    const onSubmit = ({ userId }: TransferFormData) => {
        onConfirm?.({
            characterId,
            userId
        });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack align="center" gap="0.5rem">
                <Select
                    {...getInputProps('userId')}
                    valueType="number"
                    label={T('entity.user')}
                    options={userOptions}
                />
                <Group justify="flex-end">
                    <Button onClick={onCancel}>{T('action.cancel')}</Button>
                    <Button type="submit">{T('action.confirm')}</Button>
                </Group>
            </Stack>
        </Form>
    );
};

export default TransferForm;
