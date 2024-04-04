import { Group, UnstyledButton } from '@mantine/core';

import { type Color, colors } from '../../types';

interface ColorSelectorProps {
    onChange?: (color: Color) => void;
}

const ColorSelector = ({ onChange }: ColorSelectorProps) => (
    <Group gap="0.25rem" p="0.5rem">
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
