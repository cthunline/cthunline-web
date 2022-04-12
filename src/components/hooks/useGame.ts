import { useState, useEffect } from 'react';

import Api from '../../services/api';
import { useAuth } from '../contexts/Auth';
import { Game } from '../../types';

const useGame = () => {
    const { handleAuthError } = useAuth();

    const [gameList, setGameList] = useState<Game[]>([]);

    const getGame = (gameId: string) => (
        gameList.find(({ id }) => gameId === id)
    );

    useEffect(() => {
        (async () => {
            try {
                const { games } = await Api.call({
                    method: 'GET',
                    route: '/games'
                });
                setGameList(games);
            } catch (err: any) {
                handleAuthError(err);
                throw err;
            }
        })();
    }, [handleAuthError]);

    return {
        gameList,
        getGame
    };
};

export default useGame;
