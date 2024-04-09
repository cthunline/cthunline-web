import { Group, type GroupProps, UnstyledButton } from '@mantine/core';

import { type Color, colors } from '../../types/index.js';

interface ColorSelectorProps extends Omit<GroupProps, 'onChange'> {
    onChange?: (color: Color) => void;
}

const ColorSelector = ({ onChange, ...props }: ColorSelectorProps) => (
    <Group gap="0.25rem" p="0.5rem" align="center" justify="start" {...props}>
        {colors.map((color: Color) => (
            <UnstyledButton
                key={`color-selector-${color}`}
                onClick={() => onChange?.(color)}
                bg={`var(--palette-${color})`}
                w="1.5rem"
                h="1.5rem"
            />
        ))}
    </Group>
);

export default ColorSelector;
