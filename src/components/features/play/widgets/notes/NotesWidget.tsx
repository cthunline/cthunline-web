import { modals } from '@mantine/modals';
import { Stack } from '@mantine/core';
import { useState } from 'react';

import { type Note, WidgetType } from '../../../../../types/index.js';
import { usePlay } from '../../../../contexts/Play.js';
import { useApp } from '../../../../contexts/App.js';
import useNote from '../../../../hooks/useNote.js';
import NoteCreate from './NoteCreate.js';
import NoteEditor from './NoteEditor.js';
import Widget from '../../Widget.js';
import NoteList from './NoteList.js';

interface NotesWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const NotesWidget = ({ onClose }: NotesWidgetProps) => {
    const { T } = useApp();
    const { sessionId } = usePlay();
    const { noteList, createNote, editNote, moveNote, deleteNote } = useNote({
        sessionId,
        loadList: true
    });

    const [noteData, setNoteData] = useState<Note | null>(null);

    const onCreate = async (title: string) => {
        const note = await createNote({
            data: {
                title,
                text: ''
            },
            isToast: false
        });
        setNoteData(note);
    };

    const onEdit = async (note: Note) => {
        const { id, title, text } = note;
        await editNote({
            noteId: id,
            data: {
                title,
                text
            },
            isToast: false
        });
    };

    const onShare = async (noteId: number, isShared: boolean) => {
        await editNote({
            noteId,
            data: {
                isShared
            },
            isToast: false
        });
    };

    const onMove = async (noteId: number, direction: 'up' | 'down') => {
        await moveNote({
            noteId,
            direction,
            isToast: false
        });
    };

    const onDelete = async (noteId: number) => {
        const confirmText = T('page.play.note.deleteConfirm');
        modals.openConfirmModal({
            centered: true,
            title: confirmText,
            labels: {
                confirm: T('action.confirm'),
                cancel: T('action.cancel')
            },
            onConfirm: () => {
                deleteNote({
                    noteId,
                    isToast: false
                });
            }
        });
    };

    return (
        <Widget
            id={`widget-${WidgetType.notes}`}
            title={T('entity.notes')}
            onClose={() => onClose(WidgetType.notes)}
        >
            <Stack w="400px">
                {noteData ? (
                    <NoteEditor
                        note={noteData}
                        onEdit={onEdit}
                        onBack={() => setNoteData(null)}
                    />
                ) : (
                    [
                        <NoteList
                            key="note-list"
                            notes={noteList.notes}
                            sharedNotes={noteList.sharedNotes}
                            onSelect={(note: Note) => setNoteData(note)}
                            onShare={onShare}
                            onMove={onMove}
                            onDelete={onDelete}
                        />,
                        <NoteCreate key="note-create" onCreate={onCreate} />
                    ]
                )}
            </Stack>
        </Widget>
    );
};

export default NotesWidget;
