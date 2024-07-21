import {
    Textarea as MantineTextarea,
    type TextareaProps as MantineTextareaProps
} from '@mantine/core';

import type { InputVariant } from './TextInput.js';

export interface TextareaProps extends Omit<MantineTextareaProps, 'variant'> {
    variant?: InputVariant;
}

const Textarea = ({ className, variant, ...props }: TextareaProps) => (
    <MantineTextarea
        {...props}
        variant={variant === 'contained' ? 'default' : variant}
        className={`${className ?? ''} ${variant === 'contained' ? 'contained' : ''}`}
    />
);

export default Textarea;
