import { ActionIcon, Menu } from '@mantine/core';
import { FaEllipsis } from 'react-icons/fa6';

import { type MoveAction } from '../../../../../services/tools.js';

type RowMenuButtonProps = {
    onMove: (action: MoveAction) => void;
    onDelete: () => void;
};

const RowMenuButton = ({ onMove, onDelete }: RowMenuButtonProps) => (
    <Menu position="right">
        <Menu.Target>
            <ActionIcon color="gray">
                <FaEllipsis />
            </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
            <Menu.Item onClick={() => onMove('up')}>Monter</Menu.Item>
            <Menu.Item onClick={() => onMove('down')}>Descendre</Menu.Item>
            <Menu.Item
                style={{ color: 'var(--mantine-color-red-text)' }}
                onClick={onDelete}
            >
                Supprimer
            </Menu.Item>
        </Menu.Dropdown>
    </Menu>
);

export default RowMenuButton;
