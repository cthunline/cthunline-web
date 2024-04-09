import { ActionIcon, type ActionIconProps, Tooltip } from '@mantine/core';

export interface ActionButtonData {
    text: string;
    icon: JSX.Element;
    variant?: ActionIconProps['variant'];
    handler: () => void;
    disabled?: boolean;
}

const ActionButton = ({
    text,
    handler,
    icon,
    variant,
    disabled
}: ActionButtonData) => (
    <Tooltip position="bottom" label={text}>
        <ActionIcon
            variant={variant ?? 'subtle'}
            disabled={disabled}
            size="lg"
            onClick={handler}
        >
            {icon}
        </ActionIcon>
    </Tooltip>
);

export default ActionButton;
