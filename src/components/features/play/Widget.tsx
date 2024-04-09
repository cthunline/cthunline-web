import React, { useEffect } from 'react';
import Draggable from 'react-draggable';
import { Box } from '@mantine/core';

import { focusWidget } from '../../../services/widget.js';
import WidgetPaper from './WidgetPaper.js';

const triggerEvent = (el: Document | Element, event: string) => {
    el.dispatchEvent(
        new MouseEvent(event, {
            bubbles: true,
            cancelable: true
        })
    );
};

// fake drag event used to move the widget in bounds
// if its size or window size have changed
const fakeDrag = (id: string) => {
    const handleBar = document.querySelector(`#${id}-bar`);
    if (handleBar) {
        triggerEvent(handleBar, 'mousedown');
        setTimeout(() => {
            triggerEvent(handleBar, 'mousemove');
            triggerEvent(handleBar, 'mouseup');
        }, 0);
    }
};

interface WidgetProps {
    title: string;
    id: string;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    onClose: () => void;
}

const Widget = (props: WidgetProps) => {
    const nodeRef = React.useRef<HTMLDivElement>(null);

    const { id } = props;

    // on widget or window resize trigger a fake drag
    // to keep widget in bounds
    useEffect(() => {
        if (!nodeRef.current) {
            return () => {};
        }
        const resizeObserver = new ResizeObserver(() => {
            fakeDrag(id);
        });
        resizeObserver.observe(document.body);
        resizeObserver.observe(nodeRef.current);
        return () => resizeObserver.disconnect();
    }, [id]);

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
