import { Box, Group, Paper, Stack } from '@mantine/core';
import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import Draggable from 'react-draggable';

import { focusWidget } from '../../../services/widget';

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
    title?: string;
    id: string;
    actions?: JSX.Element | JSX.Element[];
    children?: JSX.Element | JSX.Element[] | string;
    onClose?: () => void;
}

const Widget = ({ title, id, actions, children, onClose }: WidgetProps) => {
    const nodeRef = React.useRef<HTMLDivElement>(null);

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
                <Paper shadow="md" w="100%" miw="200px" h="100%" mih="100px">
                    <Stack w="100%" miw="200px" h="100%" mih="100px">
                        <Group
                            id={`${id}-bar`}
                            justify="center"
                            align="center"
                            bg="var(--palette-background-tertiary)"
                            w="100%"
                            h="30px"
                        >
                            <Box>{title ?? ''}</Box>
                            <Box flex={1} ta="end">
                                {actions}
                            </Box>
                            <MdClose
                                className="clickable"
                                size={25}
                                onClick={onClose}
                            />
                        </Group>
                        <Box
                            w="100%"
                            h="calc(100% - 30px)"
                            mih="70px"
                            p="10px"
                            onMouseDown={(e) => {
                                focusWidget(e.currentTarget);
                            }}
                        >
                            {children}
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Draggable>
    );
};

export default Widget;
