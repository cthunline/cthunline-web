import { callApi } from '../api.js';

import type { Statistics } from '../../types/index.js';

export const getStatistics = async () =>
    callApi<Statistics>({
        method: 'GET',
        route: '/statistics'
    });
