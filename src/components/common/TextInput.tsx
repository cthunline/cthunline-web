import {
    TextInput as MantineTextInput,
    type TextInputProps as MantineTextInputProps
} from '@mantine/core';

import './TextInput.css';

export type TextInputVariant = 'default' | 'filled' | 'contained' | 'unstyled';

export interface TextInputProps extends Omit<MantineTextInputProps, 'variant'> {
    variant?: TextInputVariant;
}

const TextInput = ({ className, variant, ...props }: TextInputProps) => (
    <MantineTextInput
        {...props}
        variant={variant === 'contained' ? 'default' : variant}
        className={`${className ?? ''} ${variant === 'contained' ? 'contained' : ''}`}
    />
);

export default TextInput;