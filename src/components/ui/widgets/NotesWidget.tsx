import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import { Box, TextField } from '@mui/material';

import Widget from '../play/Widget';
import { WidgetType } from '../../../types';

import './NotesWidget.css';

interface NotesWidgetProps {
    text?: string;
    onChange?: (text: string) => void;
    onClose: (widget: WidgetType) => void;
}

const NotesWidget: React.FC<NotesWidgetProps> = ({
    text,
    onChange,
    onClose
}) => {
    const [value, setValue] = useState<string>(text ?? '');

    const changeTime = 1000;
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (changeTimer.current) {
            clearTimeout(changeTimer.current);
        }
        changeTimer.current = setTimeout(() => {
            onChange?.(value);
        }, changeTime);
    }, [
        onChange,
        value
    ]);

    return (
        <Widget
            title="Notes"
            onClose={() => onClose(WidgetType.notes)}
        >
            <Box className="notes-widget-content flex column">
                <TextField
                    fullWidth
                    multiline
                    minRows={12}
                    maxRows={12}
                    type="text"
                    // size="small"
                    value={text}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue(e.target.value);
                    }}
                />
            </Box>
        </Widget>
    );
};

export default NotesWidget;
