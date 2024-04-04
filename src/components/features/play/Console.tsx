import { useState, useEffect, useRef, useMemo } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa6';
import { Box, Group, Paper, Stack } from '@mantine/core';

import AutoScroll from '../../common/AutoScroll';
import { useApp } from '../../contexts/App';
import { type PlayLog } from '../../../types';

const getBaseHeight = (el: HTMLDivElement) => {
    const { clientHeight } = el;
    const { paddingTop, paddingBottom } = getComputedStyle(el);
    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
};

type ConsoleDisplayMode = 'minimized' | 'normal' | 'maximized';

interface ConsoleProps {
    logs: PlayLog[];
    playContentRef: React.RefObject<HTMLDivElement>;
}

const Console = ({ logs, playContentRef }: ConsoleProps) => {
    const { T } = useApp();

    const [displayMode, setDisplayMode] =
        useState<ConsoleDisplayMode>('normal');
    const [maxConsoleHeight, setMaxConsoleHeight] = useState<number | null>(
        300
    );

    const changeDisplay = (action: 'increase' | 'decrease') => {
        setDisplayMode((prev) => {
            if (action === 'increase') {
                return prev === 'minimized' ? 'normal' : 'maximized';
            }
            return prev === 'maximized' ? 'normal' : 'minimized';
        });
    };

    const consoleRef = useRef<HTMLDivElement>(null);

    const consoleHeight: string | undefined = useMemo(() => {
        if (displayMode === 'normal') {
            return '200px';
        }
        if (displayMode === 'maximized') {
            return `${maxConsoleHeight}px`;
        }
        return undefined;
    }, [displayMode, maxConsoleHeight]);

    useEffect(() => {
        if (!playContentRef.current) {
            return () => {};
        }
        const resizeObserver = new ResizeObserver(() => {
            if (playContentRef.current) {
                setMaxConsoleHeight(getBaseHeight(playContentRef.current));
            }
        });
        resizeObserver.observe(playContentRef.current);
        return () => resizeObserver.disconnect();
    }, [playContentRef]);

    const scrollToBottom = () => {
        consoleRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    return (
        <Paper
            shadow="md"
            pos="absolute"
            bottom="20px"
            right="20px"
            w="450px"
            h={consoleHeight}
            style={{ zIndex: 0 }}
        >
            <Stack w="100%" h="100%">
                <Group
                    align="center"
                    justify="start"
                    bg="var(--palette-background-tertiary)"
                    w="100%"
                    h="30px"
                    p="0.25rem"
                >
                    <Box px="0.25rem">{T('entity.console')}</Box>
                    <Group
                        align="center"
                        justify="end"
                        gap="0.5rem"
                        flex={1}
                        p="0.25rem"
                    >
                        <FaChevronDown
                            size={20}
                            className="clickable"
                            onClick={() => changeDisplay('decrease')}
                        />
                        <FaChevronUp
                            size={20}
                            className="clickable"
                            onClick={() => changeDisplay('increase')}
                        />
                    </Group>
                </Group>
                <Stack
                    display={displayMode === 'minimized' ? 'none' : 'block'}
                    p={displayMode === 'minimized' ? undefined : '10px'}
                    w="100%"
                    h={0}
                    flex={1}
                >
                    <Stack
                        ref={consoleRef}
                        w="100%"
                        h="100%"
                        style={{ overflowY: 'scroll' }}
                    >
                        {logs.map(({ text }, index) => (
                            <Box
                                key={`console-log-${index.toString()}`}
                                fs="0.825rem"
                                my="0.25rem"
                            >
                                {text}
                            </Box>
                        ))}
                        <AutoScroll />
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default Console;
