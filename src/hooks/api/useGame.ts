import { useState, useEffect } from 'react';

import { getGames } from '../../services/requests/game.js';
import { type Game } from '../../types/index.js';
import { useApp } from '../../contexts/App.js';

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
