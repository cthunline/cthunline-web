import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { useApp } from '../contexts/App';
import { Note, NoteCreateBody, NoteEditBody } from '../../types';

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
            const { notes, sharedNotes } = await Api.call({
                method: 'GET',
                route: `/sessions/${sessionId}/notes?include=true`
            });
            return { notes, sharedNotes };
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    }, [sessionId, handleApiError]);

    const getNote = useCallback(
        async (noteId: number): Promise<Note> => {
            try {
                return await Api.call({
                    method: 'GET',
                    route: `/notes/${noteId}`
                });
            } catch (err: any) {
                handleApiError(err);
                throw err;
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
                const note = await Api.call({
                    method: 'POST',
                    route: `/sessions/${sessionId}/notes`,
                    data
                });
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note created');
                }
                return note;
            } catch (err: any) {
                handleApiError(err);
                throw err;
            }
        },
        [sessionId, refresh, handleApiError]
    );

    const editNote = async ({
        noteId,
        data,
        isRefresh = true,
        isToast = true
    }: EditNoteOptions): Promise<Note> => {
        try {
            const note = await Api.call({
                method: 'POST',
                route: `/notes/${noteId}`,
                data
            });
            if (isRefresh) {
                await refresh();
            }
            if (isToast) {
                toast.success('Note edited');
            }
            return note;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    const moveNote = async ({
        noteId,
        direction,
        isRefresh = true,
        isToast = true
    }: MoveNoteOptions): Promise<Note> => {
        try {
            const note = await Api.call({
                method: 'PUT',
                route: `/notes/${noteId}/${direction}`
            });
            if (isRefresh) {
                await refresh();
            }
            if (isToast) {
                toast.success('Note moved');
            }
            return note;
        } catch (err: any) {
            handleApiError(err);
            throw err;
        }
    };

    const deleteNote = useCallback(
        async ({
            noteId,
            isRefresh = true,
            isToast = true
        }: DeleteNoteOptions): Promise<void> => {
            try {
                await Api.call({
                    method: 'DELETE',
                    route: `/notes/${noteId}`
                });
                if (isRefresh) {
                    await refresh();
                }
                if (isToast) {
                    toast.success('Note deleted');
                }
            } catch (err: any) {
                handleApiError(err);
                throw err;
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
