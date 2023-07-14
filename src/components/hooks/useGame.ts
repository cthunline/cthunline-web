import { useState, useEffect } from 'react';

import { getGames } from '../../services/requests/game';

import { useApp } from '../contexts/App';

import { Game } from '../../types';

const useGame = () => {
    const { handleApiError } = useApp();

    const [gameList, setGameList] = useState<Game[]>([]);

    const getGame = (gameId: string) =>
        gameList.find(({ id }) => gameId === id);

    useEffect(() => {
        (async () => {
            try {
                const games = await getGames();
                setGameList(games);
            } catch (err: any) {
                throw handleApiError(err);
            }
        })();
    }, [handleApiError]);

    return {
        gameList,
        getGame
    };
};

export default useGame;
