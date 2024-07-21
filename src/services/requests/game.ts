import { callApi } from '../api.js';

import type { Game } from '../../types/index.js';

export const getGames = async () => {
    const { games } = await callApi<{ games: Game[] }>({
        method: 'GET',
        route: '/games'
    });
    return games;
};
