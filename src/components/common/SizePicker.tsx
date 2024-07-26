import { Group, type GroupProps, UnstyledButton } from '@mantine/core';

import './SizePicker.css';

interface SizePickerProps extends Omit<GroupProps, 'onChange'> {
    color: string;
    sizes: number[];
    renderButtonContent: (opts: {
        size: number;
        color: string;
    }) => React.ReactNode;
    onPick?: (size: number) => void;
}

const SizePicker = ({
    color,
    sizes,
    renderButtonContent,
    onPick,
    ...props
}: SizePickerProps) => (
    <Group gap="0.25rem" p="0.5rem" align="center" justify="start" {...props}>
        {Object.values(sizes).map((size: number) => (
            <UnstyledButton
                key={`size-picker-${size}`}
                className="size-picker-button"
                onClick={() => onPick?.(size)}
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
                {renderButtonContent({ color, size })}
            </UnstyledButton>
        ))}
    </Group>
);

export default SizePicker;
