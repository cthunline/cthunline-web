import { ActionIcon, Group, Stack, TextInput } from '@mantine/core';
import { MdArrowBack } from 'react-icons/md';

import TextEditor from '../../../../common/TextEditor.js';
import { type Note } from '../../../../../types/index.js';
import { useApp } from '../../../../../contexts/App.js';

interface NoteEditorProps {
    note: Note;
    onEdit: (note: Note) => void;
    onBack: () => void;
}

const NoteEditor = ({ note, onEdit, onBack }: NoteEditorProps) => {
    const { userId } = useApp();
    const isOwnedByUser = note.userId === userId;
    return (
        <Stack gap="0.5rem" w="100%" h="100%">
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
            <TextEditor
                w="100%"
                flex="1 0"
                readonly={!isOwnedByUser}
                value={note.text}
                onChange={(text: string) => {
                    onEdit({ ...note, text });
                }}
            />
        </Stack>
    );
};

export default NoteEditor;
