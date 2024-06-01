import { Group, type GroupProps, UnstyledButton, Box } from '@mantine/core';

import './WidthPicker.css';

export const widths = {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 24
} as const;

interface WidthPickerProps extends Omit<GroupProps, 'onChange'> {
    color: string;
    onChange?: (width: number) => void;
}

const WidthPicker = ({ color, onChange, ...props }: WidthPickerProps) => (
    <Group gap="0.25rem" p="0.5rem" align="center" justify="start" {...props}>
        {Object.values(widths).map((width: number) => (
            <UnstyledButton
                key={`stroke-width-picker-${width}`}
                className="width-picker-button"
                onClick={() => onChange?.(width)}
                bg="transparent"
                w="1.5rem"
                h="1.5rem"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0.25rem',
                    outlineColor: `var(--palette-${color})`,
                    outlineStyle: 'solid'
                }}
            >
                <Box
                    bg={`var(--palette-${color})`}
                    w={width}
                    h={width}
                    style={{
                        borderRadius: '50%'
                    }}
                />
            </UnstyledButton>
        ))}
    </Group>
);

export default WidthPicker;
