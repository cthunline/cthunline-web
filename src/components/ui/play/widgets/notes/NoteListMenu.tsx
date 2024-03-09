import {
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    MdOutlineArrowUpward,
    MdOutlineArrowDownward,
    MdOutlineDelete,
    MdOutlineShare
} from 'react-icons/md';

import { useApp } from '../../../../contexts/App';
import { Note } from '../../../../../types';

export interface NoteListMenuProps {
    contextData: {
        anchorEl: HTMLElement | null;
        note: Note | null;
        canMoveUp: boolean;
        canMoveDown: boolean;
    };
    handleClose: () => void;
    onShare: (id: number, isShared: boolean) => void;
    onMove: (id: number, direction: 'up' | 'down') => void;
    onDelete: (id: number) => void;
}

const NoteListMenu = ({
    contextData: { anchorEl, note, canMoveUp, canMoveDown },
    handleClose,
    onShare,
    onMove,
    onDelete
}: NoteListMenuProps) => {
    const { T } = useApp();

    return (
        <Menu
            anchorEl={anchorEl}
            id="settings-menu"
            open={!!anchorEl}
            onClose={handleClose}
            onClick={handleClose}
        >
            <MenuItem
                onClick={() => {
                    if (note) {
                        onShare(note.id, !note.isShared);
                    }
                }}
            >
                <ListItemIcon>
                    <MdOutlineShare size={20} />
                </ListItemIcon>
                <ListItemText>
                    {note?.isShared
                        ? T('action.stopSharing')
                        : T('action.share')}
                </ListItemText>
            </MenuItem>
            <Divider />
            {canMoveUp ? (
                <MenuItem
                    onClick={() => {
                        if (note) {
                            onMove(note.id, 'up');
                        }
                    }}
                >
                    <ListItemIcon>
                        <MdOutlineArrowUpward size={20} />
                    </ListItemIcon>
                    <ListItemText>{T('action.moveUp')}</ListItemText>
                </MenuItem>
            ) : null}
            {canMoveDown ? (
                <MenuItem
                    onClick={() => {
                        if (note) {
                            onMove(note.id, 'down');
                        }
                    }}
                >
                    <ListItemIcon>
                        <MdOutlineArrowDownward size={20} />
                    </ListItemIcon>
                    <ListItemText>{T('action.moveDown')}</ListItemText>
                </MenuItem>
            ) : null}
            <Divider />
            <MenuItem
                onClick={() => {
                    if (note) {
                        onDelete(note.id);
                    }
                }}
            >
                <ListItemIcon>
                    <MdOutlineDelete size={20} />
                </ListItemIcon>
                <ListItemText>{T('action.delete')}</ListItemText>
            </MenuItem>
        </Menu>
    );
};

export default NoteListMenu;
