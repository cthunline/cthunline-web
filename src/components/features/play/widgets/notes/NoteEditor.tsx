import { ActionIcon, Group, Stack, TextInput } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { MdArrowBack } from 'react-icons/md';

import { type Note } from '../../../../../types/index.js';
import Textarea from '../../../../common/Textarea.js';
import { useApp } from '../../../../../contexts/App.js';

interface NoteEditorProps {
    note: Note;
    onEdit: (note: Note) => void;
    onBack: () => void;
}

const NoteEditor = ({ note, onEdit, onBack }: NoteEditorProps) => {
    const { userId } = useApp();

    const [title, setTitle] = useState<string>(note.title);
    const [text, setText] = useState<string>(note.text);

    const isOwnedByUser = note.userId === userId;

    const changeTime = 1000;
    const changeTimer = useRef<number | null>(null);
    useEffect(() => {
        if (isOwnedByUser) {
            if (changeTimer.current !== null) {
                window.clearTimeout(changeTimer.current);
            }
            changeTimer.current = window.setTimeout(() => {
                onEdit({
                    ...note,
                    title,
                    text
                });
            }, changeTime);
        }
    }, [isOwnedByUser, onEdit, note, title, text]);

    return (
        <Stack gap="0.5rem">
            <Group justify="center" w="100%" gap="0.5rem">
                <ActionIcon onClick={onBack}>
                    <MdArrowBack />
                </ActionIcon>
                <TextInput
                    readOnly={!isOwnedByUser}
                    flex={1}
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setTitle(e.target.value);
                    }}
                />
            </Group>
            <Textarea
                readOnly={!isOwnedByUser}
                w="100%"
                rows={14}
                value={text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setText(e.target.value);
                }}
            />
        </Stack>
    );
};

export default NoteEditor;
