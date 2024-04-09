import { useState, useEffect, useCallback } from 'react';

import { toast } from '../../services/toast.js';
import { useApp } from '../contexts/App.js';
import {
    type Note,
    type NoteCreateBody,
    type NoteEditBody
} from '../../types/index.js';
import {
    createNote as createNoteRequest,
    deleteNote as deleteNoteRequest,
    editNote as editNoteRequest,
    getNote as getNoteRequest,
    getNotes as getNotesRequest,
    moveNote as moveNoteRequest
} from '../../services/requests/note.js';

interface NoteHookOptions {
    sessionId: number;
    loadList?: boolean;
}

interface CreateNoteOptions {
    data: NoteCreateBody;
    isRefresh?: boolean;
    isToast?: boolean;
}

interface EditNoteOptions {
    noteId: number;
    data: NoteEditBody;
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
    isRefresh?: boolean;
    isToast?: boolean;
}

interface NoteList {
    notes: Note[];
    sharedNotes: Note[];
}

const useNote = ({ sessionId, loadList }: NoteHookOptions) => {
    const { handleApiError } = useApp();

    const [noteList, setNoteList] = useState<NoteList>({
        notes: [],
        sharedNotes: []
    });

    const getNotes = useCallback(async (): Promise<NoteList> => {
        try {
            const { notes, sharedNotes } = await getNotesRequest(sessionId);
            return { notes, sharedNotes };
        } catch (err: any) {
            throw handleApiError(err);
        }
    }, [sessionId, handleApiError]);

    const getNote = useCallback(
        async (noteId: number): Promise<Note> => {
            try {
                return await getNoteRequest(noteId);
            } catch (err: any) {
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
        const tasks = [];
        if (loadList) {
            tasks.push(refreshNoteList());
        }
        await Promise.all(tasks);
    }, [loadList, refreshNoteList]);

    const createNote = useCallback(
        async ({
            data,
            isRefresh = true,
            isToast = true
        }: CreateNoteOptions): Promise<Note> => {
            try {
                const note = await createNoteRequest(sessionId, data);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note created');
                }
                return note;
            } catch (err: any) {
                throw handleApiError(err);
            }
        },
        [sessionId, refresh, handleApiError]
    );

    const editNote = useCallback(
        async ({
            noteId,
            data,
            isRefresh = true,
            isToast = true
        }: EditNoteOptions): Promise<Note> => {
            try {
                const note = await editNoteRequest(noteId, data);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note edited');
                }
                return note;
            } catch (err: any) {
                throw handleApiError(err);
            }
        },
        [handleApiError, refresh]
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
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note moved');
                }
                return note;
            } catch (err: any) {
                throw handleApiError(err);
            }
        },
        [handleApiError, refresh]
    );

    const deleteNote = useCallback(
        async ({
            noteId,
            isRefresh = true,
            isToast = true
        }: DeleteNoteOptions): Promise<void> => {
            try {
                await deleteNoteRequest(noteId);
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note deleted');
                }
            } catch (err: any) {
                throw handleApiError(err);
            }
        },
        [refresh, handleApiError]
    );

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        noteList,
        getNotes,
        getNote,
        createNote,
        editNote,
        moveNote,
        deleteNote
    };
};

export default useNote;
