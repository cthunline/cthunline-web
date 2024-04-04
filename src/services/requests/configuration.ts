import { callApi } from '../api';

import { type Configuration } from '../../types';

export const getConfiguration = async () =>
    callApi<Configuration>({
        method: 'GET',
        route: '/configuration'
    });
