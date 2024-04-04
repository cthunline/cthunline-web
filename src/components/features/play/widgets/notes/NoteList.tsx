import { ActionIcon, Box, Menu, Title, Tooltip } from '@mantine/core';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdOutlineShare } from 'react-icons/md';

import InteractiveList from '../../../../common/InteractiveList';
import { type Note, type User } from '../../../../../types';
import NoteListMenuDropdown from './NoteListMenuDropdown';
import { useApp } from '../../../../contexts/App';

interface NoteListProps {
    notes: Note[];
    sharedNotes: Note[];
    onSelect: (note: Note) => void;
    onShare: (id: number, isShared: boolean) => void;
    onMove: (id: number, direction: 'up' | 'down') => void;
    onDelete: (id: number) => void;
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
        <Box w="100%" h="360px" style={{ overflowY: 'auto' }}>
            {notesData.map(({ key, list, header }) =>
                list.length ? (
                    <>
                        <Title
                            key={`${key}-title`}
                            order={6}
                            bg="var(--palette-background-secondary)"
                        >
                            {header}
                        </Title>
                        <InteractiveList key={key}>
                            {list.map((note) => {
                                const { id, title, userId: noteUserId } = note;
                                const isOwnedByUser = noteUserId === userId;
                                return (
                                    <InteractiveList.Item
                                        key={`note-${id}`}
                                        onClick={() => onSelect(note)}
                                        leftIcon={
                                            isOwnedByUser &&
                                            note.isShared && (
                                                <Tooltip
                                                    position="bottom"
                                                    label={T('common.shared')}
                                                >
                                                    <Box>
                                                        <MdOutlineShare
                                                            className="vertical-middle"
                                                            size={15}
                                                        />
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
                    </>
                ) : null
            )}
        </Box>
    );
};

export default NoteList;
