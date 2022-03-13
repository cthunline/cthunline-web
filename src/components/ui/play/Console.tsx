import React, { useEffect, useRef } from 'react';
import {
    Box,
    Paper
} from '@mui/material';

import { PlayLog } from '../../../types';

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
            <Paper className="console-inner flex column scroll-always" elevation={3}>
                {logs.map(({ text }) => (
                    <Box className="console-log">
                        {text}
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};

export default Console;
