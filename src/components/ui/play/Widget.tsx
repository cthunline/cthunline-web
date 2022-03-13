import React from 'react';
import Draggable from 'react-draggable';
import {
    Box,
    Paper
} from '@mui/material';
import { MdClose } from 'react-icons/md';

import './Widget.css';

interface WidgetProps {
    title?: string;
    className?: string;
    children?: JSX.Element | JSX.Element[];
}

const Widget: React.FC<WidgetProps> = ({
    title,
    className,
    children
}) => (
    <Draggable bounds="parent" handle="#widget-bar">
        <Box className={`widget-container ${className ?? ''}`}>
            <Paper className="widget-paper" elevation={3}>
                <Box className="widget-inner flex column">
                    <Box id="widget-bar" className="widget-bar flex row">
                        <Box className="grow">
                            {title ?? ''}
                        </Box>
                        <MdClose className="widget-bar-icon" size={25} />
                    </Box>
                    <Box className="widget-content">
                        {children}
                    </Box>
                </Box>
            </Paper>
        </Box>
    </Draggable>
);

export default Widget;
