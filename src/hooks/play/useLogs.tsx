import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';

import { generateId } from '../../services/tools.js';
import { useLocaleStore } from '../../stores/locale.js';
import type { PlayLog, User } from '../../types/index.js';

export interface LogsHookExport {
    logs: PlayLog[];
}

interface PushLogOptions {
    dateTime?: boolean | Date | string;
    user: User;
    isMaster: boolean;
    content: React.ReactNode;
}

export const defaultLogsHookExport: LogsHookExport = {
    logs: []
};

const useLogs = () => {
    const T = useLocaleStore(({ T }) => T);

    const [logs, setLogs] = useState<PlayLog[]>([]);

    const getLogUsername = (logUser: User, isMaster: boolean) => {
        const gmPrefix = `${T('entity.gm')} `;
        return `[${isMaster ? gmPrefix : ''}${logUser?.name}]`;
    };

    const getLogTime = (dateTime: Dayjs | Date | string) => {
        const time = dayjs(dateTime).format(T('format.time'));
        return `[${time}]`;
    };

    const pushLog = ({ dateTime, user, isMaster, content }: PushLogOptions) => {
        const id = generateId();
        const finalContent: React.ReactNode[] = [];
        let logTime: string | undefined;
        if (dateTime === true) {
            logTime = getLogTime(dayjs());
        } else if (dateTime) {
            logTime = getLogTime(dateTime);
        }
        if (logTime) {
            finalContent.push(
                <span key={`log-datetime-${id}`} className="log-datetime">
                    {logTime}
                </span>
            );
        }
        finalContent.push(' ');
        finalContent.push(
            <span key={`log-username-${id}`} className="log-username">
                {getLogUsername(user, isMaster)}
            </span>
        );
        finalContent.push(' ');
        finalContent.push(
            <span key={`log-content-${id}`} className="log-content">
                {content}
            </span>
        );
        setLogs((previous) =>
            [
                ...previous,
                {
                    id,
                    date: new Date(),
                    content: finalContent
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
