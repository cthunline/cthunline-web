import { FiPlusCircle } from 'react-icons/fi';
import { ActionIcon, Group, TextInput } from '@mantine/core';
import { useState } from 'react';

interface NoteCreateProps {
    onCreate: (title: string) => void;
}

interface NoteCreateData {
    title: string;
    error: boolean;
}

const defaultData: NoteCreateData = {
    title: '',
    error: false
};

const NoteCreate = ({ onCreate }: NoteCreateProps) => {
    const [data, setData] = useState<NoteCreateData>(defaultData);
    return (
        <Group w="100%" gap="0.5rem">
            <TextInput
                flex={1}
                value={data.title}
                error={data.error}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setData((prev) => ({
                        title: val,
                        error: val.trim() ? false : prev.error
                    }));
                }}
            />
            <ActionIcon
                onClick={() => {
                    if (data.title.trim()) {
                        onCreate(data.title);
                        setData(defaultData);
                    } else {
                        setData((prev) => ({
                            ...prev,
                            error: true
                        }));
                    }
                }}
            >
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default NoteCreate;
