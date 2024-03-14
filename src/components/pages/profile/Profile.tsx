import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdOutlineSave } from 'react-icons/md';
import z from 'zod';

import Selector from '../../ui/selector/Selector';
import { ucfirst } from '../../../services/tools';
import { useApp } from '../../contexts/App';
import { languages } from '../../../types';
import useUser from '../../hooks/useUser';

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

const themeOptions = [
    { name: 'Dark', value: 'dark' },
    { name: 'Light', value: 'light' }
];

const languageOptions = Object.entries(languages).map(([value, name]) => ({
    name: ucfirst(name),
    value
}));

const Profile = () => {
    const { T, user, refreshUser } = useApp();
    const { editUser } = useUser();

    const { control, handleSubmit, reset } = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            theme: user?.theme ?? 'dark',
            locale: user?.locale ?? 'en',
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
            userId: Number(user?.id),
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
        reset({
            theme,
            locale,
            oldPassword: '',
            password: '',
            passwordConfirm: ''
        });
        refreshUser();
    };

    return (
        <Paper elevation={3} className="p-25">
            <Stack
                direction="column"
                width="25rem"
                gap="1rem"
                component="form"
                onSubmit={handleSubmit(onFormSubmit)}
            >
                <Stack direction="row" width="100%">
                    <Box className="half mr-10">
                        <Typography
                            className="full-width"
                            variant="h6"
                            gutterBottom
                        >
                            {T('common.theme')}
                        </Typography>
                        <Controller
                            name="theme"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <Selector
                                    {...field}
                                    className="form-input"
                                    options={themeOptions}
                                    error={!!error}
                                />
                            )}
                        />
                    </Box>
                    <Box className="half ml-10">
                        <Typography
                            className="full-width"
                            variant="h6"
                            gutterBottom
                        >
                            {T('common.language')}
                        </Typography>
                        <Controller
                            name="locale"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <Selector
                                    {...field}
                                    className="form-input"
                                    options={languageOptions}
                                    error={!!error}
                                />
                            )}
                        />
                    </Box>
                </Stack>
                <Typography className="full-width" variant="h6" gutterBottom>
                    {T('page.profile.changePassword')}
                </Typography>
                <Controller
                    name="oldPassword"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            className="form-input full-width"
                            label={T(`page.profile.oldPassword`)}
                            type="password"
                            error={!!error}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            className="form-input full-width"
                            autoComplete="new-password"
                            label={T(`page.profile.newPassword`)}
                            type="password"
                            error={!!error}
                        />
                    )}
                />
                <Controller
                    name="passwordConfirm"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            className="form-input full-width"
                            autoComplete="new-password"
                            label={T(`page.profile.newPasswordConfirm`)}
                            type="password"
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
                    {T('action.save')}
                </Button>
            </Stack>
        </Paper>
    );
};

export default Profile;
