import { callApi } from '../api.js';

import type { Configuration } from '../../types/index.js';

export const getConfiguration = async () =>
    callApi<Configuration>({
        method: 'GET',
        route: '/configuration'
    });
