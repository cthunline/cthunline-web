import React from 'react';
import { Box } from '@mui/material';

import Widget from '../play/Widget';
import { WidgetType } from '../../../types';
import TextEditor from '../textEditor/TextEditor';

import './NotesWidget.css';

interface NotesWidgetProps {
    // onChange: (notes: NotesTypes) => void;
    onClose: (widget: WidgetType) => void;
}

const NotesWidget: React.FC<NotesWidgetProps> = ({ onClose }) => (
    <Widget
        title="Notes"
        onClose={() => onClose(WidgetType.notes)}
    >
        <Box className="notes-widget-content flex column">
            <TextEditor
                className="notes-widget-editor"
                value=""
                // onChange={(html) => {
                //     console.log(html);
                // }}
            />
        </Box>
    </Widget>
);

export default NotesWidget;
