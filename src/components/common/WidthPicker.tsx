import { Box, type GroupProps } from '@mantine/core';

import SizePicker from './SizePicker.js';

export const widths = {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 24
} as const;

const sizes = Object.values(widths);

interface WidthSizePickerProps extends Omit<GroupProps, 'onChange'> {
    onPick?: (fontSize: number) => void;
}

const WidthSizePicker = ({ color, onPick, ...props }: WidthSizePickerProps) => (
    <SizePicker
        {...props}
        color={color ?? 'white'}
        sizes={sizes}
        onPick={onPick}
        renderButtonContent={({ size, color }) => (
            <Box
                bg={`var(--palette-${color})`}
                w={size}
                h={size}
                style={{
                    borderRadius: '50%'
                }}
            />
        )}
    />
);

export default WidthSizePicker;
