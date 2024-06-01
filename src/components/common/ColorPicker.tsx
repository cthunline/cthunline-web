import { Group, type GroupProps, UnstyledButton } from '@mantine/core';

import { type Color, colors } from '../../types/index.js';

interface ColorPickerProps extends Omit<GroupProps, 'onChange'> {
    onChange?: (color: Color) => void;
}

const ColorPicker = ({ onChange, ...props }: ColorPickerProps) => (
    <Group gap="0.25rem" p="0.5rem" align="center" justify="start" {...props}>
        {colors.map((color: Color) => (
            <UnstyledButton
                key={`color-picker-${color}`}
                onClick={() => onChange?.(color)}
                bg={`var(--palette-${color})`}
                w="1.5rem"
                h="1.5rem"
            />
        ))}
    </Group>
);

export default ColorPicker;
