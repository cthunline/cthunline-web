import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';

import { useApp } from '../../contexts/App.js';
import type { PlayLog, User } from '../../types/index.js';

export interface LogsHookExport {
    logs: PlayLog[];
}

interface PushLogOptions {
    dateTime?: boolean | Date | string;
    user: User;
    isMaster: boolean;
    text: string;
}

export const defaultLogsHookExport: LogsHookExport = {
    logs: []
};

const useLogs = () => {
    const { T } = useApp();

    const [logs, setLogs] = useState<PlayLog[]>([]);

    const getLogUsername = (logUser: User, isMaster: boolean) => {
        const gmPrefix = `${T('entity.gm')} `;
        return `[${isMaster ? gmPrefix : ''}${logUser?.name}]`;
    };

    const getLogTime = (dateTime: Dayjs | Date | string) => {
        const time = dayjs(dateTime).format(T('format.time'));
        return `[${time}]`;
    };

    const pushLog = ({ dateTime, user, isMaster, text }: PushLogOptions) => {
        const parts = [];
        if (dateTime === true) {
            parts.push(getLogTime(dayjs()));
        } else if (dateTime) {
            parts.push(getLogTime(dateTime));
        }
        parts.push(getLogUsername(user, isMaster));
        parts.push(text);
        const logText = parts.join(' ');
        setLogs((previous) =>
            [
                ...previous,
                {
                    date: new Date(),
                    text: logText
                }
            ].slice(-100)
        );
    };

    return {
        logs,
        pushLog
    };
};

export default useLogs;
