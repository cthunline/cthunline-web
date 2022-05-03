import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import { Box, TextField } from '@mui/material';

import { useApp } from '../../../../contexts/App';
import { usePlay } from '../../../../contexts/Play';
import useSession from '../../../../hooks/useSession';
import Widget from '../../Widget';
import { WidgetType } from '../../../../../types';

import './NotesWidget.css';

interface NotesWidgetProps {
    text?: string;
    onClose: (widget: WidgetType) => void;
}

const NotesWidget: React.FC<NotesWidgetProps> = ({
    text,
    onClose
}) => {
    const { T } = useApp();
    const { getNotes, editNotes } = useSession();
    const { sessionId } = usePlay();

    const [notes, setNotes] = useState<string>(text ?? '');

    const initialGet = useRef(true);
    useEffect(() => {
        (async () => {
            if (initialGet.current) {
                initialGet.current = false;
                const { text: notesText } = await getNotes(sessionId);
                setNotes(notesText);
            }
        })();
    }, [
        sessionId,
        getNotes
    ]);

    const changeTime = 1000;
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (changeTimer.current) {
            clearTimeout(changeTimer.current);
        }
        changeTimer.current = setTimeout(() => {
            (async () => {
                await editNotes({
                    sessionId,
                    text: notes,
                    isToast: false
                });
            })();
        }, changeTime);
    }, [
        sessionId,
        editNotes,
        notes
    ]);

    return (
        <Widget
            id={`widget-${WidgetType.notes}`}
            title={T('entity.notes')}
            onClose={() => onClose(WidgetType.notes)}
        >
            <Box className="notes-widget-content flex column">
                <TextField
                    fullWidth
                    multiline
                    minRows={12}
                    maxRows={12}
                    type="text"
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNotes(e.target.value);
                    }}
                />
            </Box>
        </Widget>
    );
};

export default NotesWidget;
