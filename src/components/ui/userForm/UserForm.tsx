import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack } from '@mui/material';
import { MdOutlineSave } from 'react-icons/md';
import z from 'zod';

import { useApp } from '../../contexts/App';

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
    const { T } = useApp();

    const { control, handleSubmit } = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
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
        <Stack
            direction="column"
            width="25rem"
            gap="1rem"
            component="form"
            onSubmit={handleSubmit(onFormSubmit)}
        >
            <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        className="form-input full-width"
                        label={T(`common.name`)}
                        error={!!error}
                    />
                )}
            />
            <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        className="form-input full-width"
                        label={T(`user.email`)}
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
                        label={T(`user.password`)}
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
                        label={T(`user.passwordConfirm`)}
                        type="password"
                        error={!!error}
                    />
                )}
            />
            {invitation && (
                <Controller
                    name="invitationCode"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            className="form-input full-width"
                            label={T(`user.invitationCode`)}
                            error={!!error}
                        />
                    )}
                />
            )}
            <Button
                className="form-button"
                type="submit"
                variant="contained"
                size="large"
                startIcon={<MdOutlineSave />}
            >
                {buttonText ?? 'Create'}
            </Button>
        </Stack>
    );
};

export default UserForm;
