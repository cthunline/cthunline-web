import { Menu } from '@mantine/core';
import {
    MdOutlineArrowUpward,
    MdOutlineArrowDownward,
    MdOutlineDelete,
    MdOutlineShare
} from 'react-icons/md';

import { type Note } from '../../../../../types/index.js';
import { useApp } from '../../../../contexts/App.js';

export interface NoteListMenuDropdownProps {
    note: Note | null;
    canMoveUp: boolean;
    canMoveDown: boolean;
    onShare: (id: number, isShared: boolean) => void;
    onMove: (id: number, direction: 'up' | 'down') => void;
    onDelete: (id: number) => void;
}

const NoteListMenuDropdown = ({
    note,
    canMoveUp,
    canMoveDown,
    onShare,
    onMove,
    onDelete
}: NoteListMenuDropdownProps) => {
    const { T } = useApp();

    return (
        <Menu.Dropdown>
            <Menu.Item
                leftSection={<MdOutlineShare size={20} />}
                onClick={() => {
                    if (note) {
                        onShare(note.id, !note.isShared);
                    }
                }}
            >
                {note?.isShared ? T('action.stopSharing') : T('action.share')}
            </Menu.Item>
            <Menu.Divider />
            {canMoveUp ? (
                <Menu.Item
                    leftSection={<MdOutlineArrowUpward size={20} />}
                    onClick={() => {
                        if (note) {
                            onMove(note.id, 'up');
                        }
                    }}
                >
                    {T('action.moveUp')}
                </Menu.Item>
            ) : null}
            {canMoveDown ? (
                <Menu.Item
                    leftSection={<MdOutlineArrowDownward size={20} />}
                    onClick={() => {
                        if (note) {
                            onMove(note.id, 'down');
                        }
                    }}
                >
                    {T('action.moveDown')}
                </Menu.Item>
            ) : null}
            <Menu.Divider />
            <Menu.Item
                leftSection={<MdOutlineDelete size={20} />}
                onClick={() => {
                    if (note) {
                        onDelete(note.id);
                    }
                }}
            >
                {T('action.delete')}
            </Menu.Item>
        </Menu.Dropdown>
    );
};

export default NoteListMenuDropdown;
