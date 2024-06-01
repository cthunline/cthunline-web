import { modals } from '@mantine/modals';
import { Stack } from '@mantine/core';
import { useRef } from 'react';

import useCharacterSheetStatus from '../../../../../hooks/api/useCharacterSheetStatus.js';
import { type Note, WidgetType } from '../../../../../types/index.js';
import { usePlay } from '../../../../../contexts/Play.js';
import useNote from '../../../../../hooks/api/useNote.js';
import { useApp } from '../../../../../contexts/App.js';
import NoteCreate from './NoteCreate.js';
import NoteEditor from './NoteEditor.js';
import Widget from '../../Widget.js';
import NoteList from './NoteList.js';

interface NotesWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const NotesWidget = ({ onClose }: NotesWidgetProps) => {
    const { T } = useApp();
    const { sessionId, socket } = usePlay();
    const {
        noteList,
        editorNote,
        setEditorNote,
        createNote,
        editNote,
        moveNote,
        deleteNote
    } = useNote({
        sessionId,
        loadList: true,
        socket
    });

    const { status, updateStatus } = useCharacterSheetStatus();

    const onCreate = async (title: string) => {
        const note = await createNote({
            data: {
                title,
                text: ''
            },
            isToast: false
        });
        setEditorNote(note);
    };

    const changeTime = 1000;
    const changeTimer = useRef<number | null>(null);

    const onEdit = async (note: Note) => {
        setEditorNote(note);
        updateStatus('saving');
        if (changeTimer.current !== null) {
            window.clearTimeout(changeTimer.current);
        }
        changeTimer.current = window.setTimeout(async () => {
            const { id, title, text } = note;
            await editNote({
                noteId: id,
                data: {
                    title,
                    text
                },
                isToast: false
            });
            updateStatus('saved');
        }, changeTime);
    };

    const onShare = async (noteId: number, isShared: boolean) => {
        await editNote({
            noteId,
            unshare: true,
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

    const onDelete = async (noteId: number, isShared: boolean) => {
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
                    isShared,
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
            <Stack w="35rem" h="30rem">
                {editorNote ? (
                    <NoteEditor
                        status={status}
                        note={editorNote}
                        onEdit={onEdit}
                        onBack={() => setEditorNote(null)}
                    />
                ) : (
                    [
                        <NoteList
                            key="note-list"
                            notes={noteList.notes}
                            sharedNotes={noteList.sharedNotes}
                            onSelect={(note: Note) => setEditorNote(note)}
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
