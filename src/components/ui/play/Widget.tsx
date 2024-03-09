import React, { useEffect } from 'react';
import Draggable from 'react-draggable';
import { Box, Paper } from '@mui/material';
import { MdClose } from 'react-icons/md';

import { focusWidget } from '../../../services/widget';

import './Widget.css';

declare module 'react-draggable' {
    export interface DraggableProps {
        children: React.ReactNode;
    }
}

// workaround for react 18 compatibility
// https://github.com/react-grid-layout/react-draggable/issues/647
// https://github.com/react-grid-layout/react-draggable/pull/648
interface WidgetProps {
    title?: string;
    id: string;
    className?: string;
    actions?: JSX.Element | JSX.Element[];
    children?: JSX.Element | JSX.Element[] | string;
    onClose?: () => void;
}

const Widget = ({
    title,
    id,
    className,
    actions,
    children,
    onClose
}: WidgetProps) => {
    const nodeRef = React.useRef<HTMLElement>(null);

    useEffect(() => {
        if (nodeRef.current) {
            focusWidget(nodeRef.current);
        }
    }, []);

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
                        <Box
                            id={`${id}-bar`}
                            className="widget-bar full-width flex row center"
                        >
                            <Box className="widget-bar-title pl-5 pr-5">
                                {title ?? ''}
                            </Box>
                            <Box className="widget-bar-actions grow flex row center-y">
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
