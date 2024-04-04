import { callApi } from '../api';

import { type Note, type NoteCreateBody, type NoteEditBody } from '../../types';

export const getNotes = async (sessionId: number) => {
    const { notes, sharedNotes } = await callApi<{
        notes: Note[];
        sharedNotes: Note[];
    }>({
        method: 'GET',
        route: `/sessions/${sessionId}/notes?include=true`
    });
    return { notes, sharedNotes };
};

export const getNote = async (noteId: number) =>
    callApi<Note>({
        method: 'GET',
        route: `/notes/${noteId}`
    });

export const createNote = async (sessionId: number, body: NoteCreateBody) =>
    callApi<Note>({
        method: 'POST',
        route: `/sessions/${sessionId}/notes`,
        body
    });

export const editNote = async (noteId: number, body: NoteEditBody) =>
    callApi<Note>({
        method: 'POST',
        route: `/notes/${noteId}`,
        body
    });

export const moveNote = async (noteId: number, direction: 'up' | 'down') =>
    callApi<Note>({
        method: 'PUT',
        route: `/notes/${noteId}/${direction}`
    });

export const deleteNote = async (noteId: number) => {
    await callApi({
        method: 'DELETE',
        route: `/notes/${noteId}`
    });
};
