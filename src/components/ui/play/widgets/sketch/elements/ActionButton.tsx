import { IconButton, Tooltip } from '@mui/material';

export interface ActionButtonData {
    text: string;
    icon: JSX.Element;
    handler: () => void;
}

const ActionButton = ({ text, handler, icon }: ActionButtonData) => (
    <Tooltip placement="bottom" title={text}>
        <IconButton
            className="sketch-action-button ml-15 mr-15"
            size="medium"
            onClick={handler}
        >
            {icon}
        </IconButton>
    </Tooltip>
);

export default ActionButton;
