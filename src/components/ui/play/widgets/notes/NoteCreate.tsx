import { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';

interface NoteCreateProps {
    onCreate: (title: string) => void;
}

const NoteCreate = ({ onCreate }: NoteCreateProps) => {
    const [title, setTitle] = useState<string>('');

    return (
        <Box key="notes-form" className="full-width flex row center-y">
            <TextField
                fullWidth
                size="small"
                type="text"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.target.value);
                }}
            />
            <IconButton
                className="ml-5"
                size="medium"
                onClick={() => {
                    if (title.trim()) {
                        onCreate(title);
                        setTitle('');
                    }
                }}
            >
                <FiPlusCircle />
            </IconButton>
        </Box>
    );
};

export default NoteCreate;
