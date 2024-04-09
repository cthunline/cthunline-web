import { useState, useEffect, useRef, useMemo } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa6';
import { ActionIcon, Stack, Text } from '@mantine/core';

import { type PlayLog } from '../../../types/index.js';
import AutoScroll from '../../common/AutoScroll.js';
import { useApp } from '../../contexts/App.js';
import WidgetPaper from './WidgetPaper.js';

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
        <WidgetPaper
            id="console-widget"
            title={T('entity.console')}
            pos="absolute"
            bottom="20px"
            right="20px"
            w="450px"
            h={consoleHeight}
            style={{ zIndex: 0 }}
            contentProps={{
                display: displayMode === 'minimized' ? 'none' : 'block',
                p: displayMode === 'minimized' ? undefined : '0.5rem'
            }}
            actions={
                <>
                    <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => changeDisplay('decrease')}
                    >
                        <FaChevronDown size="1rem" />
                    </ActionIcon>
                    <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => changeDisplay('increase')}
                    >
                        <FaChevronUp size="1rem" />
                    </ActionIcon>
                </>
            }
        >
            <Stack
                ref={consoleRef}
                w="100%"
                h="100%"
                gap="0.25rem"
                style={{ overflowY: 'scroll' }}
            >
                {logs.map(({ text }, index) => (
                    <Text key={`console-log-${index.toString()}`} fz="0.825rem">
                        {text}
                    </Text>
                ))}
                <AutoScroll />
            </Stack>
        </WidgetPaper>
    );
};

export default Console;
