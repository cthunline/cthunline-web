import React, { useEffect, useRef } from 'react';
import {
    Box,
    Paper
} from '@mui/material';

import { PlayLog } from '../../../types';
import AutoScroll from '../autoScroll/AutoScroll';

import './Console.css';

interface ConsoleProps {
    logs: PlayLog[];
}

const Console: React.FC<ConsoleProps> = ({ logs }) => {
    const consoleRef = useRef<HTMLElement>();

    const scrollToBottom = () => {
        consoleRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [
        logs
    ]);

    return (
        <Box className="console-container" ref={consoleRef}>
            <Paper className="console-paper" elevation={3}>
                <Box className="console-inner flex column scroll-always" ref={consoleRef}>
                    {logs.map(({ text }, index) => (
                        <Box
                            key={`console-log-${index.toString()}`}
                            className="console-log"
                        >
                            {text}
                        </Box>
                    ))}
                    <AutoScroll />
                </Box>
            </Paper>
        </Box>
    );
};

export default Console;
