import { zodResolver } from 'mantine-form-zod-resolver';
import { Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMemo } from 'react';
import z from 'zod';

import { type SelectOption } from '../../../types/index.js';
import useUser from '../../../hooks/api/useUser.js';
import { useApp } from '../../../contexts/App.js';
import Select from '../../common/Select.js';
import Form from '../../common/Form.js';

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
    const { T, userId: currentUserId } = useApp();

    const { onSubmit: handleSubmit, getInputProps } = useForm<TransferFormData>(
        {
            validate: zodResolver(transferFormSchema)
        }
    );

    const userOptions = useMemo(() => {
        const options: SelectOption<number>[] = [];
        userList.forEach(({ id, name }) => {
            if (id !== currentUserId) {
                options.push({
                    value: id,
                    label: name
                });
            }
        });
        return options;
    }, [currentUserId, userList]);

    const onSubmit = ({ userId }: TransferFormData) => {
        onConfirm?.({
            characterId,
            userId
        });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack align="center" gap="1rem" w="100%">
                <Select
                    {...getInputProps('userId')}
                    valueType="number"
                    options={userOptions}
                    w="100%"
                />
                <Group justify="flex-end">
                    <Button className="button-cancel" onClick={onCancel}>
                        {T('action.cancel')}
                    </Button>
                    <Button type="submit">{T('action.confirm')}</Button>
                </Group>
            </Stack>
        </Form>
    );
};

export default TransferForm;
