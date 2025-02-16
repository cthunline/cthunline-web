import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../../contexts/App.js';
import {
    createNote as createNoteRequest,
    deleteNote as deleteNoteRequest,
    editNote as editNoteRequest,
    getNote as getNoteRequest,
    getNotes as getNotesRequest,
    moveNote as moveNoteRequest
} from '../../services/requests/note.js';
import { toast } from '../../services/toast.js';
import type { Note, NoteCreateBody, NoteEditBody } from '../../types/index.js';
import type { SocketClient } from '../../types/socket.js';

interface NoteHookOptions {
    sessionId: number;
    loadList?: boolean;
    socket?: SocketClient | null;
}

interface CreateNoteOptions {
    data: NoteCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditNoteOptions {
    noteId: number;
    data: NoteEditBody;
    unshare?: boolean;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface MoveNoteOptions {
    noteId: number;
    direction: 'up' | 'down';
    isRefresh?: boolean;
    isToast?: boolean;
}

interface DeleteNoteOptions {
    noteId: number;
    isShared: boolean;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface NoteList {
    notes: Note[];
    sharedNotes: Note[];
}

const defaultNoteTitle = '?';

const useNote = ({ sessionId, loadList, socket }: NoteHookOptions) => {
    const { handleApiError } = useApp();

    const [noteList, setNoteList] = useState<NoteList>({
        notes: [],
        sharedNotes: []
    });

    const [editorNote, setEditorNote] = useState<Note | null>(null);

    const setSharedNoteInList = useCallback((note: Note) => {
        setNoteList(({ notes, sharedNotes }) => {
            let existsInList = false;
            const updatedSharedNotes = sharedNotes.map((nt) => {
                if (nt.id === note.id) {
                    existsInList = true;
                    return note;
                }
                return nt;
            });
            if (!existsInList) {
                updatedSharedNotes.push(note);
            }
            return {
                notes,
                sharedNotes: updatedSharedNotes
            };
        });
    }, []);

    const deleteSharedNoteFromList = useCallback((noteId: number) => {
        setNoteList(({ notes, sharedNotes }) => ({
            notes,
            sharedNotes: sharedNotes.filter(({ id }) => id !== noteId)
        }));
    }, []);

    const getNotes = useCallback(async (): Promise<NoteList> => {
        try {
            const { notes, sharedNotes } = await getNotesRequest(sessionId);
            return { notes, sharedNotes };
        } catch (err: unknown) {
            throw handleApiError(err);
        }
    }, [sessionId, handleApiError]);

    const getNote = useCallback(
        async (noteId: number): Promise<Note> => {
            try {
                return await getNoteRequest(noteId);
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [handleApiError]
    );

    const refreshNoteList = useCallback(async () => {
        const { notes, sharedNotes } = await getNotes();
        setNoteList({ notes, sharedNotes });
    }, [getNotes]);

    const refresh = useCallback(async () => {
        if (loadList) {
            await refreshNoteList();
        }
    }, [loadList, refreshNoteList]);

    const createNote = useCallback(
        async ({
            data,
            isRefresh = true,
            isToast = true
        }: CreateNoteOptions): Promise<Note> => {
            try {
                const note = await createNoteRequest(sessionId, {
                    ...data,
                    title: data.title.trim() ? data.title : defaultNoteTitle
                });
                if (note.isShared) {
                    socket?.emit('noteUpdate', { noteId: note.id });
                }
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note created');
                }
                return note;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [sessionId, refresh, handleApiError, socket]
    );

    const editNote = useCallback(
        async ({
            noteId,
            data,
            unshare,
            isRefresh = true,
            isToast = true
        }: EditNoteOptions): Promise<Note> => {
            try {
                const note = await editNoteRequest(noteId, {
                    ...data,
                    ...(Object.hasOwn(data, 'title')
                        ? {
                              title: data.title?.trim()
                                  ? data.title
                                  : defaultNoteTitle
                          }
                        : {})
                });
                if (note.isShared) {
                    socket?.emit('noteUpdate', { noteId: note.id });
                } else if (unshare) {
                    socket?.emit('noteDelete', { noteId: note.id });
                }
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note edited');
                }
                return note;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [handleApiError, refresh, socket]
    );

    const moveNote = useCallback(
        async ({
            noteId,
            direction,
            isRefresh = true,
            isToast = true
        }: MoveNoteOptions): Promise<Note> => {
            try {
                const note = await moveNoteRequest(noteId, direction);
                if (note.isShared) {
                    socket?.emit('noteUpdate', { noteId: note.id });
                }
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note moved');
                }
                return note;
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [handleApiError, refresh, socket]
    );

    const deleteNote = useCallback(
        async ({
            noteId,
            isShared,
            isRefresh = true,
            isToast = true
        }: DeleteNoteOptions): Promise<void> => {
            try {
                await deleteNoteRequest(noteId);
                if (isShared) {
                    socket?.emit('noteDelete', { noteId });
                }
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note deleted');
                }
            } catch (err: unknown) {
                throw handleApiError(err);
            }
        },
        [refresh, handleApiError, socket]
    );

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        socket?.on('noteUpdate', ({ note }) => {
            setSharedNoteInList(note);
            setEditorNote((prev) =>
                prev && prev.id === note.id ? note : prev
            );
        });
        socket?.on('noteDelete', ({ noteId }) => {
            deleteSharedNoteFromList(noteId);
            setEditorNote((prev) => (prev && prev.id === noteId ? null : prev));
        });
        return () => {
            socket?.off('noteUpdate');
            socket?.off('noteDelete');
        };
    }, [socket, deleteSharedNoteFromList, setSharedNoteInList]);

    return {
        noteList,
        editorNote,
        setEditorNote,
        getNotes,
        getNote,
        createNote,
        editNote,
        moveNote,
        deleteNote
    };
};

export default useNote;
