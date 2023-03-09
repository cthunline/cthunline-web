import React, { useState } from 'react';
import { Box } from '@mui/material';

import { useApp } from '../../../../contexts/App';
import { useDialog } from '../../../../contexts/Dialog';
import { usePlay } from '../../../../contexts/Play';
import useNote from '../../../../hooks/useNote';
import Widget from '../../Widget';
import NoteList from './NoteList';
import NoteCreate from './NoteCreate';
import NoteEditor from './NoteEditor';
import { Note, WidgetType } from '../../../../../types';

import './NotesWidget.css';

interface NotesWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const NotesWidget: React.FC<NotesWidgetProps> = ({ onClose }) => {
    const { T } = useApp();
    const { confirmDialog } = useDialog();
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
        confirmDialog(confirmText, () => {
            deleteNote({
                noteId,
                isToast: false
            });
        });
    };

    return (
        <Widget
            id={`widget-${WidgetType.notes}`}
            title={T('entity.notes')}
            onClose={() => onClose(WidgetType.notes)}
        >
            <Box className="notes-widget-content flex column">
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
            </Box>
        </Widget>
    );
};

export default NotesWidget;
