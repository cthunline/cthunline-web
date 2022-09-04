import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import {
    Box,
    Paper
} from '@mui/material';
import {
    FiMinimize2,
    FiMaximize2
} from 'react-icons/fi';

import { PlayLog } from '../../../types';
import AutoScroll from '../autoScroll/AutoScroll';
import { useApp } from '../../contexts/App';

import './Console.css';

interface ConsoleProps {
    logs: PlayLog[];
}

const Console: React.FC<ConsoleProps> = ({ logs }) => {
    const { T } = useApp();

    const [isMinimized, setIsMinimized] = useState<boolean>(false);

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
        <Box className={`console-container ${isMinimized ? 'minimized' : ''}`} ref={consoleRef}>
            <Paper className="console-paper flex column full-width full-height" elevation={3}>
                <Box className="console-bar flex row center-y end-x full-width p-5">
                    <Box className="console-bar-title pl-5 pr-5">
                        {T('entity.console')}
                    </Box>
                    <Box className="console-bar-actions grow flex row center-y end-x">
                        {isMinimized ? (
                            <FiMaximize2
                                size={20}
                                className="clickable"
                                onClick={() => setIsMinimized(false)}
                            />
                        ) : (
                            <FiMinimize2
                                size={20}
                                className="clickable"
                                onClick={() => setIsMinimized(true)}
                            />
                        )}
                    </Box>
                </Box>
                <Box className={`console-inner full-width ${isMinimized ? 'hidden' : 'p-10'} zero-height flex column grow`}>
                    <Box
                        className="console-logs full-width flex column grow column scroll-always"
                        ref={consoleRef}
                    >
                        {logs.map(({ text }, index) => (
                            <Box
                                key={`console-log-${index.toString()}`}
                                className="console-log mt-5 mb-5"
                            >
                                {text}
                            </Box>
                        ))}
                        <AutoScroll />
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Console;
