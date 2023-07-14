import { callApi } from '../api';

import { Game } from '../../types';

export const getGames = async () => {
    const { games } = await callApi<{ games: Game[] }>({
        method: 'GET',
        route: '/games'
    });
    return games;
};
