import { Box, Button, Group, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { MdOutlineSave } from 'react-icons/md';
import z from 'zod';

import useUser from '../../../hooks/api/useUser.js';
import { useAuthStore } from '../../../stores/auth.js';
import { useLocaleStore } from '../../../stores/locale.js';
import { type SelectOption, languages } from '../../../types/index.js';
import ContentBox from '../../common/ContentBox.js';
import Form from '../../common/Form.js';
import Select from '../../common/Select.js';

const profileFormSchema = z
    .object({
        theme: z.union([z.literal('dark'), z.literal('light')]),
        locale: z.union([z.literal('en'), z.literal('fr')]),
        oldPassword: z
            .union([z.string().min(6), z.string().length(0)])
            .optional(),
        password: z.union([z.string().min(6), z.string().length(0)]).optional(),
        passwordConfirm: z.string().optional()
    })
    .superRefine(({ oldPassword, password, passwordConfirm }, ctx) => {
        if (password && !oldPassword) {
            ctx.addIssue({
                path: ['oldPassword'],
                code: z.ZodIssueCode.custom
            });
        }
        if (oldPassword && !password) {
            ctx.addIssue({
                path: ['password'],
                code: z.ZodIssueCode.custom
            });
        }
        if (password && passwordConfirm !== password) {
            ctx.addIssue({
                path: ['passwordConfirm'],
                code: z.ZodIssueCode.custom
            });
        }
    });

type ProfileFormData = z.infer<typeof profileFormSchema>;

const themeOptions: SelectOption<string>[] = [
    { label: 'Dark', value: 'dark' },
    { label: 'Light', value: 'light' }
];

const languageOptions: SelectOption<string>[] = Object.entries(languages).map(
    ([value, name]) => ({
        label: name,
        value
    })
);

const Profile = () => {
    const T = useLocaleStore(({ T }) => T);
    const user = useAuthStore(({ user }) => user);
    const refreshUser = useAuthStore(({ refreshUser }) => refreshUser);

    const { editUser } = useUser();

    const {
        onSubmit: handleSubmit,
        getInputProps,
        setValues
    } = useForm<ProfileFormData>({
        validate: zodResolver(profileFormSchema),
        initialValues: {
            theme: user.theme,
            locale: user.locale,
            oldPassword: '',
            password: '',
            passwordConfirm: ''
        }
    });

    const onFormSubmit = async ({
        theme,
        locale,
        oldPassword,
        password
    }: ProfileFormData) => {
        await editUser({
            userId: Number(user.id),
            data: {
                theme,
                locale,
                ...(oldPassword && password
                    ? {
                          oldPassword,
                          password
                      }
                    : {})
            }
        });
        setValues({
            theme,
            locale,
            oldPassword: '',
            password: '',
            passwordConfirm: ''
        });
        refreshUser();
    };

    return (
        <ContentBox maw="25rem">
            <ContentBox.Content>
                <Form onSubmit={handleSubmit(onFormSubmit)}>
                    <Stack w="100%" gap="1rem">
                        <Group w="100%" gap="0.5rem">
                            <Box flex={0.5}>
                                <Select
                                    {...getInputProps('theme')}
                                    valueType="string"
                                    options={themeOptions}
                                    label={T('common.theme')}
                                />
                            </Box>
                            <Box flex={0.5}>
                                <Select
                                    {...getInputProps('locale')}
                                    valueType="string"
                                    options={languageOptions}
                                    label={T('common.language')}
                                />
                            </Box>
                        </Group>
                        <Title order={6}>
                            {T('page.profile.changePassword')}
                        </Title>
                        <TextInput
                            {...getInputProps('oldPassword')}
                            type="password"
                            label={T('page.profile.oldPassword')}
                        />
                        <TextInput
                            {...getInputProps('password')}
                            type="password"
                            label={T('page.profile.newPassword')}
                            autoComplete="new-password"
                        />
                        <TextInput
                            {...getInputProps('passwordConfirm')}
                            type="password"
                            label={T('page.profile.newPasswordConfirm')}
                            autoComplete="new-password"
                        />
                        <Button type="submit" leftSection={<MdOutlineSave />}>
                            {T('action.save')}
                        </Button>
                    </Stack>
                </Form>
            </ContentBox.Content>
        </ContentBox>
    );
};

export default Profile;
