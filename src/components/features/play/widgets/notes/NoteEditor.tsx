import { ActionIcon, Group, Stack, TextInput } from '@mantine/core';
import { MdArrowBack } from 'react-icons/md';

import { type Note } from '../../../../../types/index.js';
import { useApp } from '../../../../../contexts/App.js';
import Textarea from '../../../../common/Textarea.js';

interface NoteEditorProps {
    note: Note;
    onEdit: (note: Note) => void;
    onBack: () => void;
}

const NoteEditor = ({ note, onEdit, onBack }: NoteEditorProps) => {
    const { userId } = useApp();
    const isOwnedByUser = note.userId === userId;
    return (
        <Stack gap="0.5rem">
            <Group justify="center" w="100%" gap="0.5rem">
                <ActionIcon onClick={onBack}>
                    <MdArrowBack />
                </ActionIcon>
                <TextInput
                    readOnly={!isOwnedByUser}
                    flex={1}
                    value={note.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onEdit({
                            ...note,
                            title: e.target.value
                        });
                    }}
                />
            </Group>
            <Textarea
                readOnly={!isOwnedByUser}
                w="100%"
                rows={14}
                value={note.text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    onEdit({
                        ...note,
                        text: e.target.value
                    });
                }}
            />
        </Stack>
    );
};

export default NoteEditor;
