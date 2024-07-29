import { useCallback, useEffect, useState } from 'react';

import { getStatistics } from '../services/requests/stats.js';
import { toast } from '../services/toast.js';
import type { Statistics } from '../types/index.js';

export interface StatisticsHookExport {
    statistics: Statistics;
    refreshStatistics: () => Promise<void>;
}

const defaultStatistics: Statistics = {
    runningSessions: 0,
    totalSessions: 0,
    playingUsers: 0,
    userCharacterCount: 0,
    totalCharacterCount: 0
};

export const defaultStatisticsHookData: StatisticsHookExport = {
    statistics: defaultStatistics,
    refreshStatistics: async () => {
        /* default */
    }
};

const useStatistics = () => {
    const [statistics, setStatistics] = useState<Statistics>(defaultStatistics);

    const refreshStatistics = useCallback(async () => {
        try {
            const stats = await getStatistics();
            setStatistics(stats);
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : 'Statistics error'
            );
            throw err;
        }
    }, []);

    useEffect(() => {
        refreshStatistics();
    }, [refreshStatistics]);

    return {
        statistics,
        refreshStatistics
    };
};

export default useStatistics;
