import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { MdOutlineSave } from 'react-icons/md';
import z from 'zod';

import { useLocaleStore } from '../../../stores/locale.js';
import Form from '../../common/Form.js';

const userFormSchema = z
    .object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        passwordConfirm: z.string(),
        invitationCode: z.string()
    })
    .superRefine(({ password, passwordConfirm }, ctx) => {
        if (passwordConfirm !== password) {
            ctx.addIssue({
                path: ['passwordConfirm'],
                code: z.ZodIssueCode.custom
            });
        }
    });

type UserFormData = z.infer<typeof userFormSchema>;

export type UserSubmitData = Omit<
    UserFormData,
    'passwordConfirm' | 'invitationCode'
> & {
    invitationCode?: string;
};

interface UserFormProps {
    invitation?: boolean;
    buttonText?: string;
    onSubmit: (data: UserSubmitData) => void;
}

const UserForm = ({ invitation, buttonText, onSubmit }: UserFormProps) => {
    const T = useLocaleStore(({ T }) => T);

    const { onSubmit: handleSubmit, getInputProps } = useForm<UserFormData>({
        validate: zodResolver(userFormSchema),
        initialValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirm: '',
            invitationCode: ''
        }
    });

    const onFormSubmit = ({
        invitationCode,
        passwordConfirm,
        ...data
    }: UserFormData) => {
        onSubmit({
            ...data,
            ...(invitation ? { invitationCode: invitationCode ?? '' } : {})
        });
    };

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Stack w="100%" gap="1rem">
                <TextInput
                    {...getInputProps('name')}
                    label={T('common.name')}
                />
                <TextInput
                    {...getInputProps('email')}
                    label={T('user.email')}
                />
                <TextInput
                    {...getInputProps('password')}
                    label={T('user.password')}
                    type="password"
                    autoComplete="new-password"
                />
                <TextInput
                    {...getInputProps('passwordConfirm')}
                    label={T('user.passwordConfirm')}
                    type="password"
                    autoComplete="new-password"
                />
                {invitation && (
                    <TextInput
                        {...getInputProps('invitationCode')}
                        label={T('user.invitationCode')}
                    />
                )}
                <Button type="submit" leftSection={<MdOutlineSave />}>
                    {buttonText ?? 'Create'}
                </Button>
            </Stack>
        </Form>
    );
};

export default UserForm;
