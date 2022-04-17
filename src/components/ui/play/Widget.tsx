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
    id: string;
    className?: string;
    actions?: JSX.Element | JSX.Element[];
    children?: JSX.Element | JSX.Element[] | string;
    onClose?: () => void;
}

const Widget: React.FC<WidgetProps> = ({
    title,
    id,
    className,
    actions,
    children,
    onClose
}) => {
    const focusWidget = (target: HTMLElement) => {
        const reactDragClass = '.react-draggable';
        const widgets = document.querySelectorAll(reactDragClass);
        widgets.forEach((w, idx) => {
            (widgets[idx] as HTMLElement).style.zIndex = '1';
        });
        const thisWidget = target.closest(reactDragClass) as HTMLElement;
        if (thisWidget) {
            thisWidget.style.zIndex = '2';
        }
    };

    const nodeRef = React.useRef<HTMLElement>(null);

    return (
        <Draggable
            bounds="parent"
            handle={`#${id}-bar`}
            nodeRef={nodeRef}
            onStart={(e) => {
                focusWidget(e.currentTarget as HTMLElement);
            }}
        >
            <Box
                id={id}
                className={`widget-container ${className ?? ''}`}
                ref={nodeRef}
            >
                <Paper
                    className="widget-paper full-width full-height"
                    elevation={3}
                >
                    <Box className="widget-inner flex column full-width full-height">
                        <Box id={`${id}-bar`} className="widget-bar full-width flex row center">
                            <Box className="widget-bar-title pl-5 pr-5">
                                {title ?? ''}
                            </Box>
                            <Box className="widget-bar-actions grow flex row centerY">
                                {actions}
                            </Box>
                            <MdClose
                                className="clickable"
                                size={25}
                                onClick={onClose}
                            />
                        </Box>
                        <Box
                            className="widget-content full-width"
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
