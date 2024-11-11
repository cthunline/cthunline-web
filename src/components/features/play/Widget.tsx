import { Box } from '@mantine/core';
import React, { useEffect } from 'react';
import Draggable from 'react-draggable';

import { focusWidget } from '../../../services/widget.js';
import type { WidgetType } from '../../../types/index.js';
import WidgetPaper from './WidgetPaper.js';

import './Widget.css';

interface WidgetProps {
    title: string;
    id: `widget-${WidgetType}`;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    onClose: () => void;
}

const Widget = (props: WidgetProps) => {
    const nodeRef = React.useRef<HTMLDivElement>(null);

    const { id } = props;

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
                ref={nodeRef}
                className="play-widget"
                pos="absolute"
                top="25px"
                left="25px"
                miw="200px"
                mih="100px"
            >
                <WidgetPaper {...props} />
            </Box>
        </Draggable>
    );
};

export default Widget;
