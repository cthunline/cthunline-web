import { FiPlusCircle } from 'react-icons/fi';
import { ActionIcon, Group, TextInput } from '@mantine/core';
import { useState } from 'react';

interface NoteCreateProps {
    onCreate: (title: string) => void;
}

const NoteCreate = ({ onCreate }: NoteCreateProps) => {
    const [title, setTitle] = useState<string>('');
    return (
        <Group w="100%" gap="0.5rem">
            <TextInput
                flex={1}
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.target.value);
                }}
            />
            <ActionIcon
                onClick={() => {
                    if (title.trim()) {
                        onCreate(title);
                        setTitle('');
                    }
                }}
            >
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default NoteCreate;
