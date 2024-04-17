import {
    TextInput as MantineTextInput,
    type TextInputProps as MantineTextInputProps
} from '@mantine/core';

export type InputVariant = 'default' | 'filled' | 'contained' | 'unstyled';

export interface TextInputProps extends Omit<MantineTextInputProps, 'variant'> {
    variant?: InputVariant;
    center?: boolean;
}

const TextInput = ({
    className,
    variant,
    center,
    ...props
}: TextInputProps) => (
    <MantineTextInput
        {...props}
        error={!!props.error}
        variant={variant === 'contained' ? 'default' : variant}
        className={`${className ?? ''} ${variant === 'contained' ? 'contained' : ''} ${center ? 'center' : ''}`}
    />
);

export default TextInput;
