import { ActionIcon, Tooltip } from '@mantine/core';

export interface ActionButtonData {
    text: string;
    icon: JSX.Element;
    handler: () => void;
}

const ActionButton = ({ text, handler, icon }: ActionButtonData) => (
    <Tooltip position="bottom" label={text}>
        <ActionIcon
            className="sketch-action-button ml-15 mr-15"
            onClick={handler}
        >
            {icon}
        </ActionIcon>
    </Tooltip>
);

export default ActionButton;
