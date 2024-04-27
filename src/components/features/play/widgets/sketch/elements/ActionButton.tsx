import {
    ActionIcon,
    type ActionIconProps,
    Tooltip,
    type DefaultMantineColor
} from '@mantine/core';

export interface ActionButtonProps {
    text: string;
    icon: JSX.Element;
    variant?: ActionIconProps['variant'];
    handler: () => void;
    disabled?: boolean;
    color?: DefaultMantineColor;
}

const ActionButton = ({
    text,
    handler,
    icon,
    variant,
    disabled,
    color
}: ActionButtonProps) => (
    <Tooltip position="bottom" label={text}>
        <ActionIcon
            variant={variant ?? 'subtle'}
            disabled={disabled}
            size="lg"
            color={color}
            onClick={handler}
        >
            {icon}
        </ActionIcon>
    </Tooltip>
);

export default ActionButton;
