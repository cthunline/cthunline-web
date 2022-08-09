import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import {
    Box,
    TextField,
    IconButton
} from '@mui/material';
import { MdArrowBack } from 'react-icons/md';

import { Note } from '../../../../../types';
import { useApp } from '../../../../contexts/App';

interface NoteEditorProps {
    note: Note;
    onEdit: (note: Note) => void;
    onBack: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
    note,
    onEdit,
    onBack
}) => {
    const { userId } = useApp();

    const [title, setTitle] = useState<string>(note.title);
    const [text, setText] = useState<string>(note.text);

    const isOwnedByUser = note.userId === userId;

    const changeTime = 1000;
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (isOwnedByUser) {
            if (changeTimer.current) {
                clearTimeout(changeTimer.current);
            }
            changeTimer.current = setTimeout(() => {
                onEdit({
                    ...note,
                    title,
                    text
                });
            }, changeTime);
        }
    }, [
        isOwnedByUser,
        onEdit,
        note,
        title,
        text
    ]);

    return (
        <Box className="notes-widget-editor flex column">
            <Box className="full-width flex row center-y mb-5">
                <IconButton
                    className="mr-5"
                    size="medium"
                    onClick={onBack}
                >
                    <MdArrowBack />
                </IconButton>
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: !isOwnedByUser
                    }}
                    size="small"
                    type="text"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setTitle(e.target.value);
                    }}
                />
            </Box>
            <TextField
                fullWidth
                InputProps={{
                    readOnly: !isOwnedByUser
                }}
                multiline
                minRows={14}
                maxRows={14}
                type="text"
                value={text}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setText(e.target.value);
                }}
            />
        </Box>
    );
};

export default NoteEditor;
