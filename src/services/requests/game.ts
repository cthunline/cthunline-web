import { callApi } from '../api';

import { type Game } from '../../types';

export const getGames = async () => {
    const { games } = await callApi<{ games: Game[] }>({
        method: 'GET',
        route: '/games'
    });
    return games;
};
