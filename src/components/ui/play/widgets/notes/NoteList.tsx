import React, { useState } from 'react';
import {
    Box,
    IconButton,
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    ListItemButton,
    ListItemSecondaryAction,
    Tooltip
} from '@mui/material';
import { MdOutlineShare } from 'react-icons/md';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

import NoteListMenu from './NoteListMenu';
import { Note, User } from '../../../../../types';
import { useApp } from '../../../../contexts/App';

import './NotesWidget.css';

interface NoteListProps {
    notes: Note[];
    sharedNotes: Note[];
    onSelect: (note: Note) => void;
    onShare: (id: number, isShared: boolean) => void;
    onMove: (id: number, direction: 'up' | 'down') => void;
    onDelete: (id: number) => void;
}

interface MenuContextData {
    anchorEl: HTMLElement | null;
    note: Note | null;
    canMoveUp: boolean;
    canMoveDown: boolean;
}

const emptyMenuContextData = {
    anchorEl: null,
    note: null,
    canMoveUp: false,
    canMoveDown: false
};

interface NotesData {
    key: string;
    list: Note[];
    header: string;
    user?: User;
}

const NoteList: React.FC<NoteListProps> = ({
    notes,
    sharedNotes,
    onSelect,
    onShare,
    onMove,
    onDelete
}) => {
    const { T, userId } = useApp();

    const [menuContextData, setMenuContextData] = useState<MenuContextData>(emptyMenuContextData);

    const maxPosition = Math.max(
        ...notes.map(({ position }) => Number(position))
    );

    const onMenuClick = (e: React.MouseEvent<HTMLElement>, note: Note) => {
        setMenuContextData({
            anchorEl: e.currentTarget,
            note,
            canMoveUp: note.position > 1,
            canMoveDown: note.position < maxPosition
        });
    };

    const onMenuClose = () => {
        setMenuContextData(emptyMenuContextData);
    };

    const usersById: Record<string, User> = {};
    const sharedNotesByUserId: Record<string, Note[]> = {};
    sharedNotes.forEach((note) => {
        if (note.user && !usersById[note.userId]) {
            usersById[note.userId] = note.user;
        }
        if (!sharedNotesByUserId[note.userId]) {
            sharedNotesByUserId[note.userId] = [];
        }
        sharedNotesByUserId[note.userId].push(note);
    });

    const notesData: NotesData[] = [
        {
            key: 'yourNotes',
            list: notes,
            header: T('page.play.note.yourNotes')
        },
        ...Object.keys(sharedNotesByUserId).map((noteUserId) => ({
            key: `sharedNotes-${userId}`,
            list: sharedNotesByUserId[noteUserId],
            header: T('page.play.note.sharedUserNotes', {
                name: usersById[noteUserId].name
            })
        }))
    ];

    return (
        <Box className="notes-list full-width scroll">
            {notesData.map(({ key, list, header }) => (
                list.length ? (
                    <List
                        key={key}
                        subheader={(
                            <ListSubheader className="notes-header">
                                {header}
                            </ListSubheader>
                        )}
                    >
                        {list.map((note) => {
                            const {
                                id,
                                title,
                                userId: noteUserId
                            } = note;
                            const isOwnedByUser = noteUserId === userId;
                            return (
                                <ListItem
                                    key={`note-${id}`}
                                    secondaryAction={isOwnedByUser ? (
                                        <ListItemSecondaryAction className="notes-action">
                                            <IconButton
                                                size="medium"
                                                onClick={(e: React.MouseEvent<HTMLElement>) => {
                                                    onMenuClick(e, note);
                                                }}
                                            >
                                                <HiOutlineDotsHorizontal />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    ) : null}
                                    disablePadding
                                >
                                    <ListItemButton
                                        className="notes-item clickable"
                                        onClick={() => onSelect(note)}
                                    >
                                        {isOwnedByUser && note.isShared ? (
                                            <Box>
                                                <Tooltip
                                                    placement="bottom"
                                                    title={T('common.shared')}
                                                >
                                                    <Box className="mr-10" component="span">
                                                        <MdOutlineShare
                                                            className="vertical-middle"
                                                            size={15}
                                                        />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        ) : null}
                                        <ListItemText
                                            className="notes-title"
                                            primary={title}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                ) : null
            ))}
            <NoteListMenu
                key="note-menu"
                contextData={menuContextData}
                handleClose={onMenuClose}
                onShare={onShare}
                onMove={onMove}
                onDelete={onDelete}
            />
        </Box>
    );
};

export default NoteList;
