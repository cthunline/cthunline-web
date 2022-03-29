import { useState } from 'react';

import { PlayLog, User } from '../../../types';

export interface LogsHookExport {
    logs: PlayLog[];
}

export const defaultLogsHookExport: LogsHookExport = {
    logs: []
};

const useLogs = () => {
    const [logs, setLogs] = useState<PlayLog[]>([]);

    const getLogUsername = (logUser: User, isMaster: boolean) => (
        `[${isMaster ? 'GM ' : ''}${logUser?.name}]`
    );

    const pushLog = (logUser: User, isMaster: boolean, text: string) => {
        const fullText = `${getLogUsername(logUser, isMaster)} ${text}`;
        setLogs((previous) => (
            [...previous, {
                date: new Date(),
                text: fullText
            }].slice(-100)
        ));
    };

    return {
        logs,
        pushLog
    };
};

export default useLogs;
