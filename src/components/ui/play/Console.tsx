import { FaChevronUp, FaChevronDown } from 'react-icons/fa6';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Paper, Stack } from '@mui/material';

import { PlayLog } from '../../../types';
import AutoScroll from '../autoScroll/AutoScroll';
import { useApp } from '../../contexts/App';

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
        <Box
            className="console-container"
            bottom="20px"
            position="absolute"
            right="20px"
            zIndex={0}
            width="450px"
            height={consoleHeight}
        >
            <Paper
                className="console-paper"
                elevation={3}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%'
                }}
            >
                <Stack
                    className="console-bar full-width p-5"
                    direction="row"
                    alignItems="center"
                    justifyContent="start"
                    bgcolor="var(--palette-background-tertiary)"
                    height="30px"
                >
                    <Box className="console-bar-title pl-5 pr-5">
                        {T('entity.console')}
                    </Box>
                    <Stack
                        className="console-bar-actions"
                        direction="row"
                        alignItems="center"
                        justifyContent="end"
                        gap="10px"
                        flexGrow={1}
                        padding="5px"
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
                    </Stack>
                </Stack>
                <Stack
                    className="console-inner"
                    direction="column"
                    display={displayMode === 'minimized' ? 'none' : 'block'}
                    padding={displayMode === 'minimized' ? undefined : '10px'}
                    width="100%"
                    height={0}
                    flexGrow={1}
                >
                    <Stack
                        ref={consoleRef}
                        className="console-logs"
                        direction="column"
                        width="100%"
                        height="100%"
                        sx={{ overflowY: 'scroll' }}
                    >
                        {logs.map(({ text }, index) => (
                            <Box
                                key={`console-log-${index.toString()}`}
                                className="console-log mt-5 mb-5"
                                sx={{
                                    fontSize: '0.825rem'
                                }}
                            >
                                {text}
                            </Box>
                        ))}
                        <AutoScroll />
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Console;
