import { Box } from '@mantine/core';
import { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

import { focusWidget } from '../../../services/widget.js';
import WidgetPaper from './WidgetPaper.js';

import './Widget.css';

interface WidgetProps {
    title: string;
    id: string;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    onClose: () => void;
}

const Widget = (props: WidgetProps) => {
    const nodeRef = useRef<HTMLDivElement>(null);

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
            nodeRef={(nodeRef as React.RefObject<HTMLDivElement>) ?? undefined}
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
