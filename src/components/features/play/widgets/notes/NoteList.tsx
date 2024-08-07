import { ActionIcon, Box, Menu, Stack, Title, Tooltip } from '@mantine/core';
import { useMemo } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdOutlineShare } from 'react-icons/md';

import { useApp } from '../../../../../contexts/App.js';
import type { Note, User } from '../../../../../types/index.js';
import InteractiveList from '../../../../common/InteractiveList.js';
import NoteListMenuDropdown from './NoteListMenuDropdown.js';

interface NoteListProps {
    notes: Note[];
    sharedNotes: Note[];
    onSelect: (note: Note) => void;
    onShare: (id: number, isShared: boolean) => void;
    onMove: (id: number, direction: 'up' | 'down') => void;
    onDelete: (id: number, isShared: boolean) => void;
}

interface NotesData {
    key: string;
    list: Note[];
    header: string;
    user?: User;
}

const NoteList = ({
    notes,
    sharedNotes,
    onSelect,
    onShare,
    onMove,
    onDelete
}: NoteListProps) => {
    const { T, userId } = useApp();

    const maxPosition = Math.max(
        ...notes.map(({ position }) => Number(position))
    );

    const notesData: NotesData[] = useMemo(() => {
        const usersById: Record<string, User> = {};
        const sharedNotesByUserId: Record<string, Note[]> = {};
        for (const note of sharedNotes) {
            if (note.user && !usersById[note.userId]) {
                usersById[note.userId] = note.user;
            }
            if (!sharedNotesByUserId[note.userId]) {
                sharedNotesByUserId[note.userId] = [];
            }
            sharedNotesByUserId[note.userId].push(note);
        }
        return [
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
    }, [notes, sharedNotes, T, userId]);

    return (
        <Box w="100%" h={0} flex="1 0" style={{ overflowY: 'auto' }}>
            {notesData.map(({ key, list, header }) =>
                list.length ? (
                    <Stack key={`notes-section-${key}`} w="100%" gap="0.5rem">
                        <Title key={`${key}-title`} order={6}>
                            {header}
                        </Title>
                        <InteractiveList key={key}>
                            {list.map((note) => {
                                const { id, title, userId: noteUserId } = note;
                                const isOwnedByUser = noteUserId === userId;
                                return (
                                    <InteractiveList.Item
                                        key={`note-${noteUserId}-${id}`}
                                        onClick={() => onSelect(note)}
                                        leftIcon={
                                            isOwnedByUser &&
                                            note.isShared && (
                                                <Tooltip
                                                    position="bottom"
                                                    label={T('common.shared')}
                                                >
                                                    <Box h="1rem">
                                                        <MdOutlineShare size="1rem" />
                                                    </Box>
                                                </Tooltip>
                                            )
                                        }
                                        rightAction={
                                            isOwnedByUser && (
                                                <Menu>
                                                    <Menu.Target>
                                                        <ActionIcon>
                                                            <HiOutlineDotsHorizontal />
                                                        </ActionIcon>
                                                    </Menu.Target>
                                                    <NoteListMenuDropdown
                                                        note={note}
                                                        canMoveUp={
                                                            note.position > 1
                                                        }
                                                        canMoveDown={
                                                            note.position <
                                                            maxPosition
                                                        }
                                                        onShare={onShare}
                                                        onMove={onMove}
                                                        onDelete={onDelete}
                                                    />
                                                </Menu>
                                            )
                                        }
                                    >
                                        {title}
                                    </InteractiveList.Item>
                                );
                            })}
                        </InteractiveList>
                    </Stack>
                ) : null
            )}
        </Box>
    );
};

export default NoteList;
