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
    children?: JSX.Element | JSX.Element[] | string;
    onClose?: () => void;
}

const Widget: React.FC<WidgetProps> = ({
    title,
    className,
    children,
    onClose
}) => {
    const focusWidget = (target: HTMLElement) => {
        const reactDragClass = '.react-draggable';
        const widgets = document.querySelectorAll(reactDragClass) as NodeListOf<HTMLElement>;
        for (let i = 0; i < widgets.length; i += 1) {
            widgets[i].style.zIndex = '1';
        }
        const thisWidget = target.closest(reactDragClass) as HTMLElement;
        if (thisWidget) {
            thisWidget.style.zIndex = '2';
        }
    };

    const nodeRef = React.useRef<HTMLElement>(null);

    return (
        <Draggable
            bounds="parent"
            handle="#widget-bar"
            nodeRef={nodeRef}
            onStart={(e) => {
                focusWidget(e.currentTarget as HTMLElement);
            }}
        >
            <Box
                className={`widget-container ${className ?? ''}`}
                ref={nodeRef}
            >
                <Paper
                    className="widget-paper"
                    elevation={3}
                >
                    <Box className="widget-inner flex column">
                        <Box id="widget-bar" className="widget-bar flex row center">
                            <Box className="widget-bar-title grow">
                                {title ?? ''}
                            </Box>
                            <MdClose
                                className="clickable"
                                size={25}
                                onClick={onClose}
                            />
                        </Box>
                        <Box
                            className="widget-content"
                            onMouseDown={(e) => {
                                focusWidget(e.currentTarget);
                            }}
                        >
                            {children}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Draggable>
    );
};

export default Widget;
